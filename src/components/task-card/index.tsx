import type { Task } from '@/types/task';
import { formatDateShort, getDeadlineMeta } from '@/lib/date';

type TaskCardProps = {
  task: Task;
  checked: boolean;
  onToggle: (taskId: string) => void;
};

export function TaskCard({ task, checked, onToggle }: TaskCardProps) {
  const deadline = getDeadlineMeta(task.dueDate);
  const toneClass =
    deadline.tone === 'danger'
      ? 'task-card-danger'
      : deadline.tone === 'warning'
        ? 'task-card-warning'
        : deadline.tone === 'attention'
          ? 'task-card-attention'
          : '';

  return (
    <article className={`task-card ${toneClass}`}>
      <div className="task-card-header">
        <label className="task-card-check">
          <input type="checkbox" checked={checked} onChange={() => onToggle(task.id)} />
          <span>{checked ? 'Concluida' : 'Marcar como concluida'}</span>
        </label>
        <span className="task-card-date">{formatDateShort(task.dueDate)}</span>
      </div>

      <div className="task-card-body">
        <h3>{task.title}</h3>
        <span className="task-card-deadline-badge">{deadline.label}</span>
        <p className="task-card-description">{task.description}</p>
      </div>
    </article>
  );
}
