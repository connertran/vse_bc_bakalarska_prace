"use strict";

import { Router } from "express";
import { BadRequestError, ForbiddenError } from "../expressError";
import Review from "../models/review";
import User from "../models/user";
import reviewSchema from "../schemas/review/reviewData.json";
import jsonschema, { type ValidationError } from "jsonschema";
import { ensureLoggedIn } from "../middleware/auth";
import { parseId } from "./helperFunctions";

const router = Router();

/** GET /reviews/users/:userId => {reviews: [{id, overall_rating, comment, role,
 *    created_at, session_event_id, reviewer: {id, name}}, ...]}
 *
 * Returns all reviews received by the user.
 *
 * Authorization required: logged in
 */
router.get("/users/:userId", ensureLoggedIn, async function (req, res, next) {
  try {
    const userId = parseId(req.params.userId, "User id");
    const reviews = await Review.findAllByUserId(userId);
    return res.json({ reviews });
  } catch (e) {
    return next(e);
  }
});

/** GET /reviews/users/:userId/rating => {rating: {average, count}}
 *
 * Returns the user's average rating (null if no reviews)
 *
 * Authorization required: logged in
 */
router.get(
  "/users/:userId/rating",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const userId = parseId(req.params.userId, "User id");
      const rating = await Review.getRatingByUserId(userId);
      return res.json({ rating });
    } catch (e) {
      return next(e);
    }
  },
);

/** POST /reviews/
 *    { reviewer_id, reviewee_id, session_event_id, overall_rating, comment, role }
 *    => {review: {id, overall_rating, comment, role, created_at,
 *        session_event_id, reviewee_id, reviewer_id}}
 *
 * overall_rating: 1-5 (integer, required)
 * role: "provider" or "requester" (string, required)
 * comment: (string, optional)
 *
 * Authorization required: the reviewer themselves or an admin
 */
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, reviewSchema);
    if (!validator.valid) {
      const errs = validator.errors
        .map((e: ValidationError) => e.message)
        .join(", ");
      throw new BadRequestError(errs);
    }

    // the logged in user must be the reviewer
    const reviewer = await User.findById(req.body.reviewer_id);
    const isSelf = reviewer.email === res.locals.user.email;
    if (!isSelf && !res.locals.user.isAdmin)
      throw new ForbiddenError("You can only be a reviewer");

    const review = await Review.create(req.body);
    return res.status(201).json({ review });
  } catch (e) {
    return next(e);
  }
});

/** DELETE /reviews/:id => {deleted: id}
 *
 * Authorization required: the reviewer who wrote it or an admin
 */
router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const id = parseId(req.params.id, "Review id");

    // only the author (or an admin) can delete the review
    const review = await Review.findById(id);
    const reviewer = await User.findById(Number(review.reviewer_id));
    const isSelf = reviewer.email === res.locals.user.email;
    if (!isSelf && !res.locals.user.isAdmin)
      throw new ForbiddenError("You are not authorized to delete this review");

    await Review.delete(id);
    return res.json({ deleted: id });
  } catch (e) {
    return next(e);
  }
});

export default router;
