import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

export type AuthConfig = {
  jwtSecret: string;
  polkaKey: string;
};

export type APIConfig = {
  fileServerHits: number;
  platform: string;
};

export type DBConfig = {
  dbUrl: string;
  migrationConfig: MigrationConfig;
};

export type Config = {
  api: APIConfig;
  db: DBConfig;
  auth: AuthConfig;
};

export const config: Config = {
  api: {
    fileServerHits: 0,
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    dbUrl: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "./drizzle",
    },
  },
  auth: {
    jwtSecret: envOrThrow("JWT_SECRET"),
    polkaKey: envOrThrow("POLKA_KEY"),
  },
};

function envOrThrow(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}
