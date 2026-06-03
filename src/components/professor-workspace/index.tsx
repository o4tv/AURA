"use client";

import { useActionState, useEffect, useState } from "react";
import { taskMutationAction } from "@/actions/tasks";
import type { SchoolClass } from "@/types/school-class";
import type { Task } from "@/types/task";
import { formatDateOnly, formatDateShort, getCurrentDateKey, getDeadlineMeta } from "@/lib/date";
import { TaskForm } from "../task-form";

const initialTaskMutationState = {
  status: "idle",
  message: "",
} as const;

type ProfessorWorkspaceProps = {
  schoolClass: SchoolClass;
  tasks: Task[];
};

export function ProfessorWorkspace({ schoolClass, tasks }: ProfessorWorkspaceProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [noticeText, setNoticeText] = useState("");
  const [noticeExpiry, setNoticeExpiry] = useState("");
  const [state, formAction, isPending] = useActionState(
    taskMutationAction,
    initialTaskMutationState,
  );

  useEffect(() => {
    if (state.status === "success") {
      setSelectedTask(null);
      setFormVersion((current) => current + 1);
      setNoticeText("");
      setNoticeExpiry("");
    }
  }, [state.status, state.message]);

  function startEditing(task: Task) {
    setSelectedTask(task);
    setFormVersion((current) => current + 1);
  }

  function cancelEditing() {
    setSelectedTask(null);
    setFormVersion((current) => current + 1);
  }

  function clearNotice() {
    setNoticeText("");
    setNoticeExpiry("");
  }

  return (
    <section className="professor-workspace">
      <div className="professor-workspace-section-title">
        <div className="professor-workspace-title-group">
          <h2 className="professor-workspace-title">{schoolClass.name}</h2>
          <span className="muted">
            Crie, altere ou exclua uma tarefa desta turma.
          </span>
        </div>
        {selectedTask ? (
          <button className="secondary" type="button" onClick={cancelEditing}>
            Cancelar edição
          </button>
        ) : null}
      </div>

      <form className="task-form" action={formAction}>
        <input type="hidden" name="mode" value="notice-create" />
        <input type="hidden" name="classId" value={schoolClass.id} />

        <label className="task-form-fields">
          <span>Novo aviso</span>
          <textarea
            name="message"
            rows={4}
            placeholder="Escreva um aviso para a turma..."
            value={noticeText}
            onChange={(event) => setNoticeText(event.target.value)}
            required
          />
        </label>

        <label className="task-form-fields">
          <span>Data para desaparecer</span>
          <input
            type="date"
            name="expiresOn"
            min={getCurrentDateKey()}
            value={noticeExpiry}
            onChange={(event) => setNoticeExpiry(event.target.value)}
            required
          />
        </label>

        <div className="task-form-actions">
          <button type="submit" disabled={isPending}>
            {isPending ? "Publicando..." : "Publicar aviso"}
          </button>
          <button
            className="secondary"
            type="button"
            onClick={clearNotice}
            disabled={isPending || (noticeText.length === 0 && noticeExpiry.length === 0)}
          >
            Limpar
          </button>
        </div>
      </form>

        {schoolClass.notices.length > 0 ? (
          <div className="professor-workspace-rows">
            {schoolClass.notices.map((notice) => (
            <article
              key={notice.id}
              className="professor-workspace-row professor-workspace-notice-row"
            >
              <div className="professor-workspace-main">
                <div className="professor-workspace-row-title">
                  <strong>Aviso da turma</strong>
                  <span className="professor-workspace-notice-tag">
                    Publicado
                  </span>
                </div>
                <p className="professor-workspace-meta">
                  <span>Publicado em {formatDateShort(notice.createdAt)}</span>
                  <span className="professor-workspace-notice-expiry">
                    Expira em {formatDateOnly(notice.expiresOn)}
                  </span>
                  <span className="muted">{notice.message}</span>
                </p>
              </div>

              <div className="professor-workspace-actions">
                <form action={formAction}>
                  <input type="hidden" name="mode" value="notice-delete" />
                  <input type="hidden" name="classId" value={schoolClass.id} />
                  <input type="hidden" name="noticeId" value={notice.id} />
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
          ))}
        </div>
      ) : null}

      <TaskForm
        key={formVersion}
        classId={schoolClass.id}
        task={selectedTask ?? undefined}
        formAction={formAction}
        isPending={isPending}
        onCancel={selectedTask ? cancelEditing : undefined}
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
                  <input type="hidden" name="classId" value={schoolClass.id} />
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
