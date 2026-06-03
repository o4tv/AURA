"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function Topbar() {
  const { data: session } = useSession();
  const isTeacher = session?.user?.role === "teacher";
  const isStudent = session?.user?.role === "student";
  const isAuthenticated = Boolean(session?.user?.email);
  const href = isTeacher ? "/professor" : isStudent ? "/estudante" : "/login";
  const label = isTeacher ? "Turmas" : isStudent ? "Minha turma" : "Entrar";

  async function handleLogout() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="topbar">
      <Link href="/">
        <h1>AURA</h1>
      </Link>

      <div className="header-actions">
        <Link className="ghost-button" href={href}>
          {label}
        </Link>
        {isAuthenticated ? (
          <button className="ghost-button" type="button" onClick={handleLogout}>
            Sair
          </button>
        ) : null}
      </div>
    </header>
  );
}
