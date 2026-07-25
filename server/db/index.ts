import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = "/home/nigerlaptops/niger-laptop/server/db/niger-laptops.db";

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
