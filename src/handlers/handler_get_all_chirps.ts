import { Request, Response } from "express";
import { getAllChirps } from "../db/queries/chirps.js";

export async function handlerGetAllChirps(req: Request, res: Response) {
  const chirps = await getAllChirps();
  res.json(chirps);
}
