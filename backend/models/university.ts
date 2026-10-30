"use strict";

import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";

/** Fields the caller sends when creating or updating a university. */
type UniversityData = {
  name: string;
  email_domain: string;
};

class University {
  /** Return every university. */
  static async findAll() {
    const result = await db.query(
      `SELECT id, name, email_domain
       FROM university`,
    );
    return result.rows;
  }

  /** Return one university, or 404 when the id does not exist. */
  static async findById(id: number) {
    const result = await db.query(
      `SELECT id, name, email_domain
       FROM university
       WHERE id = $1`,
      [id],
    );
    const university = result.rows[0];

    if (!university) throw new NotFoundError(`No university with id: ${id}`);

    return university;
  }

  /** Insert a university and return the saved row. */
  static async create(data: UniversityData) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM university
       WHERE name = $1 AND email_domain = $2`,
      [data.name, data.email_domain],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `University ${data.name} with email domain ${data.email_domain} already exists`,
      );
    }

    const result = await db.query(
      `INSERT INTO university (name, email_domain)
       VALUES ($1, $2)
       RETURNING id, name, email_domain`,
      [data.name, data.email_domain],
    );
    return result.rows[0];
  }

  /** Replace name and email domain, or 404 when the id does not exist. */
  static async update(id: number, data: UniversityData) {
    const result = await db.query(
      `UPDATE university
       SET name = $1, email_domain = $2
       WHERE id = $3
       RETURNING id, name, email_domain`,
      [data.name, data.email_domain, id],
    );
    const university = result.rows[0];

    if (!university) throw new NotFoundError(`No university: ${id}`);

    return university;
  }

  /** Delete a university, or 404 when the id does not exist. */
  static async delete(id: number) {
    const result = await db.query(
      `DELETE FROM university
       WHERE id = $1
       RETURNING id`,
      [id],
    );
    const university = result.rows[0];

    if (!university) throw new NotFoundError(`No university: ${id}`);

    return university;
  }
}

export default University;
