"use strict";

import db from "../db";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../expressError";
import bcrypt from "bcrypt";
import University from "./university";

type userRegisterData = {
  name: string;
  email: string;
  alt_email: string;
  password: string;
  tel_number: string;
  bio: string;
  year_of_study: number;
};

class User {
  static async checkDuplicateEmail(email: string, alt_email: string) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM "user"
       WHERE email IN ($1, $2)
          OR alt_email IN ($1, $2)`,
      [email, alt_email],
    );
    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(
        `Email ${email} or alt_email ${alt_email} already in use`,
      );
    }
  }

  static async create(data: userRegisterData) {
    // Check if email or alt_email is already in use
    await User.checkDuplicateEmail(data.email, data.alt_email);

    // Check for valid university email domain
    const emailDomain = data.email.split("@")[1];
    const university = await University.findByEmailDomain(emailDomain);
    if (!university) {
      throw new BadRequestError("Invalid university email domain");
    }
    const universityId = university.id;

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Insert user into database
    const result = await db.query(
      `INSERT INTO "user" (name, email, alt_email, hashed_password, tel_number, bio, year_of_study, university_ID)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, alt_email, tel_number, bio, year_of_study, university_ID`,
      [
        data.name,
        data.email,
        data.alt_email,
        hashedPassword,
        data.tel_number,
        data.bio,
        data.year_of_study,
        universityId,
      ],
    );
    const user = result.rows[0];

    return user;
  }

  static async authenticate(email: string, password: string) {
    const result = await db.query(
      `SELECT id, name, email, alt_email, hashed_password, tel_number, bio, year_of_study, university_ID, role, hourly_rate
       FROM "user"
       WHERE email = $1 OR alt_email = $1`,
      [email],
    );
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user with email: ${email}`);
    const isValid = await bcrypt.compare(password, user.hashed_password);
    if (!isValid) throw new UnauthorizedError("Invalid Email or Password");
    return user;
  }

  static async listAllUsers() {
    const result = await db.query(
      `SELECT id, name, email, alt_email, tel_number, bio, year_of_study, university_ID, role, hourly_rate
       FROM "user"
       ORDER BY id`,
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await db.query(
      `SELECT id, name, email, alt_email, tel_number, bio, year_of_study, university_ID, role, hourly_rate
       FROM "user"
       WHERE id = $1`,
      [id],
    );
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user with id: ${id}`);
    return user;
  }
}

export default User;
