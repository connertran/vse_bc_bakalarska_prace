"use strict";

// this middleware is used for route authorization

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { UnauthorizedError } from "../expressError";
import { Request, Response, NextFunction } from "express";

/** Middleware: Authenticate user.
 *
 * Before every request, check if the route is provided with a JWT token in the http header.
 * If yes, verify the token, and store the token payload on res.locals.user.
 * If no, do nothing and move on to the next middleware.
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  try {
    let authHeader;
    if (req.headers) {
      authHeader = req.headers.authorization;
    } else {
      authHeader = undefined;
    }

    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (e) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (e) {
    return next(e);
  }
}

/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin)
      throw new UnauthorizedError();
    return next();
  } catch (e) {
    return next(e);
  }
}

export { authenticateJWT, ensureLoggedIn, ensureAdmin };
