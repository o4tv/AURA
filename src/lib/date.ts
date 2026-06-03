export function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getDeadlineMeta(dueDate: string) {
  const due = new Date(dueDate);
  const today = getTodayStart();
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffMs = dueStart.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays < 0) {
    return {
      tone: "danger",
      label: "Entrega vencida",
    };
  }

  if (diffDays === 0) {
    return {
      tone: "danger",
      label: "Entrega hoje",
    };
  }

  if (diffDays === 1) {
    return {
      tone: "warning",
      label: "Entrega amanhã",
    };
  }

  if (diffDays <= 3) {
    return {
      tone: "warning",
      label: `Entrega em ${diffDays} dias`,
    };
  }

  if (diffDays <= 7) {
    return {
      tone: "attention",
      label: `Entrega em ${diffDays} dias`,
    };
  }

  return {
    tone: "normal",
    label: `Entrega em ${diffDays} dias`,
  };
}

export function formatDateShort(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function isDueToday(dueDate: string) {
  return getDeadlineMeta(dueDate).label === "Entrega hoje";
}

export function isOverdue(dueDate: string) {
  const due = new Date(dueDate);
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return dueStart.getTime() < getTodayStart().getTime();
}

export function isWithinDays(dueDate: string, days: number) {
  const due = new Date(dueDate);
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round(
    (dueStart.getTime() - getTodayStart().getTime()) / (24 * 60 * 60 * 1000),
  );
  return diffDays >= 0 && diffDays <= days;
}

export function formatDateTimeLocal(value: string) {
  const date = new Date(value);
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}
