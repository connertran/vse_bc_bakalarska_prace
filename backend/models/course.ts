"use strict";

import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import Faculty from "./faculty";

type CourseData = {
  code: string; // course.course_code
  name: string; // course.name
  semester: string; // course.description
  faculty: string; // faculty name
  url: string; // course.syllabus_URL
};

// Columns returned for every course
const COURSE_COLUMNS = `id, course_code, name, description, syllabus_URL, is_active, faculty_ID`;

class Course {
  static async findAll() {
    const result = await db.query(
      `SELECT ${COURSE_COLUMNS}
       FROM course`,
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await db.query(
      `SELECT ${COURSE_COLUMNS}
       FROM course
       WHERE id = $1`,
      [id],
    );
    const course = result.rows[0];

    if (!course) throw new NotFoundError(`No course with id: ${id}`);

    return course;
  }

  static async create(data: CourseData) {
    // if faculty does not exist, throw an error
    // only create course for the existing faculty
    const faculty = await Faculty.findByName(data.faculty);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM course
       WHERE course_code = $1 AND description = $2 AND faculty_ID = $3`,
      [data.code, data.semester, faculty.id],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `Course ${data.code} for ${data.semester} already exists in faculty ${data.faculty}`,
      );
    }

    const result = await db.query(
      `INSERT INTO course (course_code, name, description, syllabus_URL, faculty_ID)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COURSE_COLUMNS}`,
      [data.code, data.name, data.semester, data.url, faculty.id],
    );
    return result.rows[0];
  }

  static async update(id: number, data: CourseData) {
    // course existence check
    await Course.findById(id);

    // faculty existence check
    const faculty = await Faculty.findByName(data.faculty);

    // if we are editing with data, which already in a different course (with different id), throw an error
    const duplicateCheck = await db.query(
      `SELECT id
       FROM course
       WHERE course_code = $1 AND description = $2 AND faculty_ID = $3 AND id <> $4`,
      [data.code, data.semester, faculty.id, id],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `Course ${data.code} for ${data.semester} already exists in faculty ${data.faculty}`,
      );
    }

    const result = await db.query(
      `UPDATE course
       SET course_code = $1, name = $2, description = $3, syllabus_URL = $4, faculty_ID = $5
       WHERE id = $6
       RETURNING ${COURSE_COLUMNS}`,
      [data.code, data.name, data.semester, data.url, faculty.id, id],
    );
    return result.rows[0];
  }

  static async delete(id: number) {
    const result = await db.query(
      `DELETE FROM course
       WHERE id = $1
       RETURNING id`,
      [id],
    );
    const course = result.rows[0];

    if (!course) throw new NotFoundError(`No course: ${id}`);

    return course;
  }
}

export default Course;
