import type { Metadata } from "next";
import "./globals.css";
import SidebarShell from "@/components/SidebarShell";

export const metadata: Metadata = {
  title: "Samsung MENA | Marketing Intelligence Hub",
  description: "Enterprise Marketing AI Platform & Regional Analytics for Samsung MENA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 text-slate-900 selection:bg-blue-500 selection:text-white">
        <SidebarShell>{children}</SidebarShell>
      </body>
    </html>
  );
}
