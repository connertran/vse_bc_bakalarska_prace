"use strict";

/** Express app for chat app. */

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import authRouter from "./auth/auth";
import universityRouter from "./routes/university";
// using cors to communicate with the front-end
import cors from "cors";
import morgan from "morgan";
import { NotFoundError } from "./expressError";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRouter);
app.use("/universities", universityRouter);
/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
// middleware to handle errors
app.use(function (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

export default app;
