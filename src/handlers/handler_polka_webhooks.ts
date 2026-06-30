import { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { NotFoundError } from "../error_classes.js";

type PolkaWebhooksRequest = {
  event: string;
  data: {
    userId: string;
  };
};

export async function handlerPolkaWebhooks(req: Request, res: Response) {
  const { event, data } = req.body as PolkaWebhooksRequest;

  if (event !== "user.upgraded") {
    return res.status(204).send();
  }

  const user = await upgradeUser(data.userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return res.status(204).send();
}
