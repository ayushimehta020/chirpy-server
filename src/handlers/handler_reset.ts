import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "../error_classes.js";
import { deleteAllUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
  const platform = config.api.platform;

  if (platform !== "dev") {
    throw new ForbiddenError("Forbidden");
  }

  await deleteAllUsers();

  config.api.fileServerHits = 0;

  res.status(200).set("Content-Type", "text/plain; charset=utf-8").send("OK");
}
