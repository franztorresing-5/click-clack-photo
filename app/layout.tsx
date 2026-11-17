import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClickClack Photo | Fotografía de retrato, bodas y eventos",
  description: "Estudio fotográfico en Ciudad de México: retratos, sesiones conceptuales, bodas y eventos especiales.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
