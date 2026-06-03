export type UserRole = "teacher" | "student";

export type User = {
  email: string;
  name: string;
  role: UserRole;
  classId?: string;
};

export type UserCredentials = User & {
  password: string;
};
