"use strict";

/** Shared config for application; can be required many places. */
import "dotenv/config";

import "colors";

const SECRET_KEY = process.env.SECRET_KEY || "secret-key";

const PORT = Number(process.env.PORT) || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (
    process.env.DATABASE_URL ||
    "postgresql://postgres:1234@localhost:5432/tutoring_db"
  );
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Tutoring app Config:".green);
console.log("SECRET_KEY:".bgYellow, SECRET_KEY);
console.log("PORT:".bgYellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".bgYellow, BCRYPT_WORK_FACTOR);
console.log("Database:".bgYellow, getDatabaseUri());
console.log("---");

export default {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
