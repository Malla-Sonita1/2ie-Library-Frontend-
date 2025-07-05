"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getUserReservationsHistory } from "@/lib/api"
import {
  User,
  BookOpen,
  Clock,
  Star,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  TrendingUp,
  Heart,
} from "lucide-react"

export function MonCompteContent() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [stats, setStats] = useState({
    totalBorrows: 0,
    currentBorrows: 0,
    reservations: 0,
    favorites: 0,
  });
  type Borrow = {
    id: number;
    title: string;
    author: string;
    borrowDate: string;
    returnDate: string | null;
    status: string;
    rating?: number;
    dueDate?: string;
  };
  type Reservation = {
    id: number;
    title: string;
    author: string;
    reservationDate: string;
    status: string;
    pickupDeadline?: string;
    estimatedAvailability?: string;
    isFirstInQueue?: boolean;
    position?: number | null; // Ajout explicite pour la compatibilité
  };
  type FavoriteBook = {
    id: number;
    title: string;
    author: string;
    category: string;
    rating: number;
  };
  const [borrowHistory, setBorrowHistory] = useState<Borrow[]>([]);
  const [currentReservations, setCurrentReservations] = useState<Reservation[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<FavoriteBook[]>([])
  const [reservationHistory, setReservationHistory] = useState<Reservation[]>([]);
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);

  // Chargement des données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      // Simulation de chargement des statistiques
      const mockStats = {
        totalBorrows: 47,
        currentBorrows: 3,
        reservations: 2,
        favorites: 12,
      }

      // Simulation de l'historique des emprunts
      const mockHistory = [
        {
          id: 1,
          title: "Intelligence Artificielle Moderne",
          author: "Stuart Russell",
          borrowDate: "2024-03-15",
          returnDate: "2024-04-05",
          status: "returned",
          rating: 5,
        },
        {
          id: 2,
          title: "Développement Durable",
          author: "Marie Dubois",
          borrowDate: "2024-03-10",
          returnDate: "2024-03-31",
          status: "returned",
          rating: 4,
        },
        {
          id: 3,
          title: "Génie Civil Moderne",
          author: "Jean-Pierre Martin",
          borrowDate: "2024-04-01",
          returnDate: null,
          status: "borrowed",
          dueDate: "2024-04-22",
        },
      ]

      // Simulation des réservations actuelles
      const mockReservations = [
        {
          id: 1,
          title: "Systèmes d'Information",
          author: "Ahmed Ben Ali",
          reservationDate: "2024-04-10",
          status: "ready",
          pickupDeadline: "2024-04-15",
          isFirstInQueue: true,
        },
        {
          id: 2,
          title: "Énergies Renouvelables",
          author: "Fatima Ouedraogo",
          reservationDate: "2024-04-12",
          status: "waiting",
          estimatedAvailability: "2024-04-20",
          isFirstInQueue: false,
        },
      ]

      // Simulation des livres favoris
      const mockFavorites = [
        {
          id: 1,
          title: "Intelligence Artificielle Moderne",
          author: "Stuart Russell",
          category: "Informatique",
          rating: 4.8,
        },
        {
          id: 2,
          title: "Développement Durable",
          author: "Marie Dubois",
          category: "Environnement",
          rating: 4.6,
        },
      ]

      // Ajout de l'historique des réservations (à remplacer par appel API réel)
      const mockReservationHistory = [
        ...mockReservations,
        { id: 3, title: "Livre annulé", author: "Auteur X", reservationDate: "2024-04-01", status: "annulé" }
      ];

      setStats(mockStats)
      setBorrowHistory(mockHistory)
      setCurrentReservations(mockReservations)
      setFavoriteBooks(mockFavorites)
      setReservationHistory(mockReservationHistory);

      // Chargement de l'historique réel des réservations
      try {
        const history = await getUserReservationsHistory();
        // Mapping explicite : queue_position -> position
        const mappedHistory = history.map((r: any) => ({
          ...r,
          position: r.queue_position ?? r.position ?? null,
        }));
        setReservationHistory(mappedHistory);
      } catch (e) {
        setReservationHistory([]);
      }
    };
    loadUserData();
  }, [])

  const handleSaveProfile = async () => {
    try {
      // Simulation de la mise à jour du profil
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (user) {
        updateUser({ ...user, ...formData });
      }
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    }
  }

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCurrentReservations((prev) => prev.filter((r) => r.id !== reservationId))
      setStats((prev) => ({ ...prev, reservations: prev.reservations - 1 }))
      setReservationMessage("Réservation annulée avec succès.");
      // Rafraîchir l'historique réel après annulation
      try {
        const history = await getUserReservationsHistory();
        setReservationHistory(history);
      } catch (e) {}
      setTimeout(() => setReservationMessage(null), 3000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation.",
        variant: "destructive",
      })
    }
  }

  const handleBorrowReservation = async (reservationId: number) => {
    try {
      // Appel API pour transformer la réservation en emprunt (à adapter avec l'API réelle)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCurrentReservations((prev) => prev.filter((r) => r.id !== reservationId))
      setStats((prev) => ({ ...prev, reservations: prev.reservations - 1 }))
      setReservationMessage("Livre emprunté avec succès.");
      setTimeout(() => setReservationMessage(null), 3000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'emprunter le livre.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "returned":
        return <Badge className="bg-green-500">Rendu</Badge>
      case "borrowed":
        return <Badge className="bg-blue-500">En cours</Badge>
      case "overdue":
        return <Badge className="bg-red-500">En retard</Badge>
      case "ready":
        return <Badge className="bg-green-500">Prêt</Badge>
      case "waiting":
        return <Badge className="bg-yellow-500">En attente</Badge>
      case "annulé":
        return <Badge className="bg-red-500">Annulé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container-2ie py-8">
      {/* En-tête du profil */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">Mon Compte</h1>
                <p className="text-muted-foreground mb-4">Bienvenue, {user?.name} • Étudiant 2iE</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalBorrows}</div>
                    <div className="text-sm text-muted-foreground">Emprunts totaux</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.currentBorrows}</div>
                    <div className="text-sm text-muted-foreground">En cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.reservations}</div>
                    <div className="text-sm text-muted-foreground">Réservations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.favorites}</div>
                    <div className="text-sm text-muted-foreground">Favoris</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations Personnelles
                  </CardTitle>
                  <CardDescription>Gérez vos informations de profil et vos préférences</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          address: user?.address || "",
                        })
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{user?.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user?.email}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user?.phone || "Non renseigné"}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user?.address || "Non renseigné"}
                    </div>
                  )}
                </div>
              </div>

              {/* Statistiques détaillées */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Statistiques d'utilisation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Emprunts ce mois</span>
                        <Badge variant="outline">8/10</Badge>
                      </div>
                      <Progress value={80} className="mb-2" />
                      <p className="text-xs text-muted-foreground">Vous avez emprunté 8 livres ce mois (limite: 10)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Taux de retour à temps</span>
                        <Badge className="bg-green-500">95%</Badge>
                      </div>
                      <Progress value={95} className="mb-2" />
                      <p className="text-xs text-muted-foreground">Excellent! Vous rendez vos livres à temps</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Historique des Emprunts
              </CardTitle>
              <CardDescription>Consultez l'historique de tous vos emprunts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {borrowHistory.map((borrow: Borrow) => (
                  <Card key={borrow.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{borrow.title}</h4>
                          <p className="text-muted-foreground mb-2">par {borrow.author}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Emprunté le {new Date(borrow.borrowDate).toLocaleDateString("fr-FR")}
                            </div>
                            {borrow.returnDate && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Rendu le {new Date(borrow.returnDate).toLocaleDateString("fr-FR")}
                              </div>
                            )}
                            {borrow.dueDate && !borrow.returnDate && (
                              <div className="flex items-center text-orange-600">
                                <Clock className="h-4 w-4 mr-1" />À rendre le {new Date(borrow.dueDate).toLocaleDateString("fr-FR")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(borrow.status)}
                          {borrow.rating && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm">{borrow.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Historique des réservations annulées ou passées */}
                {reservationHistory.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-lg mb-2">Historique des Réservations</h4>
                    {reservationHistory
                      // Affiche toutes les réservations qui ne sont PAS actives (ni en attente, ni prêtes)
                      .filter((reservation: Reservation) =>
                        reservation.status !== "waiting" &&
                        reservation.status !== "en_attente" &&
                        reservation.status !== "ready" &&
                        reservation.status !== "prêt" &&
                        reservation.status !== "disponible"
                      )
                      .map((reservation: Reservation) => (
                        <Card key={reservation.id} className="border-l-4 border-l-yellow-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{reservation.title}</h4>
                                <p className="text-muted-foreground mb-2">par {reservation.author}</p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Réservé le {new Date(reservation.reservationDate).toLocaleDateString("fr-FR")}
                                  </div>
                                  {/* Affichage debug du statut */}
                                  <div className="ml-2 text-xs text-gray-400">Statut: {reservation.status}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                {getStatusBadge(reservation.status)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Réservations */}
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Réservations Actuelles
              </CardTitle>
              <CardDescription>Gérez vos réservations en cours</CardDescription>
            </CardHeader>
            <CardContent>
              {reservationMessage && (
                <div className="mb-4 text-green-600 font-semibold text-center">{reservationMessage}</div>
              )}
              <div className="space-y-4">
                {currentReservations.map((reservation: Reservation) => (
                  <Card key={reservation.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{reservation.title}</h4>
                          <p className="text-muted-foreground mb-2">par {reservation.author}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Réservé le {new Date(reservation.reservationDate).toLocaleDateString("fr-FR")}
                            </div>
                            {reservation.pickupDeadline && (
                              <div className="flex items-center text-green-600">
                                <Clock className="h-4 w-4 mr-1" />À récupérer avant le {new Date(reservation.pickupDeadline).toLocaleDateString("fr-FR")}
                              </div>
                            )}
                            {reservation.estimatedAvailability && (
                              <div className="flex items-center text-orange-600">
                                <Clock className="h-4 w-4 mr-1" />
                                Disponible vers le {new Date(reservation.estimatedAvailability).toLocaleDateString("fr-FR")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(reservation.status)}
                          <div className="flex flex-row gap-2">
                            {/* Bouton Emprunter si le livre est prêt ou si l'utilisateur est en tête de file et le livre est dispo */}
                            {(
                              reservation.status === "ready" ||
                              reservation.status === "prêt" ||
                              reservation.status === "disponible" ||
                              ((reservation.status === "waiting" || reservation.status === "en_attente") &&
                                (reservation.position === 1 || reservation.isFirstInQueue))
                            ) && (
                              <Button variant="default" size="sm" onClick={() => handleBorrowReservation(reservation.id)}>
                                <BookOpen className="h-4 w-4 mr-1" />
                                Emprunter
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleCancelReservation(reservation.id)}>
                              <X className="h-4 w-4 mr-1" />
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {currentReservations.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                    <p className="text-muted-foreground">Vous n'avez actuellement aucune réservation en cours.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Favoris */}
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Livres Favoris
              </CardTitle>
              <CardDescription>Vos livres préférés et votre liste de souhaits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteBooks.map((book: FavoriteBook) => (
                  <Card key={book.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">par {book.author}</p>
                          <Badge variant="outline" className="mt-1">
                            {book.category}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{book.rating}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="flex-1">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Réserver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {favoriteBooks.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
                    <p className="text-muted-foreground">
                      Ajoutez des livres à vos favoris pour les retrouver facilement.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
