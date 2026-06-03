import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getCurrentDateKey } from "@/lib/date";
import type { SchoolClass } from "@/types/school-class";
import type { Task, TaskFormInput } from "@/types/task";

const CLASSES_FILE = resolve(process.cwd(), "data", "classes.json");

const DEFAULT_CLASSES: SchoolClass[] = [
  {
    id: "1a",
    name: "1º Ano A",
    notices: [],
    tasks: [
      {
        id: "aa91977e-a5d8-4e35-94f0-cfcc6fb15509",
        title: "Prova de Sociologia",
        description: "Conteudo são as leis",
        dueDate: "2026-06-08T13:00:00.000Z",
        createdAt: "2026-06-03T01:32:47.412Z",
      },
      {
        id: "447a098a-fc78-4272-8312-d5fe5e730f93",
        title: "Tarefa para o Feriado",
        description: "tarefa teste insana",
        dueDate: "2026-06-04T03:00:00.000Z",
        createdAt: "2026-06-03T01:31:41.583Z",
      },
      {
        id: "bddd416c-44aa-4339-90ab-e07595f60300",
        title: "Pesquisa de Kellvyn",
        description: "Entregar pesquisa sobre LGPD.",
        dueDate: "2026-06-02T16:00:00.000Z",
        createdAt: "2026-06-03T01:30:46.524Z",
      },
      {
        id: "f0dd0a1d-8dda-4d42-ac02-2a460b0c7138",
        title: "Prova de Espanhol",
        description: "Conteúdo:\r\n- Ênclise\r\n- Próclise",
        dueDate: "2026-06-13T01:00:00.000Z",
        createdAt: "2026-06-03T01:27:29.924Z",
      },
    ],
  },
  {
    id: "1b",
    name: "1º Ano B",
    notices: [],
    tasks: [
      {
        id: "646802e0-2715-4628-8171-28c485e08bcb",
        title: "Desenho de Geografia",
        description:
          "Fazer um desenho sobre uma cidade com problemas. problemas esses que nós devemos resolver.",
        dueDate: "2026-06-03T16:41:00.000Z",
        createdAt: "2026-06-02T11:41:50.008Z",
      },
      {
        id: "a5def66e-f3f2-4418-9ec5-063e34173d9d",
        title: "Atividade de Programaçao WEB I & II",
        description: "Apresentação estilo Shark Tank",
        dueDate: "2026-06-03T10:00:00.000Z",
        createdAt: "2026-06-02T11:17:22.926Z",
      },
      {
        id: "c2eca8ff-6830-4545-8691-69175c67d04b",
        title: "Tarefa de Inglês",
        description: "mandar um áudio insano falando inglês pro email lucylannagames@gmail.com",
        dueDate: "2026-06-11T14:00:00.000Z",
        createdAt: "2026-05-31T06:19:21.896Z",
      },
    ],
  },
];

function ensureStoreFile() {
  const directory = dirname(CLASSES_FILE);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  if (!existsSync(CLASSES_FILE)) {
    writeFileSync(CLASSES_FILE, JSON.stringify(DEFAULT_CLASSES, null, 2), "utf8");
  }
}

function isTask(value: unknown): value is Task {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Task).id === "string" &&
    typeof (value as Task).title === "string" &&
    typeof (value as Task).description === "string" &&
    typeof (value as Task).dueDate === "string" &&
    typeof (value as Task).createdAt === "string"
  );
}

function isClassNotice(value: unknown): value is SchoolClass["notices"][number] {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { id?: unknown }).id === "string" &&
    typeof (value as { message?: unknown }).message === "string" &&
    typeof (value as { createdAt?: unknown }).createdAt === "string" &&
    typeof (value as { expiresOn?: unknown }).expiresOn === "string"
  );
}

function isNoticeActive(notice: SchoolClass["notices"][number]) {
  return notice.expiresOn >= getCurrentDateKey();
}

function isSchoolClass(value: unknown): value is SchoolClass {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as SchoolClass).id === "string" &&
    typeof (value as SchoolClass).name === "string" &&
    Array.isArray((value as SchoolClass).notices) &&
    (value as SchoolClass).notices.every(isClassNotice) &&
    Array.isArray((value as SchoolClass).tasks) &&
    (value as SchoolClass).tasks.every(isTask)
  );
}

function cloneAndPruneClasses(classes: SchoolClass[]) {
  return classes.map((schoolClass) => ({
    ...schoolClass,
    notices: schoolClass.notices.filter(isNoticeActive).map((notice) => ({ ...notice })),
    tasks: schoolClass.tasks.map((task) => ({ ...task })),
  }));
}

function readStore(): SchoolClass[] {
  ensureStoreFile();

  try {
    const content = readFileSync(CLASSES_FILE, "utf8");
    const parsed = JSON.parse(content) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const classes = parsed.filter(isSchoolClass).map((schoolClass) => ({
      ...schoolClass,
      notices: schoolClass.notices.map((notice) => ({ ...notice })),
      tasks: schoolClass.tasks.map((task) => ({ ...task })),
    }));
    const cleaned = cloneAndPruneClasses(classes);

    if (JSON.stringify(cleaned) !== JSON.stringify(classes)) {
      writeStore(cleaned);
    }

    return cleaned;
  } catch {
    const empty: SchoolClass[] = [];
    writeStore(empty);
    return empty;
  }
}

function writeStore(classes: SchoolClass[]) {
  ensureStoreFile();
  writeFileSync(CLASSES_FILE, JSON.stringify(classes, null, 2), "utf8");
}

function cloneTask(task: Task) {
  return { ...task };
}

function cloneClass(schoolClass: SchoolClass) {
  return {
    ...schoolClass,
    notices: schoolClass.notices.map((notice) => ({ ...notice })),
    tasks: schoolClass.tasks.map(cloneTask),
  };
}

function normalizeDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}

export function listClasses() {
  return readStore()
    .map(cloneClass)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getClassById(id: string) {
  return readStore().find((schoolClass) => schoolClass.id === id) ?? null;
}

export function listTasksByClassId(classId: string) {
  const schoolClass = getClassById(classId);
  if (!schoolClass) {
    return [];
  }

  return schoolClass.tasks
    .map(cloneTask)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export function addClassNotice(classId: string, message: string, expiresOn: string) {
  const classes = readStore();
  const index = classes.findIndex((schoolClass) => schoolClass.id === classId);
  if (index === -1) {
    throw new Error("Turma nao encontrada.");
  }

  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    throw new Error("Mensagem invalida.");
  }

  const validExpiresOn = expiresOn.trim();
  if (!validExpiresOn) {
    throw new Error("Escolha uma data para o aviso desaparecer.");
  }

  if (validExpiresOn < getCurrentDateKey()) {
    throw new Error("A data de expiração precisa ser hoje ou no futuro.");
  }

  classes[index].notices.unshift({
    id: randomUUID(),
    message: trimmedMessage,
    createdAt: new Date().toISOString(),
    expiresOn: validExpiresOn,
  });

  writeStore(classes);
  return classes[index].notices[0];
}

export function deleteClassNotice(classId: string, noticeId: string) {
  const classes = readStore();
  const index = classes.findIndex((schoolClass) => schoolClass.id === classId);
  if (index === -1) {
    return false;
  }

  const noticeIndex = classes[index].notices.findIndex(
    (notice) => notice.id === noticeId,
  );
  if (noticeIndex === -1) {
    return false;
  }

  classes[index].notices.splice(noticeIndex, 1);
  writeStore(classes);
  return true;
}

export function createTask(classId: string, input: TaskFormInput) {
  const dueDate = normalizeDate(input.dueDate);
  if (!dueDate) {
    throw new Error("Data de entrega invalida.");
  }

  const classes = readStore();
  const index = classes.findIndex((schoolClass) => schoolClass.id === classId);
  if (index === -1) {
    throw new Error("Turma nao encontrada.");
  }

  const task: Task = {
    id: randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    dueDate,
    createdAt: new Date().toISOString(),
  };

  classes[index].tasks.unshift(task);
  writeStore(classes);
  return cloneTask(task);
}

export function updateTask(classId: string, id: string, input: TaskFormInput) {
  const classes = readStore();
  const classIndex = classes.findIndex((schoolClass) => schoolClass.id === classId);
  if (classIndex === -1) {
    throw new Error("Turma nao encontrada.");
  }

  const tasks = classes[classIndex].tasks;
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

  writeStore(classes);
  return cloneTask(tasks[index]);
}

export function deleteTask(classId: string, id: string) {
  const classes = readStore();
  const classIndex = classes.findIndex((schoolClass) => schoolClass.id === classId);
  if (classIndex === -1) {
    return false;
  }

  const tasks = classes[classIndex].tasks;
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  writeStore(classes);
  return true;
}
