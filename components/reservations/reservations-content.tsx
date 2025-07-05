"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Calendar, X, CheckCircle, AlertCircle, BookOpen, User, RefreshCw } from "lucide-react"
import { getReservations, reserveBook, cancelReservation, returnBook, fulfillReservation } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [reservations, setReservations] = useState<Reservation[]>(reservationsProp || [])
  const [loading, setLoading] = useState(true)

  // Chargement des réservations (seulement si aucune prop n'est fournie)
  useEffect(() => {
    if (!reservationsProp) {
      const loadReservations = async () => {
        setLoading(true)
        try {
          const data = await getReservations()
          // Pour chaque réservation, on vérifie la disponibilité du livre par son id
          const enriched = await Promise.all(
            data.map(async (r: any) => {
              const res = await fetch(`/api/books/search?id=${encodeURIComponent(r.book_id)}`)
              const books = await res.json()
              const found = books.find((b: any) => b.id === r.book_id)
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
      setReservations(reservationsProp)
      setLoading(false)
    }
  }, [reservationsProp])

  // Filtrage des réservations (on ne filtre plus par statut)
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
            {/* Suppression du filtre de statut */}
          </div>
        </CardContent>
      </Card>

      {/* Liste simple de toutes les réservations */}
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
                        Réservé le {reservation.reservationDate ? new Date(reservation.reservationDate).toLocaleDateString("fr-FR") : "-"}
                      </div>
                    </div>
                  </div>
                  {/* Actions éventuelles (emprunter, annuler, etc.) */}
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filteredReservations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">Aucune réservation trouvée.</div>
        )}
      </div>
    </div>
  )
}
