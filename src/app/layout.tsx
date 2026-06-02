import type { Metadata, Viewport } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { PwaRegister } from "@/components/pwa/PwaRegister";

import "./globals.css";

export const metadata: Metadata = {
  title: "Propósito em Ação",
  description: "Design system inicial em preparação para o SaaS Propósito em Ação.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Propósito"
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#17633f"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <PwaRegister />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
