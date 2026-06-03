"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types/task";
import { COMPLETED_TASKS_KEY } from "@/lib/constants";
import { TaskCard } from "../task-card";
import { isDueToday, isOverdue, isWithinDays } from "@/lib/date";

type TaskBoardProps = {
  tasks: Task[];
};

export function TaskBoard({ tasks }: TaskBoardProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deadline, setDeadline] = useState("all");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(COMPLETED_TASKS_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed)) {
        setCompletedIds(parsed.filter((id) => typeof id === "string"));
      }
    } catch {
      window.localStorage.removeItem(COMPLETED_TASKS_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      COMPLETED_TASKS_KEY,
      JSON.stringify(completedIds),
    );
  }, [completedIds]);

  const filteredTasks = tasks.filter((task) => {
    const haystack = `${task.title} ${task.description}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const isCompleted = completedIds.includes(task.id);

    const matchesStatus =
      status === "all" ||
      (status === "done" && isCompleted) ||
      (status === "open" && !isCompleted);

    const matchesDeadline =
      deadline === "all" ||
      (deadline === "today" && isDueToday(task.dueDate)) ||
      (deadline === "week" && isWithinDays(task.dueDate, 7)) ||
      (deadline === "overdue" && isOverdue(task.dueDate));

    return matchesSearch && matchesStatus && matchesDeadline;
  });

  const hasPublishedTasks = tasks.length > 0;

  function toggleCompleted(taskId: string) {
    setCompletedIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  }

  return (
    <section className="task-board">
      <div className="task-board-filters">
        <label>
          <span>Busca</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Título ou descrição"
          />
        </label>

        <label>
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">Todas</option>
            <option value="open">Abertas</option>
            <option value="done">Concluidas</option>
          </select>
        </label>

        <label>
          <span>Prazo</span>
          <select
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="today">Hoje</option>
            <option value="week">Ate 7 dias</option>
            <option value="overdue">Vencidas</option>
          </select>
        </label>
      </div>

      <div className="task-board-list">
        {!hasPublishedTasks ? (
          <div className="task-board-empty-state">
            <strong>Nenhuma tarefa foi publicada ainda.</strong>
            <span>
              Quando o professor publicar tarefas, elas vão aparecer aqui.
            </span>
          </div>
        ) : filteredTasks.length < 1 ? (
          <div className="task-board-empty-state">
            <strong>Nenhuma tarefa encontrada.</strong>
            <span>
              Altere os filtros ou remova a busca para ver mais resultados.
            </span>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              checked={completedIds.includes(task.id)}
              onToggle={toggleCompleted}
            />
          ))
        )}
      </div>
    </section>
  );
}
