"use strict";

import db from "../db";
import { NotFoundError } from "../expressError";
import User from "./user";

class Session {
  static async findById(id: number) {
    const result = await db.query(
      `SELECT id
       FROM session_event
       WHERE id = $1`,
      [id],
    );
    const session = result.rows[0];

    if (!session) throw new NotFoundError(`No session event with id: ${id}`);

    return session;
  }

  /** Count the completed session events of a user
   *
   * in session participant table, we have two roles for each participant: requester and provider
   *
   *The completed session events has the status "completed"
   */
  static async countCompletedByUserId(userId: number) {
    // existence check
    await User.findById(userId);

    const result = await db.query(
      `SELECT COUNT(*) FILTER (WHERE session_participant.role = 'requester') AS as_requester,
              COUNT(*) FILTER (WHERE session_participant.role = 'provider') AS as_provider,
              COUNT(*) AS total
       FROM session_participant
       JOIN session_event ON session_event.id = session_participant.session_event_ID
       WHERE session_participant.user_ID = $1
         AND session_event.status = 'completed'`,
      [userId],
    );
    return result.rows[0];
  }
}

export default Session;
