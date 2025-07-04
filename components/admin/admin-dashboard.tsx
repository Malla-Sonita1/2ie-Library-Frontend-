"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  BookOpen,
  Users,
  TrendingUp,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react"
import { AdminStats } from "@/components/admin/AdminStats"
import { getStats } from "@/lib/api"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalBooks: number
  availableBooks: number
  borrowedBooks: number
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  totalBorrows: number
  borrowsThisMonth: number
  overdueBooks: number
  popularCategories: Array<{
    name: string
    count: number
    color: string
  }>
  monthlyBorrows: Array<{
    month: string
    borrows: number
  }>
  recentActivity: Array<{
    type: string
    user: string
    book?: string
    time: string
  }>
}

type AdminDashboardProps = {
  stats: object;
  books: any[];
  reservations: any[];
};

export function AdminDashboard({ stats, books, reservations }: AdminDashboardProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [dashboardStats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const dashboardData = await getStats();
        setStats(dashboardData)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [toast])

  if (loading) {
    return (
      <div className="container-2ie py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-2ie-blue mx-auto"></div>
            <p className="text-muted-foreground">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardStats) {
    return (
      <div className="container-2ie py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-2ie-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground">Impossible de charger les données du tableau de bord.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sécurité : stats ne peut plus être null ici
  const safeStats = dashboardStats!;

  return (
    <div className="container-2ie py-8 space-y-8">
      {/* En-tête Admin */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Badge className="bg-2ie-red text-white">
              <BarChart3 className="h-3 w-3 mr-1" />
              ADMINISTRATEUR
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Tableau de bord Admin</h1>
          <p className="text-lg text-muted-foreground">Gestion de la bibliothèque 2iE</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Exporter and Importer buttons removed */}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-2ie-blue/10 to-2ie-blue/5 border-l-4 border-2ie-blue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Livres</p>
                <p className="text-2xl font-bold text-2ie-blue">{safeStats.totalBooks?.toLocaleString?.() ?? 0}</p>
                <p className="text-xs text-muted-foreground">{safeStats.availableBooks?.toLocaleString?.() ?? 0} disponibles</p>
              </div>
              <BookOpen className="h-8 w-8 text-2ie-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-green/10 to-2ie-green/5 border-l-4 border-2ie-green">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                <p className="text-2xl font-bold text-2ie-green">{safeStats.totalUsers?.toLocaleString?.() ?? 0}</p>
                <p className="text-xs text-muted-foreground">+{safeStats.newUsersThisMonth} ce mois</p>
              </div>
              <Users className="h-8 w-8 text-2ie-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-yellow/10 to-2ie-yellow/5 border-l-4 border-2ie-yellow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emprunts</p>
                <p className="text-2xl font-bold text-2ie-yellow">{safeStats.totalBorrows?.toLocaleString?.() ?? 0}</p>
                <p className="text-xs text-muted-foreground">{safeStats.borrowsThisMonth} ce mois</p>
              </div>
              <TrendingUp className="h-8 w-8 text-2ie-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-red/10 to-2ie-red/5 border-l-4 border-2ie-red">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold text-2ie-red">{safeStats.overdueBooks}</p>
                <p className="text-xs text-muted-foreground">Livres en retard</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-2ie-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminStats />

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="books">Gestion Livres</TabsTrigger>
          <TabsTrigger value="users">Gestion Utilisateurs</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Catégories populaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-2ie-blue" />
                  <span>Catégories populaires</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(safeStats.popularCategories ?? []).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{category.count}</div>
                        <div className="text-xs text-muted-foreground">livres</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Gestion des Livres */}
        <TabsContent value="books" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Livres</CardTitle>
              <CardDescription>
                Interface complète de gestion des livres - Ajout, modification, suppression
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Actions rapides</h3>
                  <p className="text-sm text-muted-foreground">Gérez votre catalogue de livres efficacement</p>
                </div>
                <Button className="bg-2ie-green hover:bg-2ie-green/90 text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ajouter un livre
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-2ie-green" />
                    <div>
                      <p className="font-medium">Livres disponibles</p>
                      <p className="text-2xl font-bold text-2ie-green">{safeStats.availableBooks?.toLocaleString?.() ?? 0}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8 text-2ie-yellow" />
                    <div>
                      <p className="font-medium">Livres empruntés</p>
                      <p className="text-2xl font-bold text-2ie-yellow">{safeStats.borrowedBooks?.toLocaleString?.() ?? 0}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-8 w-8 text-2ie-red" />
                    <div>
                      <p className="font-medium">En retard</p>
                      <p className="text-2xl font-bold text-2ie-red">{safeStats.overdueBooks}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/admin/books")}> {/* Redirige vers la gestion des livres */}
                  <Eye className="h-4 w-4 mr-2" />
                  Voir la gestion complète des livres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Gestion des Utilisateurs */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>
                Interface complète de gestion des utilisateurs - Activation, désactivation, statistiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Actions rapides</h3>
                  <p className="text-sm text-muted-foreground">Gérez les comptes utilisateurs et leurs permissions</p>
                </div>
                <Button className="bg-2ie-blue hover:bg-2ie-blue/90 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-2ie-blue" />
                    <div>
                      <p className="font-medium">Total utilisateurs</p>
                      <p className="text-2xl font-bold text-2ie-blue">{safeStats.totalUsers?.toLocaleString?.() ?? 0}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-2ie-green" />
                    <div>
                      <p className="font-medium">Utilisateurs actifs</p>
                      <p className="text-2xl font-bold text-2ie-green">{safeStats.activeUsers?.toLocaleString?.() ?? 0}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-2ie-yellow" />
                    <div>
                      <p className="font-medium">Nouveaux ce mois</p>
                      <p className="text-2xl font-bold text-2ie-yellow">{safeStats.newUsersThisMonth}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/admin/users")}> {/* Redirige vers la gestion des utilisateurs */}
                  <Eye className="h-4 w-4 mr-2" />
                  Voir la gestion complète des utilisateurs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {safeStats.popularCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span>{category.count} livres</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${(category.count / 3245) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Métriques avancées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-2ie-blue mb-1">
                {Math.round((safeStats.activeUsers / safeStats.totalUsers) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Taux d'activité</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-2ie-green mb-1">
                {Math.round((safeStats.borrowedBooks / safeStats.totalBooks) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Taux d'emprunt</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-2ie-yellow mb-1">
                {Math.round((safeStats.borrowsThisMonth / safeStats.totalBorrows) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Emprunts ce mois</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-2ie-red mb-1">
                {Math.round((safeStats.overdueBooks / safeStats.borrowedBooks) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Taux de retard</div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
