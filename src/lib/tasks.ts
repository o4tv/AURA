import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Task } from "@/types/task";

export type TaskFormInput = {
  title: string;
  description: string;
  dueDate: string;
};

const TASKS_FILE = resolve(process.cwd(), "data", "tasks.json");

function ensureStoreFile() {
  const directory = dirname(TASKS_FILE);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  if (!existsSync(TASKS_FILE)) {
    writeFileSync(TASKS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function readStore(): Task[] {
  ensureStoreFile();

  try {
    const content = readFileSync(TASKS_FILE, "utf8");
    const parsed = JSON.parse(content) as Task[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((task) => {
        return (
          typeof task?.id === "string" &&
          typeof task?.title === "string" &&
          typeof task?.description === "string" &&
          typeof task?.dueDate === "string" &&
          typeof task?.createdAt === "string"
        );
      })
      .map((task) => ({ ...task }));
  } catch {
    const empty: Task[] = [];
    writeStore(empty);
    return empty;
  }
}

function writeStore(tasks: Task[]) {
  ensureStoreFile();
  writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

function clone(task: Task) {
  return { ...task };
}

function normalizeDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}

export function listTasks() {
  return readStore()
    .map(clone)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
}

export function getTaskById(id: string) {
  return readStore().find((task) => task.id === id) ?? null;
}

export function createTask(input: TaskFormInput) {
  const dueDate = normalizeDate(input.dueDate);
  if (!dueDate) {
    throw new Error("Data de entrega invalida.");
  }

  const tasks = readStore();
  const task: Task = {
    id: randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    dueDate,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  writeStore(tasks);
  return clone(task);
}

export function updateTask(id: string, input: TaskFormInput) {
  const tasks = readStore();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error("Tarefa nao encontrada.");
  }

  const dueDate = normalizeDate(input.dueDate);
  if (!dueDate) {
    throw new Error("Data de entrega invalida.");
  }

  tasks[index] = {
    ...tasks[index],
    title: input.title.trim(),
    description: input.description.trim(),
    dueDate,
  };

  writeStore(tasks);
  return clone(tasks[index]);
}

export function deleteTask(id: string) {
  const tasks = readStore();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  writeStore(tasks);
  return true;
}
