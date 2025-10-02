import type { Metadata } from "next";
import "./globals.css"; // si usas Tailwind

export const metadata: Metadata = {
  title: "MyApp",
  description: "Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-neutral-950">{children}</body>
    </html>
  );
}
