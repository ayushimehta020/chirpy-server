import { Request, Response } from "express";
import { getChirpById } from "../db/queries/chirps.js";
import { NotFoundError } from "../error_classes.js";

export type ChirpParams = {
  chirpId: string;
};

export async function handlerGetChirpById(
  req: Request<ChirpParams>,
  res: Response,
) {
  const { chirpId } = req.params;

  const chirp = await getChirpById(chirpId);

  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }

  res.status(200).json(chirp);
}
