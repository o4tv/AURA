import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getClassById, listTasksByClassId } from "@/lib/tasks";
import { ProfessorWorkspace } from "@/components/professor-workspace";
import styles from "./page.module.css";

export default async function ProfessorClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role === "student") {
    redirect("/estudante");
  }

  const { classId } = await params;
  const schoolClass = getClassById(classId);
  if (!schoolClass) {
    redirect("/professor");
  }

  const tasks = listTasksByClassId(schoolClass.id);

  return (
    <main className={styles.page}>
      <Link className={`ghost-button ${styles.backLink}`} href="/professor">
        Voltar para turmas
      </Link>

      <ProfessorWorkspace schoolClass={schoolClass} tasks={tasks} />
    </main>
  );
}
