import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bibliothèque 2iE - Système de Gestion Moderne",
  description:
    "Système de gestion de bibliothèque moderne pour l'Institut International d'Ingénierie de l'Eau et de l'Environnement (2iE)",
  keywords: "bibliothèque, 2iE, gestion, livres, étudiants, recherche, ingénierie, environnement",
  authors: [{ name: "2iE Library Team" }],
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'