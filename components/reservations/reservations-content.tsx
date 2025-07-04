"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Search, Clock, Calendar, X, CheckCircle, AlertCircle, BookOpen, User, RefreshCw } from "lucide-react"
import { getReservations, reserveBook, cancelReservation, returnBook, fulfillReservation } from "@/lib/api"

// Définition du type Reservation
interface Reservation {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  reservationDate: string
  status: string
  pickupDeadline?: string | null
  position?: number | null
  estimatedAvailability?: string | null
  borrowDate?: string
  dueDate?: string
  bookAvailable?: boolean // Ajouté pour l'affichage du bouton Emprunter
}

interface ReservationsContentProps {
  reservations?: Reservation[];
}

export function ReservationsContent({ reservations: reservationsProp }: ReservationsContentProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reservations, setReservations] = useState<Reservation[]>(reservationsProp || [])
  const [loading, setLoading] = useState(true)

  // Chargement des réservations (seulement si aucune prop n'est fournie)
  useEffect(() => {
    if (!reservationsProp) {
      const loadReservations = async () => {
        setLoading(true)
        try {
          const data = await getReservations()
          // Pour chaque réservation, on vérifie la disponibilité du livre
          const enriched = await Promise.all(
            data.map(async (r: any) => {
              const res = await fetch(`/api/books/search?title=${encodeURIComponent(r.title)}`)
              const books = await res.json()
              const found = books.find((b: any) => b.title === r.title)
              return { ...r, bookAvailable: found ? found.available : false }
            }),
          )
          setReservations(enriched)
        } catch (e) {
          setReservations([])
          toast({
            title: "Erreur",
            description: "Impossible de charger les réservations.",
            variant: "destructive",
          })
        }
        setLoading(false)
      }

      loadReservations()
    } else {
      setLoading(false)
    }
  }, [reservationsProp])

  // Filtrage des réservations
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await cancelReservation(reservationId)
      setReservations((prev) => prev.filter((r) => r.id !== reservationId))
      toast({
        title: "Emprunt annulé",
        description: "L'emprunt a été annulé avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'emprunt.",
        variant: "destructive",
      })
    }
  }

  const handleRenewReservation = async (reservationId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId
            ? { ...r, status: "waiting", pickupDeadline: null, estimatedAvailability: "2024-04-25" }
            : r,
        ),
      )

      toast({
        title: "Emprunt renouvelé",
        description: "Votre emprunt a été renouvelé.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de renouveler l'emprunt.",
        variant: "destructive",
      })
    }
  }

  const handleReturn = async (reservationId: number) => {
    try {
      await returnBook(reservationId)
      setReservations((prev) => prev.filter((r) => r.id !== reservationId))
      toast({
        title: "Livre retourné",
        description: "Le livre a bien été rendu.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rendre le livre.",
        variant: "destructive",
      })
    }
  }

  // Nouvelle fonction pour honorer une réservation (emprunter après réservation)
  const handleFulfillReservation = async (reservationId: number) => {
    try {
      const res = await fulfillReservation(reservationId);
      if (res && res.success !== false) {
        toast({
          title: "Emprunt effectué",
          description: res.message || "Votre réservation a été transformée en emprunt.",
        });
        setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      } else {
        toast({
          title: "Erreur emprunt",
          description: res?.message || "Impossible d'emprunter ce livre.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible d'emprunter ce livre pour le moment.",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "ready":
        return {
          badge: <Badge className="bg-green-500">Prêt à récupérer</Badge>,
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          description: "Votre livre est disponible au comptoir",
        }
      case "waiting":
        return {
          badge: <Badge className="bg-yellow-500">En attente</Badge>,
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          description: "Votre réservation est en file d'attente",
        }
      case "expired":
        return {
          badge: <Badge className="bg-red-500">Expiré</Badge>,
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          description: "Délai de récupération dépassé",
        }
      case "borrowed":
        return {
          badge: <Badge className="bg-blue-500">Emprunté</Badge>,
          icon: <BookOpen className="h-4 w-4 text-blue-500" />,
          description: "Livre actuellement emprunté",
        }
      default:
        return {
          badge: <Badge variant="outline">{status}</Badge>,
          icon: <Clock className="h-4 w-4" />,
          description: "",
        }
    }
  }

  const getReservationsByStatus = (status: string) => {
    return filteredReservations.filter((r) => r.status === status)
  }

  if (loading) {
    return (
      <div className="container-2ie py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container-2ie py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mes Réservations</h1>
        <p className="text-muted-foreground">Gérez vos réservations de livres et suivez leur statut</p>
      </div>

      {/* Filtres */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre ou auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ready">Prêt à récupérer</SelectItem>
                <SelectItem value="waiting">En attente</SelectItem>
                <SelectItem value="borrowed">Emprunté</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onglets par statut */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Toutes ({filteredReservations.length})</TabsTrigger>
          <TabsTrigger value="ready">Prêtes ({getReservationsByStatus("ready").length})</TabsTrigger>
          <TabsTrigger value="waiting">En attente ({getReservationsByStatus("waiting").length})</TabsTrigger>
          <TabsTrigger value="borrowed">Empruntées ({getReservationsByStatus("borrowed").length})</TabsTrigger>
          <TabsTrigger value="expired">Expirées ({getReservationsByStatus("expired").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredReservations.map((reservation) => {
              const statusInfo = getStatusInfo(reservation.status)
              return (
                <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {statusInfo.icon}
                          <h3 className="text-xl font-semibold">{reservation.title}</h3>
                          {statusInfo.badge}
                        </div>
                        <p className="text-muted-foreground mb-2">par {reservation.author}</p>
                        <p className="text-sm text-muted-foreground mb-4">{statusInfo.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Réservé le {new Date(reservation.reservationDate).toLocaleDateString("fr-FR")}</span>
                          </div>

                          {reservation.pickupDeadline && (
                            <div className="flex items-center text-green-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>
                                À récupérer avant le {new Date(reservation.pickupDeadline).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          )}

                          {reservation.position && (
                            <div className="flex items-center text-yellow-600">
                              <User className="h-4 w-4 mr-2" />
                              <span>Position {reservation.position} dans la file</span>
                            </div>
                          )}

                          {reservation.estimatedAvailability && (
                            <div className="flex items-center text-blue-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>
                                Disponible vers le{" "}
                                {new Date(reservation.estimatedAvailability).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          )}

                          {reservation.borrowDate && (
                            <div className="flex items-center text-blue-600">
                              <BookOpen className="h-4 w-4 mr-2" />
                              <span>Emprunté le {new Date(reservation.borrowDate).toLocaleDateString("fr-FR")}</span>
                            </div>
                          )}

                          {reservation.dueDate && (
                            <div className="flex items-center text-orange-600">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              <span>À rendre le {new Date(reservation.dueDate).toLocaleDateString("fr-FR")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {reservation.status === "expired" && (
                          <Button variant="outline" size="sm" onClick={() => handleRenewReservation(reservation.id)}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Renouveler
                          </Button>
                        )}
                        {(reservation.status === "ready" || reservation.status === "waiting") && (
                          <Button variant="outline" size="sm" onClick={() => handleCancelReservation(reservation.id)}>
                            <X className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        )}
                        {reservation.status === "borrowed" && (
                          <Button variant="outline" size="sm" onClick={() => handleReturn(reservation.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Retourner
                          </Button>
                        )}
                        {reservation.status === "en_attente" && reservation.bookAvailable && (
                          <Button variant="default" size="sm" onClick={() => handleFulfillReservation(reservation.id)}>
                            <BookOpen className="h-4 w-4 mr-1" />
                            Emprunter
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {["ready", "waiting", "borrowed", "expired"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="space-y-4">
              {getReservationsByStatus(status).map((reservation) => {
                const statusInfo = getStatusInfo(reservation.status)
                return (
                  <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {statusInfo.icon}
                            <h3 className="text-xl font-semibold">{reservation.title}</h3>
                            {statusInfo.badge}
                          </div>
                          <p className="text-muted-foreground mb-2">par {reservation.author}</p>
                          <p className="text-sm text-muted-foreground mb-4">{statusInfo.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                Réservé le {new Date(reservation.reservationDate).toLocaleDateString("fr-FR")}
                              </span>
                            </div>

                            {reservation.pickupDeadline && (
                              <div className="flex items-center text-green-600">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>
                                  À récupérer avant le{" "}
                                  {new Date(reservation.pickupDeadline).toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                            )}

                            {reservation.position && (
                              <div className="flex items-center text-yellow-600">
                                <User className="h-4 w-4 mr-2" />
                                <span>Position {reservation.position} dans la file</span>
                              </div>
                            )}

                            {reservation.estimatedAvailability && (
                              <div className="flex items-center text-blue-600">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>
                                  Disponible vers le{" "}
                                  {new Date(reservation.estimatedAvailability).toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                            )}

                            {reservation.borrowDate && (
                              <div className="flex items-center text-blue-600">
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span>Emprunté le {new Date(reservation.borrowDate).toLocaleDateString("fr-FR")}</span>
                              </div>
                            )}

                            {reservation.dueDate && (
                              <div className="flex items-center text-orange-600">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                <span>À rendre le {new Date(reservation.dueDate).toLocaleDateString("fr-FR")}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          {reservation.status === "expired" && (
                            <Button variant="outline" size="sm" onClick={() => handleRenewReservation(reservation.id)}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Renouveler
                            </Button>
                          )}
                          {(reservation.status === "ready" || reservation.status === "waiting") && (
                            <Button variant="outline" size="sm" onClick={() => handleCancelReservation(reservation.id)}>
                              <X className="h-4 w-4 mr-1" />
                              Annuler
                            </Button>
                          )}
                          {reservation.status === "borrowed" && (
                            <Button variant="outline" size="sm" onClick={() => handleReturn(reservation.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Retourner
                            </Button>
                          )}
                          {reservation.status === "en_attente" && reservation.bookAvailable && (
                            <Button variant="default" size="sm" onClick={() => handleFulfillReservation(reservation.id)}>
                              <BookOpen className="h-4 w-4 mr-1" />
                              Emprunter
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {getReservationsByStatus(status).length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                    <p className="text-muted-foreground">Vous n'avez aucune réservation avec ce statut.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredReservations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune réservation trouvée</h3>
            <p className="text-muted-foreground">
              Vous n'avez actuellement aucune réservation correspondant à vos critères.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
