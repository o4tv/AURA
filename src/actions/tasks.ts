"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTask, deleteTask, updateTask } from "@/lib/tasks";
import { auth } from "@/auth";

async function requireTeacher() {
  const teacher = await auth();
  if (!teacher) {
    redirect("/login");
  }
  return teacher;
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
    if (mode === "delete") {
      const id = String(formData.get("id") ?? "").trim();
      if (!id) {
        return {
          status: "error",
          message: "Selecione uma tarefa valida para remover.",
        };
      }

      deleteTask(id);
      revalidatePath("/");
      revalidatePath("/professor");
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
      updateTask(id, input);
      revalidatePath("/");
      revalidatePath("/professor");
      return { status: "success", message: "Tarefa atualizada." };
    }

    createTask(input);
    revalidatePath("/");
    revalidatePath("/professor");
    return { status: "success", message: "Tarefa criada." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
