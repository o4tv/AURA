import { NextResponse } from 'next/server';
import { deleteTask, updateTask } from '@/lib/tasks';
import { auth } from '@/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const teacher = await auth();
  if (!teacher) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    dueDate?: string;
  } | null;

  if (!body || !body.title || !body.description || !body.dueDate) {
    return NextResponse.json({ error: 'Dados invalidos.' }, { status: 400 });
  }

  const task = updateTask(id, {
    title: body.title,
    description: body.description,
    dueDate: body.dueDate,
  });
  return NextResponse.json({ task });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const teacher = await auth();
  if (!teacher) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteTask(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Tarefa nao encontrada.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
