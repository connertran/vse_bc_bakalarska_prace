type UserLoginData = {
  email: string;
  password: string;
};

type UserRegisterData = {
  name: string;
  email: string;
  alt_email: string;
  password: string;
  tel_number: string;
  bio: string;
  year_of_study: number;
};

type CourseInsertData = {
  code: string;
  name: string;
  semester: string;
  faculty: string;
  url: string;
};

// GET /users/:id
type UserProfile = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  alt_email: string | null;
  alt_email_verified: boolean;
  tel_number: string | null;
  profile_pic: string;
  bio: string | null;
  year_of_study: number | null;
  role: string;
  hourly_rate: number | null;
  university: { id: number; name: string; email_domain: string } | null;
  faculties: { id: number; name: string }[];
};

// GET /reviews/users/:userId/rating
type UserRating = {
  average: number | null;
  count: number;
};

// GET /sessions/users/:userId/completed
type CompletedSessions = {
  as_requester: string;
  as_provider: string;
  total: string;
};

// GET /courses/user/:id
type UserCourse = {
  id: number;
  course_code: string;
  name: string;
  syllabus_url: string;
  course_status: string;
  confidence_in_explaining: number;
  fav_topics: string | null;
  notification_enabled: boolean;
};

export type {
  UserCourse,
  UserLoginData,
  UserRegisterData,
  CourseInsertData,
  UserProfile,
  UserRating,
  CompletedSessions,
};
