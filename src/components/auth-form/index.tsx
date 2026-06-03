"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function AuthForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    setLoading(false);

    if (!response || response.error) {
      setError("Credenciais inválidas.");
      return;
    }

    router.push(response.url ?? "/");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-form-fields">
        <span>E-mail</span>
        <input name="email" type="email" placeholder="seu e-mail" required />
      </label>

      <label className="auth-form-fields">
        <span>Senha</span>
        <input
          name="password"
          type="password"
          placeholder="sua senha"
          required
        />
      </label>

      {error ? <p className="auth-form-error">{error}</p> : null}

      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <Link className="ghost-button" href="/login">
        Limpar
      </Link>
    </form>
  );
}
