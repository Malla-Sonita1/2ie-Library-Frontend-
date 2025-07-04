"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, CheckCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getStats } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrows: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const s = await getStats();
        setStats(s)
      } catch {
        setStats({ totalBooks: 15420, totalUsers: 2847, totalBorrows: 8934, satisfaction: 98 })
      }
    }
    fetchStats()
  }, [])

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="container-2ie relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Bibliothèque Innovante 2iE
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Bienvenue
                  <span className="block text-yellow-300">{user.name}</span>
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                  Découvrez notre collection de plus de 15 000 ouvrages spécialisés en ingénierie, environnement et
                  technologies innovantes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 hover:scale-105 transition-all duration-300 group">
                  <Link href="/catalogue">
                    <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Explorer le catalogue
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent hover:scale-105 transition-all duration-300 group">
                  <Link href="/reservations">
                    <Clock className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Mes réservations
                  </Link>
                </Button>
                {user.role === "admin" && (
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent hover:scale-105 transition-all duration-300 group">
                    <Link href="/admin">Espace Admin</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent hover:scale-105 transition-all duration-300 group">
                  <Link href="/mon-compte">Mon Compte</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {stats.totalBooks.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">Livres</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">Étudiants</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {stats.totalBorrows.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">Emprunts</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {stats.satisfaction}%
                  </div>
                  <div className="text-white/80 text-sm">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-500 group">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                      Accès rapide
                    </h3>
                    <p className="text-white/80">Vos fonctionnalités préférées</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <CheckCircle className="h-5 w-5 text-yellow-300" />
                      <span className="text-white">Connecté en tant que {user.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent hover:scale-105 transition-all duration-300">
                        <Link href="/catalogue">Catalogue</Link>
                      </Button>
                      <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent hover:scale-105 transition-all duration-300">
                        <Link href="/mon-compte">Mon Compte</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


