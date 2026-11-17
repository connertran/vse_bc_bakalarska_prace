"use strict";

import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import University from "./university";
import User from "./user";

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

  static async findById(id: number) {
    const result = await db.query(
      `SELECT id, name, university_ID
       FROM faculty
       WHERE id = $1`,
      [id],
    );
    const faculty = result.rows[0];

    if (!faculty) throw new NotFoundError(`No faculty with id: ${id}`);

    return faculty;
  }

  static async addUserToFaculty(userId: number, facultyId: number) {
    // 404 error...user or faculty does not exist
    const user = await User.findById(userId);
    const faculty = await Faculty.findById(facultyId);

    // user cant join a faculty that is not in their university
    if (user.university?.id !== faculty.university_id) {
      throw new BadRequestError(
        `Faculty ${faculty.name} is not part of the user's university`,
      );
    }

    const duplicateCheck = await db.query(
      `SELECT user_ID
       FROM user_faculty
       WHERE user_ID = $1 AND faculty_ID = $2`,
      [userId, facultyId],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `User ${userId} is already in faculty ${faculty.name}`,
      );
    }

    await db.query(
      `INSERT INTO user_faculty (user_ID, faculty_ID)
       VALUES ($1, $2)`,
      [userId, facultyId],
    );
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
