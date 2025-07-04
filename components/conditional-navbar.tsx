"use client"

import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"

export function ConditionalNavbar() {
  const { user } = useAuth()
  // Masquer la navbar sur les pages d'auth
  if (typeof window !== "undefined" && (
    window.location.pathname.startsWith("/auth/login") ||
    window.location.pathname.startsWith("/auth/register")
  )) {
    return null
  }
  if (!user) {
    return null
  }
  return (
    <div className="pt-16">
      <Navbar />
    </div>
  )
}
