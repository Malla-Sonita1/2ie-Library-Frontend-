"use client"

import type React from "react"

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  User,
  LogOut,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  Calendar,
  Phone,
  Clock,
  Shield,
  Users,
  BarChart3,
  LogIn,
  UserPlus,
} from "lucide-react"
import { getNotifications } from "@/lib/api";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Notifications dynamiques
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      getNotifications().then((notifs) => {
        setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
      });
    }
  }, [user])

  // Navigation pour utilisateurs non connectés
  const publicNavigation = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/auth/login", label: "Connexion", icon: LogIn },
    { href: "/auth/register", label: "Inscription", icon: UserPlus },
  ]

  // Navigation pour étudiants
  const studentNavigation = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/catalogue", label: "Catalogue", icon: BookOpen },
    { href: "/mon-compte", label: "Mon Compte", icon: User },
    { href: "/reservations", label: "Réservations", icon: Clock },
    { href: "/emprunts", label: "Mes Emprunts", icon: BookOpen },
    { href: "/contact", label: "Contact", icon: Phone },
  ]

  // Navigation pour administrateurs
  const adminNavigation = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/admin", label: "Dashboard Admin", icon: BarChart3 },
    { href: "/admin/books", label: "Gestion Livres", icon: BookOpen },
    { href: "/admin/users", label: "Gestion Utilisateurs", icon: Users },
    { href: "/catalogue", label: "Catalogue", icon: BookOpen },
  ]

  // Choisir la navigation selon l'état de connexion et le rôle
  const navigation = !user ? publicNavigation : user.role === "admin" ? adminNavigation : studentNavigation

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMenuOpen(false)
  }

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname ? pathname.startsWith(href) : false
  }

  // Masquer la navbar sur les pages de connexion et d'inscription
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-nude-200 dark:border-gray-700">
      <div className="container-2ie">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-2ie-red via-2ie-green to-2ie-blue flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground group-hover:text-2ie-blue transition-colors">
                2iE Library
              </h1>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "bg-gradient-to-r from-2ie-blue/10 to-2ie-green/10 text-2ie-blue"
                        : "hover:bg-2ie-blue/90 hover:text-white"
                    } ${
                      item.href === "/auth/login"
                        ? "text-2ie-blue hover:bg-2ie-blue/10 hover:text-white"
                        : item.href === "/auth/register"
                          ? "bg-2ie-blue text-white hover:bg-2ie-blue/90 hover:text-white"
                          : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-2">
            {/* Notifications - seulement pour les utilisateurs connectés */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push("/notifications")}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-2ie-red text-white text-xs animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Toggle mode sombre */}
            <ModeToggle />

            {/* Menu utilisateur ou boutons connexion/inscription */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback className="bg-2ie-blue text-white">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === "admin" ? "Administrateur" : "Étudiant"}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {user.role === "admin" && (
                        <Badge className="w-fit bg-2ie-red text-white">
                          <Shield className="h-3 w-3 mr-1" />
                          Administrateur
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {user.role === "student" ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/mon-compte" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          Mon Profil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/reservations" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Mes Réservations
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/emprunts" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Mes Emprunts
                        </Link>
                      </DropdownMenuItem>
                      {/* SUPPRESSION de la section Paramètres pour les étudiants */}
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Dashboard Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users" className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Gestion Utilisateurs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/books" className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Gestion Livres
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem onClick={handleLogout} className="text-2ie-red">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Boutons pour utilisateurs non connectés - version desktop uniquement
              <div className="hidden lg:flex items-center space-x-2">
                <Button variant="ghost" asChild className="text-2ie-blue hover:bg-2ie-blue/10">
                  <Link href="/auth/login" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Connexion</span>
                  </Link>
                </Button>
                <Button asChild className="bg-2ie-blue hover:bg-2ie-blue/90 text-white">
                  <Link href="/auth/register" className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Inscription</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Menu mobile */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-nude-200 dark:border-gray-700 py-4">
            {/* Navigation mobile */}
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = isActiveLink(item.href)
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive
                          ? "bg-gradient-to-r from-2ie-blue/10 to-2ie-green/10 text-2ie-blue"
                          : "hover:bg-2ie-blue/90 hover:text-white"
                      } ${
                        item.href === "/auth/login"
                          ? "text-2ie-blue hover:bg-2ie-blue/10 hover:text-white"
                          : item.href === "/auth/register"
                            ? "bg-2ie-blue text-white hover:bg-2ie-blue/90 hover:text-white"
                            : ""
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
