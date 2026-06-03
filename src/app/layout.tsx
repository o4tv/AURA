import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { auth } from "@/auth";
import { AppSessionProvider } from "@/components/session-provider";
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
  const session = await auth();

  return (
    <html lang="pt-BR">
      <body>
        <AppSessionProvider session={session}>
          <div className="shell">
            <Topbar />

            {children}
          </div>
        </AppSessionProvider>
      </body>
    </html>
  );
}
