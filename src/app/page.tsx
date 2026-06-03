import { TaskBoard } from "@/components/task-board";
import { listTasks } from "@/lib/tasks";
import styles from "./page.module.css";

export default async function Home() {
  const tasks = listTasks();

  return (
    <main className={styles.page}>
      <div className={styles.titleGroup}>
        <h2 className={styles.title}>Lista de Tarefas</h2>
        <span className="muted">
          Pesquisa, filtragem e ordenação de tarefas.
        </span>
      </div>
      <TaskBoard tasks={tasks} />
    </main>
  );
}
