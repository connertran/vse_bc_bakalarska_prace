"use strict";

import { Router } from "express";
import express from "express";
import { BadRequestError } from "../expressError";
import User from "../models/user";
const router = Router();

/** GET /users/ => {users: [{id, name, email, alt_email, tel_number, bio, year_of_study, university_ID, role, hourly_rate}, ...]}
 *
 * Returns list of all users.
 *
 * Authorization required: none
 *
 */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.listAllUsers();
    return res.json({ users });
  } catch (e) {
    return next(e);
  }
});

export default router;
