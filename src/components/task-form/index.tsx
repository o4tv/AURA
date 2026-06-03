import { formatDateTimeLocal } from "@/lib/date";
import type { Task } from "@/types/task";

type TaskFormProps = {
  classId: string;
  task?: Task;
  formAction: (formData: FormData) => void;
  isPending?: boolean;
  onCancel?: () => void;
};

export function TaskForm({
  classId,
  task,
  formAction,
  isPending = false,
  onCancel,
}: TaskFormProps) {
  const isEditing = Boolean(task);
  const taskId = task?.id;

  return (
    <form className="task-form" action={formAction}>
      <input type="hidden" name="mode" value="save" />
      <input type="hidden" name="classId" value={classId} />
      {taskId ? <input type="hidden" name="id" value={taskId} /> : null}

      <label className="task-form-fields">
        <span>Título</span>
        <input
          name="title"
          defaultValue={task?.title ?? ""}
          required
          maxLength={120}
        />
      </label>

      <label className="task-form-fields">
        <span>Descrição</span>
        <textarea
          name="description"
          defaultValue={task?.description ?? ""}
          required
          rows={8}
        />
      </label>

      <label className="task-form-fields">
        <span>Data de entrega</span>
        <input
          type="datetime-local"
          name="dueDate"
          defaultValue={task?.dueDate ? formatDateTimeLocal(task.dueDate) : ""}
          required
        />
      </label>

      <div className="task-form-actions">
        <button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Criar tarefa"}
        </button>
        {isEditing && onCancel ? (
          <button
            className="secondary"
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
