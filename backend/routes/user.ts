"use strict";

import { Router } from "express";
import express from "express";
import User from "../models/user";
import { ensureLoggedIn } from "../middleware/auth";
import { parseId } from "./helperFunctions";
const router = Router();

/** GET /users/ => {users: [{id, name, email, alt_email, tel_number, bio, year_of_study, university_ID, role, hourly_rate}, ...]}
 *
 * Returns list of all users.
 *
 * Authorization required: logged in
 *
 */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const users = await User.listAllUsers();
    return res.json({ users });
  } catch (e) {
    return next(e);
  }
});

/** GET /users/:id => {user: {id, name, email, email_verified, alt_email, alt_email_verified, tel_number, bio, year_of_study, role, hourly_rate, university: {id, name, email_domain}, faculties: [{id, name}, ...]}}
 *
 * Authorization required: logged in
 *
 */
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const id = parseId(req.params.id, "User id");
    const user = await User.findById(id);
    return res.json({ user });
  } catch (e) {
    return next(e);
  }
});

export default router;
