"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type TopbarProps = {
  isLogged?: boolean;
};

export function Topbar({ isLogged }: TopbarProps) {
  const pathname = usePathname();
  const onProfessorPanel = pathname.startsWith("/professor");
  const href = onProfessorPanel ? "/" : isLogged ? "/professor" : "/login";
  const label = onProfessorPanel
    ? "Painel do aluno"
    : isLogged
      ? "Painel do professor"
      : "Entrar como professor";

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
        {isLogged ? (
          <button className="ghost-button" type="button" onClick={handleLogout}>
            Sair
          </button>
        ) : null}
      </div>
    </header>
  );
}
