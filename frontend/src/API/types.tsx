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

export type { UserLoginData, UserRegisterData };
