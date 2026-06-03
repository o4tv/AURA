import { AuthForm } from "@/components/auth-form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Login() {
  const teacher = await auth();

  if (teacher) {
    redirect("/professor");
  }

  return (
    <main>
      <h1>Entrar como professor</h1>
      <p>
        Para acessar o painel de controle do professor, faça login com suas
        credenciais.
      </p>

      <AuthForm />
    </main>
  );
}
