"use strict";

import { Router } from "express";
import { BadRequestError, ForbiddenError } from "../expressError";
import FieldOfStudy from "../models/fieldOfStudy";
import User from "../models/user";
import fieldOfStudySchema from "../schemas/fieldOfStudy/fieldOfStudy.json";
import jsonschema, { type ValidationError } from "jsonschema";
import { ensureAdmin, ensureLoggedIn } from "../middleware/auth";
const router = Router();

/** GET /fields-of-study/:id => {fieldOfStudy: {id, name, faculty_id}}
 *
 * Returns a field of study by id.
 *
 * Authorization required: none
 *
 */
router.get("/:id", async function (req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1)
      throw new BadRequestError("Field of study id must be a positive integer");

    const fieldOfStudy = await FieldOfStudy.findById(id);
    return res.json({ fieldOfStudy });
  } catch (e) {
    return next(e);
  }
});

/** POST /fields-of-study/ { name, faculty } => {fieldOfStudy: {id, name, faculty_id}}
 *
 *
 * Authorization required: admin
 *
 */
router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, fieldOfStudySchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }
    const fieldOfStudy = await FieldOfStudy.create(req.body);
    return res.status(201).json({ fieldOfStudy });
  } catch (e) {
    return next(e);
  }
});

/** POST /fields-of-study/:fieldOfStudyId/users/:userId => {fieldOfStudy: {id, name, faculty_id}}

 * Authorization required: the user themselves or an admin
 *
 */
router.post(
  "/:fieldOfStudyId/users/:userId",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const fieldOfStudyId = Number(req.params.fieldOfStudyId);
      const userId = Number(req.params.userId);
      if (
        !Number.isInteger(fieldOfStudyId) ||
        fieldOfStudyId < 1 ||
        !Number.isInteger(userId) ||
        userId < 1
      )
        throw new BadRequestError(
          "Field of study id and user id must be positive integers",
        );

      // user can only change their own fields of study
      const user = await User.findById(userId);
      const isSelf = user.email === res.locals.user.email;
      if (!isSelf && !res.locals.user.isAdmin)
        throw new ForbiddenError(
          "You can only change your own fields of study",
        );

      const fieldOfStudy = await FieldOfStudy.addUserToFieldOfStudy(
        userId,
        fieldOfStudyId,
      );
      return res.status(201).json({ fieldOfStudy });
    } catch (e) {
      return next(e);
    }
  },
);

export default router;
