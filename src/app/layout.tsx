import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samsung MENA | SwitchStorm Campaign Dashboard",
  description: "Executive Performance & Analytics Dashboard for #iSwitchedtoSamsung Campaign",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
