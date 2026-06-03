import { NextResponse } from 'next/server';
import { createTask, listTasks } from '@/lib/tasks';
import { auth } from '@/auth';

export async function GET() {
  return NextResponse.json({ tasks: listTasks() });
}

export async function POST(request: Request) {
  const teacher = await auth();
  if (!teacher) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    dueDate?: string;
  } | null;

  if (!body || !body.title || !body.description || !body.dueDate) {
    return NextResponse.json({ error: 'Dados invalidos.' }, { status: 400 });
  }

  const task = createTask({
    title: body.title,
    description: body.description,
    dueDate: body.dueDate,
  });

  return NextResponse.json({ task }, { status: 201 });
}
