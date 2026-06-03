import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { auth } from "@/auth";
import { Topbar } from "@/components/top-bar";

export const metadata: Metadata = {
  title: "AURA",
  description: "Assistente Unificado de Rotina Acadêmica",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const teacher = await auth();

  return (
    <html lang="pt-BR">
      <body>
        <div className="shell">
          <Topbar isLogged={!!teacher} />

          {children}
        </div>
      </body>
    </html>
  );
}
