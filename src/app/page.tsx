import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listTasks } from "@/lib/tasks";
import { ProfessorWorkspace } from "@/components/professor-workspace";

export default async function Professor() {
  const user = await auth();
  if (!user) {
    redirect("/login");
  }
  // redirect(`/${user.type}`)
}
