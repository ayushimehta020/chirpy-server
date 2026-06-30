import { Request, Response } from "express";
import { UnauthorizedError } from "../error_classes.js";
import { getBearerToken, makeJWT } from "../auth.js";
import { getUserFromRefreshToken } from "../db/queries/refresh_tokens.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  const user = await getUserFromRefreshToken(refreshToken);

  if (!user) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const accessToken = makeJWT(user.id, 60 * 60, config.auth.jwtSecret);

  res.status(200).json({ token: accessToken });
}
