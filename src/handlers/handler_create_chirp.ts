import { Request, Response } from "express";
import { BadRequestError } from "../error_classes.js";
import { createChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type ChirpRequest = {
  body: string;
};

export async function handlerCreateChirp(
  req: Request,
  res: Response,
): Promise<void> {
  let { body } = req.body as ChirpRequest;

  if (typeof body !== "string") {
    res.status(400).json({
      error: "Something went wrong",
    });
    return;
  }

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.auth.jwtSecret);

  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const badWords = ["kerfuffle", "sharbert", "fornax"];

  const cleaned = body
    .split(" ")
    .map((word) => (badWords.includes(word.toLowerCase()) ? "****" : word))
    .join(" ");

  const chirp = await createChirp({ body: cleaned, userId });

  res.status(201).json(chirp);
}
