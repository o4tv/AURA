import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listTasks } from "@/lib/tasks";
import { ProfessorWorkspace } from "@/components/professor-workspace";

export default async function Professor() {
  const teacher = await auth();
  if (!teacher) {
    redirect("/login");
  }

  const tasks = listTasks();

  return <ProfessorWorkspace tasks={tasks} />;
}
