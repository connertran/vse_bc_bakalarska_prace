"use strict";
/** Database setup for tutoring. */
import { Client } from "pg";
import config from "./config";

let db: Client;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: config.getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    connectionString: config.getDatabaseUri(),
  });
}

db.connect();

export default db;
