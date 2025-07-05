"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  User,
  Calendar,
  Phone,
  Settings,
  Home,
  Heart,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

/**
 * Composant Sidebar - Navigation latérale de l'application
 * Fonctionnalités :
 * - Navigation rapide vers toutes les sections
 * - Indicateurs visuels pour les pages actives
 * - Statistiques rapides
 * - Mode réduit/étendu
 * - Design épuré avec couleurs 2iE
 */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // Liens de navigation principaux
  const mainNavigation = [
    { href: "/", label: "Accueil", icon: Home, badge: null },
    { href: "/catalogue", label: "Catalogue", icon: BookOpen, badge: "15k+" },
    { href: "/mon-compte", label: "Mon Compte", icon: User, badge: null },
    { href: "/reservations", label: "Réservations", icon: Clock, badge: "3" },
    { href: "/evenements", label: "Événements", icon: Calendar, badge: "5" },
  ]

  // Liens secondaires
  const secondaryNavigation = [
    { href: "/contact", label: "Contact", icon: Phone, badge: null },
    { href: "/admin", label: "Administration", icon: Settings, badge: null },
  ]

  // Raccourcis rapides
  const quickActions = [
    { href: "/catalogue?filter=favorites", label: "Mes Favoris", icon: Heart, count: 12 },
    { href: "/catalogue?filter=trending", label: "Tendances", icon: TrendingUp, count: 8 },
    { href: "/catalogue?filter=recent", label: "Récents", icon: Clock, count: 24 },
  ]

  // Fonction pour vérifier si un lien est actif
  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href) ?? false
  }

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-nude-50 dark:bg-gray-900 border-r border-nude-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Bouton de réduction/expansion */}
      <div className="absolute -right-3 top-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-white dark:bg-gray-800 border-nude-200 dark:border-gray-600 shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Logo 2iE dans la sidebar */}
          {!isCollapsed && (
            <div className="flex items-center space-x-3 px-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-2ie-red via-2ie-green to-2ie-blue flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">2iE Library</h3>
                {/* <p className="text-xs text-muted-foreground">Bibliothèque</p> */}
              </div>
            </div>
          )}

          {/* Navigation principale */}
          <div className="space-y-2">
            {!isCollapsed && (
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">Navigation</h4>
            )}
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start space-x-3 h-10 ${
                      isActive
                        ? "bg-gradient-to-r from-2ie-blue/10 to-2ie-green/10 text-2ie-blue border-l-2 border-2ie-blue"
                        : "hover:bg-nude-100 dark:hover:bg-gray-800"
                    } ${isCollapsed ? "px-2" : "px-3"}`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-2ie-blue" : "text-muted-foreground"}`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>

          <Separator className="bg-nude-200 dark:bg-gray-700" />

          {/* Actions rapides */}
          {!isCollapsed && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">Raccourcis</h4>
              {quickActions.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start space-x-3 h-9 px-3 hover:bg-nude-100 dark:hover:bg-gray-800"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.count}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}

          <Separator className="bg-nude-200 dark:bg-gray-700" />

          {/* Navigation secondaire */}
          <div className="space-y-2">
            {!isCollapsed && (
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">Autres</h4>
            )}
            {secondaryNavigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start space-x-3 h-10 ${
                      isActive
                        ? "bg-gradient-to-r from-2ie-red/10 to-2ie-yellow/10 text-2ie-red border-l-2 border-2ie-red"
                        : "hover:bg-nude-100 dark:hover:bg-gray-800"
                    } ${isCollapsed ? "px-2" : "px-3"}`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-2ie-red" : "text-muted-foreground"}`} />
                    {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Statistiques rapides */}
          {!isCollapsed && (
            <div className="bg-gradient-to-br from-nude-100 to-nude-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Statistiques</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Livres empruntés</span>
                  <span className="text-sm font-medium text-2ie-blue">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Réservations</span>
                  <span className="text-sm font-medium text-2ie-green">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Favoris</span>
                  <span className="text-sm font-medium text-2ie-yellow">12</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
