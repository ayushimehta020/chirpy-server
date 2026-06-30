import { User } from "./db/schema.js";

export type UserResponse = Omit<User, "hashedPassword">;
