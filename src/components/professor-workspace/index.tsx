"use client";

import { useActionState, useEffect, useState } from "react";
import { taskMutationAction } from "@/actions/tasks";
import type { Task } from "@/types/task";
import { formatDateShort, getDeadlineMeta } from "@/lib/date";
import { TaskForm } from "../task-form";

const initialTaskMutationState = {
  status: "idle",
  message: "",
} as const;

type ProfessorWorkspaceProps = {
  tasks: Task[];
};

export function ProfessorWorkspace({ tasks }: ProfessorWorkspaceProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [state, formAction, isPending] = useActionState(
    taskMutationAction,
    initialTaskMutationState,
  );

  useEffect(() => {
    if (state.status === "success") {
      setSelectedTask(null);
      setFormVersion((current) => current + 1);
    }
  }, [state.status]);

  function startEditing(task: Task) {
    setSelectedTask(task);
    setFormVersion((current) => current + 1);
  }

  return (
    <section className="professor-workspace">
      <div className="professor-workspace-section-title">
        <div className="professor-workspace-title-group">
          <h2 className="professor-workspace-title">Painel do Professor</h2>
          <span className="muted">
            Crie, altere ou exclua uma tarefa sem sair desta pagina.
          </span>
        </div>
        {selectedTask ? (
          <button
            className="secondary"
            type="button"
            onClick={() => setSelectedTask(null)}
          >
            Cancelar edição
          </button>
        ) : null}
      </div>

      <TaskForm
        key={formVersion}
        task={selectedTask ?? undefined}
        formAction={formAction}
        isPending={isPending}
        onCancel={selectedTask ? () => setSelectedTask(null) : undefined}
      />

      {state.status !== "idle" && state.message ? (
        <p
          className={`professor-workspace-feedback ${
            state.status === "success"
              ? "professor-workspace-feedback-success"
              : "professor-workspace-feedback-error"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="professor-workspace-section-title">
        <h2 className="professor-workspace-title">Tarefas publicadas</h2>
        <span className="muted">{tasks.length} itens</span>
      </div>

      <div className="professor-workspace-rows">
        {tasks.map((task) => {
          const deadline = getDeadlineMeta(task.dueDate);
          const toneClass =
            deadline.tone === "danger"
              ? "professor-workspace-danger"
              : deadline.tone === "warning"
                ? "professor-workspace-warning"
                : deadline.tone === "attention"
                  ? "professor-workspace-attention"
                  : "";

          return (
            <article
              key={task.id}
              className={`professor-workspace-row ${toneClass}`}
            >
              <div className="professor-workspace-main">
                <div className="professor-workspace-row-title">
                  <strong>{task.title}</strong>
                  <span className="professor-workspace-deadline-badge">
                    {deadline.label}
                  </span>
                </div>
                <p className="professor-workspace-meta">
                  <span>{formatDateShort(task.dueDate)}</span>
                  <span className="muted">
                    {task.description.slice(0, 120)}
                    {task.description.length > 120 ? "..." : ""}
                  </span>
                </p>
              </div>

              <div className="professor-workspace-actions">
                <button
                  className="secondary"
                  type="button"
                  onClick={() => startEditing(task)}
                >
                  Editar
                </button>

                <form action={formAction}>
                  <input type="hidden" name="mode" value="delete" />
                  <input type="hidden" name="id" value={task.id} />
                  <button
                    className="secondary"
                    type="submit"
                    disabled={isPending}
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </article>
          );
        })}
        <br />
      </div>
    </section>
  );
}
