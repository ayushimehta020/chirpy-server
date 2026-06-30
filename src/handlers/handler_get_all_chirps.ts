import { Request, Response } from "express";
import { getAllChirps } from "../db/queries/chirps.js";

export async function handlerGetAllChirps(req: Request, res: Response) {
  const { authorId, sort } = req.query;

  const chirps = await getAllChirps(
    typeof authorId === "string" ? authorId : undefined,
  );

  chirps.sort((a, b) => {
    if (sort === "desc") {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }

    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  res.json(chirps);
}
