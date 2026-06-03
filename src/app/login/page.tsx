import { AuthForm } from "@/components/auth-form";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "teacher" ? "/professor" : "/estudante");
  }

  return (
    <main>
      <h1>Entrar no sistema</h1>
      <p>
        Use seu e-mail e senha para acessar a turma ou o painel de edição.
      </p>

      <AuthForm />
    </main>
  );
}
