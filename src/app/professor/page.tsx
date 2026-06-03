import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { listClasses } from "@/lib/tasks";
import styles from "./page.module.css";

export default async function Professor() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role === "student") {
    redirect("/estudante");
  }

  const classes = listClasses();

  return (
    <main className={styles.page}>
      <div className={styles.titleGroup}>
        <h2 className={styles.title}>Turmas</h2>
        <span className="muted">
          Clique em uma turma para editar suas tarefas.
        </span>
      </div>

      <div className={styles.classGrid}>
        {classes.map((schoolClass) => (
          <Link
            key={schoolClass.id}
            className={styles.classCard}
            href={`/professor/${schoolClass.id}`}
          >
            <strong>{schoolClass.name}</strong>
            <div className={styles.classCardMeta}>
              <span>{schoolClass.tasks.length} tarefas</span>
              <span>Editar turma</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
