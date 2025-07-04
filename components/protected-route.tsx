"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "student" | "admin"
  allowedRoles?: ("student" | "admin")[]
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  fallbackPath = "/auth/login",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Attendre la fin du chargement avant de rediriger
    if (!loading && !user) {
      router.push(fallbackPath)
    }
  }, [user, loading, router, fallbackPath])

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="container-2ie py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-2ie-blue mx-auto"></div>
            <p className="text-muted-foreground">Vérification des permissions...</p>
          </div>
        </div>
      </div>
    )
  }

  // Utilisateur non connecté
  if (!user) {
    return (
      <div className="container-2ie py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Shield className="h-16 w-16 text-2ie-blue mx-auto" />
            <h2 className="text-2xl font-bold">Connexion requise</h2>
            <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
            <div className="space-y-2">
              <Button asChild className="w-full bg-2ie-blue hover:bg-2ie-blue/90">
                <Link href="/auth/login">Se connecter</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/register">Créer un compte</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vérification du rôle requis (ancienne méthode)
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="container-2ie py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-2ie-red mx-auto" />
            <h2 className="text-2xl font-bold">Accès non autorisé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full bg-2ie-blue hover:bg-2ie-blue/90">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
              {user.role === "student" && (
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/catalogue">Voir le catalogue</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vérification des rôles autorisés (nouvelle méthode)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container-2ie py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-2ie-red mx-auto" />
            <h2 className="text-2xl font-bold">Accès non autorisé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full bg-2ie-blue hover:bg-2ie-blue/90">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
              {user.role === "student" && (
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/catalogue">Voir le catalogue</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
