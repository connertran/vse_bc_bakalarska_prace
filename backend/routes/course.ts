"use strict";

import { Router } from "express";
import { BadRequestError } from "../expressError";
import Course from "../models/course";
import courseDataSchema from "../schemas/course/courseData.json";
import jsonschema, { type ValidationError } from "jsonschema";
import { ensureAdmin } from "../middleware/auth";
import { parseId } from "./helperFunctions";
const router = Router();

/** GET /courses/ => {courses: [{id, course_code, name, description, syllabus_URL, is_active, faculty_ID}, ...]}
 *
 * Returns list of all courses.
 *
 * Authorization required: none
 *
 */
router.get("/", async function (req, res, next) {
  try {
    const courses = await Course.findAll();
    return res.json({ courses });
  } catch (e) {
    return next(e);
  }
});

/** GET /courses/:id => {course: {id, course_code, name, description, syllabus_URL, is_active, faculty_ID}}
 *
 * Returns a course by id.
 *
 * Authorization required: none
 *
 */
router.get("/:id", async function (req, res, next) {
  try {
    const course = await Course.findById(parseId(req.params.id, "Course id"));
    return res.json({ course });
  } catch (e) {
    return next(e);
  }
});

/** POST /courses/ { code, name, semester, faculty, url } => {course: {...}}
 *
 * Adds a new course. The faculty (by name) must already exist.
 *
 * Authorization required: admin
 *
 */
router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, courseDataSchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }
    const course = await Course.create(req.body);
    return res.status(201).json({ course });
  } catch (e) {
    return next(e);
  }
});

/** PUT /courses/:id { code, name, semester, faculty, url } => {course: {...}}
 *
 * Updates a course. The faculty (by name) must already exist.
 *
 * Authorization required: admin
 *
 */
router.put("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, courseDataSchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }
    const course = await Course.update(
      parseId(req.params.id, "Course id"),
      req.body,
    );
    return res.json({ course });
  } catch (e) {
    return next(e);
  }
});

/** DELETE /courses/:id => {deleted: id}
 *
 * Deletes a course.
 *
 * Authorization required: admin
 *
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const course = await Course.delete(parseId(req.params.id, "Course id"));
    return res.json({ deleted: course.id });
  } catch (e) {
    return next(e);
  }
});

export default router;
