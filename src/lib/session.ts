import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/users";

export async function getCurrentUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return null;
  }

  return findUserByEmail(email);
}
