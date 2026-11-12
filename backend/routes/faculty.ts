"use strict";

import { Router } from "express";
import { BadRequestError } from "../expressError";
import Faculty from "../models/faculty";
import facultyDataSchema from "../schemas/faculty/facultyData.json";
import jsonschema, { type ValidationError } from "jsonschema";
import { ensureAdmin } from "../middleware/auth";
const router = Router();

/** GET /faculties/ => {faculties: [{id, name, university_ID}, ...]}
 *
 * Returns list of all faculties.
 *
 * Authorization required: none
 *
 */
router.get("/", async function (req, res, next) {
  try {
    const faculties = await Faculty.findAll();
    return res.json({ faculties });
  } catch (e) {
    return next(e);
  }
});

/** GET /faculties/:name => {faculty: {id, name, university_ID}}
 *
 * Returns a faculty by name.
 *
 * Authorization required: none
 *
 */
router.get("/:name", async function (req, res, next) {
  try {
    const faculty = await Faculty.findByName(String(req.params.name));
    return res.json({ faculty });
  } catch (e) {
    return next(e);
  }
});

/** POST /faculties/ { name, email_domain } => {faculty: {id, name, university_ID}}
 *
 * Adds a new faculty to the university with the given email domain.
 *
 * Authorization required: admin
 *
 */
router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, facultyDataSchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }
    const faculty = await Faculty.create(req.body);
    return res.status(201).json({ faculty });
  } catch (e) {
    return next(e);
  }
});

/** DELETE /faculties/:id => {deleted: id}
 *
 * Deletes a faculty.
 *
 * Authorization required: admin
 *
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const faculty = await Faculty.delete(Number(req.params.id));
    return res.json({ deleted: faculty.id });
  } catch (e) {
    return next(e);
  }
});

export default router;
