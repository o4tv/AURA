import type { User, UserCredentials } from "@/types/user";

function loadUsersFromEnv(): UserCredentials[] {
  const raw = process.env.AUTH_USERS_JSON;
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry): entry is UserCredentials =>
          typeof entry === "object" &&
          entry !== null &&
          "email" in entry &&
          "name" in entry &&
          "password" in entry &&
          "role" in entry &&
          typeof (entry as UserCredentials).email === "string" &&
          typeof (entry as UserCredentials).name === "string" &&
          typeof (entry as UserCredentials).password === "string" &&
          ((entry as UserCredentials).role === "teacher" ||
            (entry as UserCredentials).role === "student")
      )
      .map((user) => ({
        email: user.email.trim(),
        name: user.name.trim(),
        password: user.password,
        role: user.role,
        classId:
          typeof user.classId === "string" && user.classId.trim().length > 0
            ? user.classId.trim()
            : undefined,
      }))
      .filter(
        (user) =>
          user.email.length > 0 &&
          user.name.length > 0 &&
          user.password.length > 0,
      );
  } catch {
    return [];
  }
}

const USERS = loadUsersFromEnv();

function toPublicUser(user: UserCredentials): User {
  const { password, ...publicUser } = user;
  return publicUser;
}

export function findUserByEmail(email: string) {
  const user = USERS.find((entry) => entry.email === email);
  return user ? toPublicUser(user) : null;
}

export function findUserByCredentials(email: string, password: string) {
  const user = USERS.find(
    (entry) => entry.email === email && entry.password === password,
  );

  return user ? toPublicUser(user) : null;
}

export function listUsers() {
  return USERS.map(toPublicUser);
}
