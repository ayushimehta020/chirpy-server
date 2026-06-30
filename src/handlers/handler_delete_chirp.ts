import { Request, Response } from "express";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { deleteChirp, getChirpById } from "../db/queries/chirps.js";
import { ChirpParams } from "./handler_get_chirp_by_id.js";
import { ForbiddenError, NotFoundError } from "../error_classes.js";

export async function handlerDeleteChirp(
  req: Request<ChirpParams>,
  res: Response,
) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.auth.jwtSecret);

  const { chirpId } = req.params;

  const chirp = await getChirpById(chirpId);

  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }

  if (chirp.userId !== userId) {
    throw new ForbiddenError("You are not authorized to delete this chirp");
  }

  await deleteChirp(chirpId);

  res.status(204).send();
}
