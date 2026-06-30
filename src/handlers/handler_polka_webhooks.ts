import { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../error_classes.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

type PolkaWebhooksRequest = {
  event: string;
  data: {
    userId: string;
  };
};

export async function handlerPolkaWebhooks(req: Request, res: Response) {
  const apiKey = getAPIKey(req);

  if (apiKey !== config.auth.polkaKey) {
    throw new UnauthorizedError("Invalid API key");
  }

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
