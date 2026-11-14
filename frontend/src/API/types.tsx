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

export type { UserLoginData, UserRegisterData, CourseInsertData };
