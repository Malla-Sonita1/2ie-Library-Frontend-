// Ce fichier est le layout principal à conserver. Supprimez client-layout.tsx si doublon.

"use client"

import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { useAuth } from "@/contexts/auth-context"

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;
  // Détecter si on est sur une page d'auth (login/register) ou une page publique
  const isAuthPage = typeof window !== "undefined" && (
    window.location.pathname.startsWith("/auth/login") ||
    window.location.pathname.startsWith("/auth/register")
  );
  // Liste des pages publiques (ajoutez ici d'autres routes publiques si besoin)
  const isPublicPage = typeof window !== "undefined" && (
    window.location.pathname === "/" ||
    window.location.pathname === "/contact"
  );
  if (isAuthPage || isPublicPage) {
    return <main>{children}</main>;
  }
  // Pages privées : navigation, footer, chatbot
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
