import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { UnauthorizedError } from "../error_classes.js";
import { UserResponse } from "../types.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refresh_tokens.js";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

export async function handlerLogin(req: Request, res: Response) {
  const { email, password } = req.body as LoginRequest;

  const user = await getUserByEmail(email);

  if (!user || !(await checkPasswordHash(password, user.hashedPassword))) {
    throw new UnauthorizedError("invalid email or password");
  }

  const token = makeJWT(user.id, 60 * 60, config.auth.jwtSecret);

  const refreshToken = makeRefreshToken();

  await createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  });

  const response: LoginResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token,
    refreshToken,
    isChirpyRed: user.isChirpyRed,
  };

  res.status(200).json(response);
}
