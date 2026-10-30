"use strict";

import { Router } from "express";
import express from "express";
import { BadRequestError } from "../expressError";
import University from "../models/university";
import universityDataSchema from "../schemas/university/universityData.json";
import jsonschema from "jsonschema";
import { Validator, type ValidationError } from "jsonschema";
const router = Router();

/** GET /universities/ => {universities: [{id, name, email_domain}, ...]}
 *
 * Returns list of all universities.
 *
 * Authorization required: none
 *
 */
router.get("/", async function (req, res, next) {
  try {
    const universities = await University.findAll();
    return res.json({ universities });
  } catch (e) {
    return next(e);
  }
});

/** GET /universities/:id => {university: {id, name, email_domain}}
 *
 * Returns a university by id.
 *
 * Authorization required: none
 *
 */
router.get("/:id", async function (req, res, next) {
  try {
    const university = await University.findById(Number(req.params.id));
    return res.json({ university });
  } catch (e) {
    return next(e);
  }
});

/** POST /universities/ => {university: {id, name, email_domain}}
 *
 * Adds a new university.
 *
 * Authorization required: admin (TODO: add this later)
 *
 */
router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, universityDataSchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }
    const university = await University.create(req.body);
    return res.status(201).json({ university });
  } catch (e) {
    return next(e);
  }
});

/** PUT /universities/:id => {university: {id, name, email_domain}}
 *
 * Updates a university.
 *
 * Authorization required: admin (TODO: add this later)
 *
 */
router.put("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, universityDataSchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }
    const university = await University.update(Number(req.params.id), req.body);
    return res.json({ university });
  } catch (e) {
    return next(e);
  }
});

/** DELETE /universities/:id => {deleted: id}
 *
 * Deletes a university.
 *
 * Authorization required: admin (TODO: add this later)
 *
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const university = await University.delete(Number(req.params.id));
    return res.json({ deleted: university.id });
  } catch (e) {
    return next(e);
  }
});

export default router;
