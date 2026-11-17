"use strict";

import db from "../db";
import { NotFoundError } from "../expressError";

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
}

export default Session;
