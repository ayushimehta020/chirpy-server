import argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./error_classes.js";
import { Request } from "express";
import crypto from "crypto";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(
  userId: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);

  const payload: Payload = {
    iss: "chirpy",
    sub: userId,
    iat,
    exp: iat + expiresIn,
  };

  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decoded = jwt.verify(tokenString, secret);

    if (typeof decoded === "string" || !decoded.sub) {
      throw new UnauthorizedError("Invalid token");
    }

    return decoded.sub;
  } catch {
    throw new UnauthorizedError("Invalid token");
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new UnauthorizedError("Missing Authorization header");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid Authorization header");
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    throw new UnauthorizedError("Missing token");
  }

  return token;
}

export function makeRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
