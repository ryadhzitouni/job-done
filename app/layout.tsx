import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Done",
  description: "L'assistant IA pour les artisans",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
