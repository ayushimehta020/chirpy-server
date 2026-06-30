import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerMetrics(req: Request, res: Response) {
  console.log(`Hits: ${config.api.fileServerHits}`);

  res.status(200).set("Content-Type", "text/html; charset=utf-8").send(`
      <html>
        <body>
          <h1>Welcome, Chirpy Admin</h1>
          <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
        </body>
      </html>
    `);
}
