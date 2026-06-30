import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";
import { UserResponse } from "../types.js";

type UserRequest = {
  email: string;
  password: string;
};

export async function handlerCreateUser(
  req: Request,
  res: Response,
): Promise<void> {
  const { email, password } = req.body as UserRequest;

  const hashedPassword = await hashPassword(password);

  const user = await createUser({ email, hashedPassword });

  const response: UserResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  };

  res.status(201).json(response);
}
