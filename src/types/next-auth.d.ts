import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: UserRole;
      classId?: string;
    };
  }

  interface User {
    role?: UserRole;
    classId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    classId?: string;
  }
}
