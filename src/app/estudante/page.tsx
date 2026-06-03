import { redirect } from "next/navigation";
import { TaskBoard } from "@/components/task-board";
import { formatDateOnly, formatDateShort } from "@/lib/date";
import { getCurrentUser } from "@/lib/session";
import { getClassById, listTasksByClassId } from "@/lib/tasks";
import styles from "./page.module.css";

export default async function Student() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role === "teacher") {
    redirect("/professor");
  }

  const schoolClass = user.classId ? getClassById(user.classId) : null;
  if (!schoolClass) {
    redirect("/login");
  }

  const tasks = listTasksByClassId(schoolClass.id);

  return (
    <main className={styles.page}>
      <div className={styles.titleGroup}>
        <h2 className={styles.title}>{schoolClass.name}</h2>
        <span className="muted">Tarefas da sua turma.</span>
      </div>

      {schoolClass.notices.length > 0 ? (
        <section className={styles.noticesSection}>
          <div className={styles.noticesGrid}>
            {schoolClass.notices.map((notice) => (
              <article key={notice.id} className={styles.noticeCard}>
                <div className={styles.noticeCardHeader}>
                  <strong>Aviso da turma</strong>
                  <span className={styles.noticeCardDate}>
                    Publicado em {formatDateShort(notice.createdAt)}
                  </span>
                </div>
                <span className={styles.noticeCardExpiry}>
                  Expira em {formatDateOnly(notice.expiresOn)}
                </span>
                <p className={styles.noticeCardMessage}>{notice.message}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <TaskBoard tasks={tasks} classId={schoolClass.id} />
    </main>
  );
}
