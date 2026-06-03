"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import {
  addClassNotice,
  createTask,
  deleteClassNotice,
  deleteTask,
  updateTask,
} from "@/lib/tasks";

async function requireTeacher() {
  const user = await getCurrentUser();
  if (!user || user.role !== "teacher") {
    redirect("/login");
  }
  return user;
}

function readTaskFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    dueDate: String(formData.get("dueDate") ?? "").trim(),
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Nao foi possivel concluir a operacao.";
}

export async function taskMutationAction(
  _previousState: { status: string; message: string },
  formData: FormData,
): Promise<{ status: string; message: string }> {
  await requireTeacher();

  const mode = String(formData.get("mode") ?? "save").trim();

  try {
    const classId = String(formData.get("classId") ?? "").trim();
    if (!classId) {
      return {
        status: "error",
        message: "Selecione uma turma valida.",
      };
    }

    if (mode === "notice-create") {
      const message = String(formData.get("message") ?? "").trim();
      const expiresOn = String(formData.get("expiresOn") ?? "").trim();
      if (!message) {
        return {
          status: "error",
          message: "Escreva um aviso antes de publicar.",
        };
      }

      if (!expiresOn) {
        return {
          status: "error",
          message: "Escolha uma data para o aviso desaparecer.",
        };
      }

      addClassNotice(classId, message, expiresOn);
      revalidatePath("/");
      revalidatePath("/estudante");
      revalidatePath("/professor");
      revalidatePath(`/professor/${classId}`);
      return { status: "success", message: "Aviso publicado." };
    }

    if (mode === "notice-delete") {
      const noticeId = String(formData.get("noticeId") ?? "").trim();
      if (!noticeId) {
        return {
          status: "error",
          message: "Selecione um aviso valido para remover.",
        };
      }

      deleteClassNotice(classId, noticeId);
      revalidatePath("/");
      revalidatePath("/estudante");
      revalidatePath("/professor");
      revalidatePath(`/professor/${classId}`);
      return { status: "success", message: "Aviso removido." };
    }

    if (mode === "delete") {
      const id = String(formData.get("id") ?? "").trim();
      if (!id) {
        return {
          status: "error",
          message: "Selecione uma tarefa valida para remover.",
        };
      }

      deleteTask(classId, id);
      revalidatePath("/");
      revalidatePath("/estudante");
      revalidatePath("/professor");
      revalidatePath(`/professor/${classId}`);
      return { status: "success", message: "Tarefa removida." };
    }

    const input = readTaskFormData(formData);
    if (!input.title || !input.description || !input.dueDate) {
      return {
        status: "error",
        message: "Preencha título, descrição e data de entrega.",
      };
    }

    const id = String(formData.get("id") ?? "").trim();
    if (id) {
      updateTask(classId, id, input);
      revalidatePath("/");
      revalidatePath("/estudante");
      revalidatePath("/professor");
      revalidatePath(`/professor/${classId}`);
      return { status: "success", message: "Tarefa atualizada." };
    }

    createTask(classId, input);
    revalidatePath("/");
    revalidatePath("/estudante");
    revalidatePath("/professor");
    revalidatePath(`/professor/${classId}`);
    return { status: "success", message: "Tarefa criada." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
