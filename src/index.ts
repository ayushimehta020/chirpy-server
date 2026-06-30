// External packages
import express from "express";
import postgres from "postgres";
import { config } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

// Handlers
import { handlerReadiness } from "./handlers/handler_readiness.js";
import { handlerMetrics } from "./handlers/handler_metrics.js";
import { handlerReset } from "./handlers/handler_reset.js";
import { handlerCreateUser } from "./handlers/handler_create_user.js";
import { handlerCreateChirp } from "./handlers/handler_create_chirp.js";
import { handlerGetAllChirps } from "./handlers/handler_get_all_chirps.js";

// Middlewares
import { middlewareLogResponses } from "./middlewares/middleware_log_responses.js";
import { middlewareMetricsInc } from "./middlewares/middleware_metrics_inc.js";
import { errorHandler } from "./middlewares/middleware_error_handler.js";
import { handlerGetChirpById } from "./handlers/handler_get_chirp_by_id.js";
import { handlerLogin } from "./handlers/handler_login.js";
import { handlerRefresh } from "./handlers/handler_refresh.js";
import { handlerRevoke } from "./handlers/handler_revoke.js";
import { handlerUpdateUser } from "./handlers/handler_update_user.js";
import { handlerDeleteChirp } from "./handlers/handler_delete_chirp.js";

const migrationClient = postgres(config.db.dbUrl, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

await migrationClient.end();

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);

app.post("/admin/reset", handlerReset);

app.get("/api/healthz", handlerReadiness);

app.post("/api/users", handlerCreateUser);
app.put("/api/users", handlerUpdateUser);

app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetAllChirps);
app.get("/api/chirps/:chirpId", handlerGetChirpById);
app.delete("/api/chirps/:chirpId", handlerDeleteChirp);

app.post("/api/login", handlerLogin);

app.post("/api/refresh", handlerRefresh);

app.post("/api/revoke", handlerRevoke);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
