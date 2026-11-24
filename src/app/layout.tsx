import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Casa na Gringa — Seu Imóvel no Exterior com Segurança do Início ao Fim",
  description:
    "Plataforma de confiança trilíngue (PT/EN/ES) para compra, due diligence, financiamento, cofre documental e gestão de imóveis em Portugal e Espanha.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
