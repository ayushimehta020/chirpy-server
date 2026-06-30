import { Request, Response } from "express";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { updateUser } from "../db/queries/users.js";

type UpdateUserRequest = {
  email: string;
  password: string;
};

export async function handlerUpdateUser(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.auth.jwtSecret);

  const { email, password } = req.body as UpdateUserRequest;

  const hashedPassword = await hashPassword(password);

  const user = await updateUser(userId, email, hashedPassword);

  res.status(200).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
