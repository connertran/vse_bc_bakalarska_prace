"use strict";

import { Router } from "express";
import { BadRequestError, ForbiddenError } from "../expressError";
import Course from "../models/course";
import User from "../models/user";
import courseDataSchema from "../schemas/course/courseData.json";
import userCourseDataSchema from "../schemas/course/userCourseData.json";
import jsonschema, { type ValidationError } from "jsonschema";
import { ensureAdmin } from "../middleware/auth";
import { parseId, parseSearchText } from "./helperFunctions";
import { ensureLoggedIn } from "../middleware/auth";
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

/** GET /courses/search/code?q=4IT101 => {courses: [{id, course_code, name, description, syllabus_URL, is_active, faculty_ID}, ...]}
 *
 * by default return the first 10 active courses
 *
 * Authorization required: logged in
 *
 */
router.get("/search/code", ensureLoggedIn, async function (req, res, next) {
  try {
    const q = parseSearchText(req.query.q, "Search text");
    const courses = await Course.searchByCode(q);
    return res.json({ courses });
  } catch (e) {
    return next(e);
  }
});

/** GET /courses/search/name?q=data structures => {courses: [{id, course_code, name, description, syllabus_URL, is_active, faculty_ID}, ...]}
 *
 *  by default return the first 10 active courses
 *
 * Authorization required: logged in
 *
 */
router.get("/search/name", ensureLoggedIn, async function (req, res, next) {
  try {
    const q = parseSearchText(req.query.q, "Search text");
    const courses = await Course.searchByName(q);
    return res.json({ courses });
  } catch (e) {
    return next(e);
  }
});

/** GET /courses/user/:id => {courses: [{id, course_code, name, syllabus_URL, course_status,
 *                                        confidence_in_explaining, fav_topics, notification_enabled}, ...]}
 *
 *
 * Authorization required: logged in
 *
 */
router.get("/user/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const courses = await Course.findAllByUserId(
      parseId(req.params.id, "User id"),
    );
    return res.json({ courses });
  } catch (e) {
    return next(e);
  }
});

/** POST /courses/user { user_id, course_id, course_status, confidence_in_explaining,
 *                       fav_topics (optional), notification_enabled }
 *   => {userCourse: {user_id, course_id, course_status, confidence_in_explaining,
 *                    fav_topics, notification_enabled}}
 *
 * Let user add a course to their portfolio
 *
 * Authorization required: the user themselves or admin
 *
 */
router.post("/user", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userCourseDataSchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }

    // user can only add courses to their OWN account
    const user = await User.findById(req.body.user_id);
    const isSelf = user.email === res.locals.user.email;
    if (!isSelf && !res.locals.user.isAdmin)
      throw new ForbiddenError("You can only change your own courses");

    const userCourse = await Course.addCourseToUser(req.body);
    return res.status(201).json({ userCourse });
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
