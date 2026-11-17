"use strict";

import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import Session from "./session";
import User from "./user";

type ReviewData = {
  reviewer_id: number;
  reviewee_id: number;
  session_event_id: number;
  overall_rating: number;
  comment?: string;
  role: string;
};

class Review {
  /** Find a review by id */
  static async findById(id: number) {
    const result = await db.query(
      `SELECT id, overall_rating, "comment", role, created_at,
              session_event_ID, reviewee_ID, reviewer_ID
       FROM review
       WHERE id = $1`,
      [id],
    );
    const review = result.rows[0];

    if (!review) throw new NotFoundError(`No review with id: ${id}`);

    return review;
  }

  /** Find all reviews received by a user - sorted by newest*/
  static async findAllByUserId(userId: number) {
    //existence check
    await User.findById(userId);

    const result = await db.query(
      `SELECT review.id, review.overall_rating, review."comment", review.role,
              review.created_at, review.session_event_ID,
              reviewer.id AS reviewer_id, reviewer.name AS reviewer_name
       FROM review
       JOIN "user" AS reviewer ON reviewer.id = review.reviewer_ID
       WHERE review.reviewee_ID = $1
       ORDER BY review.created_at DESC`,
      [userId],
    );

    return result.rows.map(function ({
      reviewer_id,
      reviewer_name,
      ...review
    }) {
      return { ...review, reviewer: { id: reviewer_id, name: reviewer_name } };
    });
  }

  /** Calculate user's average rating (null if no reviews) */
  static async getRatingByUserId(userId: number) {
    await User.findById(userId);

    const result = await db.query(
      `SELECT ROUND(AVG(overall_rating), 2)::float AS average,
              COUNT(*)::int AS count
       FROM review
       WHERE reviewee_ID = $1`,
      [userId],
    );
    return result.rows[0];
  }

  /** Create a review - user reviews another user for a session */
  static async create(data: ReviewData) {
    if (data.reviewer_id === data.reviewee_id)
      throw new BadRequestError("You cannot review yourself");

    // existence checks
    await User.findById(data.reviewer_id);
    await User.findById(data.reviewee_id);

    await Session.findById(data.session_event_id);

    // one review per reviewer, reviewee and session
    const duplicateCheck = await db.query(
      `SELECT id
       FROM review
       WHERE reviewer_ID = $1 AND reviewee_ID = $2 AND session_event_ID = $3`,
      [data.reviewer_id, data.reviewee_id, data.session_event_id],
    );
    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        "You already reviewed this user for this session",
      );

    const result = await db.query(
      `INSERT INTO review (overall_rating, "comment", role, created_at,
                           session_event_ID, reviewee_ID, reviewer_ID)
       VALUES ($1, $2, $3, NOW(), $4, $5, $6)
       RETURNING id, overall_rating, "comment", role, created_at,
                 session_event_ID, reviewee_ID, reviewer_ID`,
      [
        data.overall_rating,
        data.comment ?? null,
        data.role,
        data.session_event_id,
        data.reviewee_id,
        data.reviewer_id,
      ],
    );
    return result.rows[0];
  }

  /** Delete a review by id => undefined*/
  static async delete(id: number) {
    const result = await db.query(
      `DELETE FROM review
       WHERE id = $1
       RETURNING id`,
      [id],
    );
    if (!result.rows[0]) throw new NotFoundError(`No review with id: ${id}`);
  }
}

export default Review;
