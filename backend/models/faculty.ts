"use strict";

import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import University from "./university";

type FacultyData = {
  name: string;
  email_domain: string;
};

class Faculty {
  static async findAll() {
    const result = await db.query(
      `SELECT id, name, university_ID
       FROM faculty`,
    );
    return result.rows;
  }

  static async findByName(name: string) {
    const uppercaseName = name.toUpperCase();
    const result = await db.query(
      `SELECT id, name, university_ID
       FROM faculty
       WHERE name = $1`,
      [uppercaseName],
    );
    const faculty = result.rows[0];

    if (!faculty) throw new NotFoundError(`No faculty with name: ${name}`);

    return faculty;
  }

  static async create(data: FacultyData) {
    // university existence check
    const university = await University.findByEmailDomain(data.email_domain);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM faculty
       WHERE name = $1 AND university_ID = $2`,
      [data.name, university.id],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `Faculty ${data.name} already exists for university ${university.name}`,
      );
    }

    const result = await db.query(
      `INSERT INTO faculty (name, university_ID)
       VALUES ($1, $2)
       RETURNING id, name, university_ID`,
      [data.name, university.id],
    );
    return result.rows[0];
  }

  static async delete(id: number) {
    const result = await db.query(
      `DELETE FROM faculty
       WHERE id = $1
       RETURNING id`,
      [id],
    );
    const faculty = result.rows[0];

    if (!faculty) throw new NotFoundError(`No faculty: ${id}`);

    return faculty;
  }
}

export default Faculty;
