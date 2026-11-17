"use strict";

import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import Faculty from "./faculty";
import User from "./user";

type FieldOfStudyData = {
  name: string;
  faculty: string;
};

class FieldOfStudy {
  static async findById(id: number) {
    const result = await db.query(
      `SELECT id, name, faculty_ID
       FROM field_of_study
       WHERE id = $1`,
      [id],
    );
    const fieldOfStudy = result.rows[0];

    if (!fieldOfStudy)
      throw new NotFoundError(`No field of study with id: ${id}`);

    return fieldOfStudy;
  }

  static async create(data: FieldOfStudyData) {
    // existence check
    const faculty = await Faculty.findByName(data.faculty);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM field_of_study
       WHERE name = $1 AND faculty_ID = $2`,
      [data.name, faculty.id],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `Field of study ${data.name} already exists in faculty ${data.faculty}`,
      );
    }

    const result = await db.query(
      `INSERT INTO field_of_study (name, faculty_ID)
       VALUES ($1, $2)
       RETURNING id, name, faculty_ID`,
      [data.name, faculty.id],
    );
    return result.rows[0];
  }

  static async addUserToFieldOfStudy(userId: number, fieldOfStudyId: number) {
    const user = await User.findById(userId);
    const fieldOfStudy = await FieldOfStudy.findById(fieldOfStudyId);

    const duplicateCheck = await db.query(
      `SELECT user_ID
       FROM user_field_of_study
       WHERE user_ID = $1 AND field_of_study_ID = $2`,
      [userId, fieldOfStudyId],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `User ${userId} already has the field of study ${fieldOfStudy.name}`,
      );
    }

    await db.query(
      `INSERT INTO user_field_of_study (user_ID, field_of_study_ID)
       VALUES ($1, $2)`,
      [userId, fieldOfStudyId],
    );
    return fieldOfStudy;
  }
}

export default FieldOfStudy;
