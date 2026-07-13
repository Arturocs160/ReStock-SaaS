import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "./components/authInitializer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReStock - Inventario Inteligente para tu Negocio",
  description:
    "ReStock predice cuánto comprar, te avisa antes de que algo caduque y mantiene tu tienda siempre abastecida — sin hojas de cálculo, sin adivinar.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthInitializer>{children}</AuthInitializer>
      </body>
    </html>
  );
}
