"use strict";

import jwt from "jsonwebtoken";
import config from "../config";

type User = {
  name: string;
  email: string;
  alt_email: string;
  role: string;
};

/** return signed JWT from user data. */

function createToken(user: User) {
  const userRole = user.role;
  const isAdmin = userRole === "admin";

  // JWT payloads are encoded, not encrypted.
  // Do not store sensitive information in the payload.
  let payload = {
    name: user.name,
    email: user.email,
    alt_email: user.alt_email,
    role: user.role,
    isAdmin: isAdmin,
  };
  return jwt.sign(payload, config.SECRET_KEY);
}

export default { createToken };
