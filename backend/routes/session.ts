"use strict";

import { Router } from "express";
import Session from "../models/session";
import { ensureLoggedIn } from "../middleware/auth";
import { parseId } from "./helperFunctions";

const router = Router();

/** GET /sessions/users/:userId/completed => {completed: {as_requester, as_provider, total}}
 *
 * Return # of user's completed session events
 * - as_requester
 * - as_provider
 * - total
 *
 * Authorization required: logged in
 */
router.get(
  "/users/:userId/completed",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const userId = parseId(req.params.userId, "User id");
      const completed = await Session.countCompletedByUserId(userId);
      return res.json({ completed });
    } catch (e) {
      return next(e);
    }
  },
);

export default router;
