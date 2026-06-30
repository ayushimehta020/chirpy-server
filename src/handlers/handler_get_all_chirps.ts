import { Request, Response } from "express";
import { getAllChirps } from "../db/queries/chirps.js";

export async function handlerGetAllChirps(req: Request, res: Response) {
  const { authorId } = req.query;

  const chirps = await getAllChirps(
    typeof authorId === "string" ? authorId : undefined,
  );

  res.json(chirps);
}
