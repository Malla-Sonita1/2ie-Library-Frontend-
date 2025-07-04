"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle,
  X,
  BookOpen,
  Presentation,
  GraduationCap,
} from "lucide-react"

export function EvenementsContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [events, setEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Chargement des événements
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockEvents = [
        {
          id: 1,
          title: "Atelier : Recherche Documentaire Avancée",
          description:
            "Apprenez les techniques avancées de recherche documentaire et découvrez les ressources spécialisées de notre bibliothèque.",
          category: "Formation",
          date: "2024-04-15",
          time: "14:00",
          duration: "2h",
          location: "Salle de formation - Niveau 2",
          instructor: "Dr. Marie Dubois",
          maxParticipants: 25,
          currentParticipants: 18,
          image: "/placeholder.svg?height=200&width=300",
          tags: ["Recherche", "Documentation", "Méthodologie"],
          level: "Intermédiaire",
          isRegistered: false,
        },
        {
          id: 2,
          title: "Conférence : Intelligence Artificielle et Éthique",
          description:
            "Une discussion approfondie sur les enjeux éthiques de l'intelligence artificielle dans notre société moderne.",
          category: "Conférence",
          date: "2024-04-20",
          time: "16:00",
          duration: "1h30",
          location: "Amphithéâtre principal",
          instructor: "Prof. Ahmed Ben Ali",
          maxParticipants: 100,
          currentParticipants: 67,
          image: "/placeholder.svg?height=200&width=300",
          tags: ["IA", "Éthique", "Technologie"],
          level: "Tous niveaux",
          isRegistered: true,
        },
        {
          id: 3,
          title: "Séminaire : Développement Durable en Ingénierie",
          description: "Explorez les pratiques durables en ingénierie et leur impact sur l'environnement.",
          category: "Séminaire",
          date: "2024-04-25",
          time: "10:00",
          duration: "3h",
          location: "Salle de conférence A",
          instructor: "Dr. Fatima Ouedraogo",
          maxParticipants: 40,
          currentParticipants: 23,
          image: "/placeholder.svg?height=200&width=300",
          tags: ["Environnement", "Ingénierie", "Durabilité"],
          level: "Avancé",
          isRegistered: false,
        },
        {
          id: 4,
          title: "Workshop : Gestion de Projet Agile",
          description:
            "Découvrez les méthodes agiles pour la gestion de projets techniques et leur application pratique.",
          category: "Workshop",
          date: "2024-04-18",
          time: "09:00",
          duration: "4h",
          location: "Laboratoire informatique",
          instructor: "M. Ibrahim Kaboré",
          maxParticipants: 20,
          currentParticipants: 15,
          image: "/placeholder.svg?height=200&width=300",
          tags: ["Gestion", "Projet", "Agile"],
          level: "Intermédiaire",
          isRegistered: false,
        },
        {
          id: 5,
          title: "Table Ronde : Énergies Renouvelables en Afrique",
          description: "Discussion avec des experts sur l'avenir des énergies renouvelables sur le continent africain.",
          category: "Table Ronde",
          date: "2024-04-22",
          time: "15:00",
          duration: "2h",
          location: "Salle polyvalente",
          instructor: "Panel d'experts",
          maxParticipants: 60,
          currentParticipants: 34,
          image: "/placeholder.svg?height=200&width=300",
          tags: ["Énergie", "Afrique", "Renouvelable"],
          level: "Tous niveaux",
          isRegistered: false,
        },
        {
          id: 6,
          title: "Formation : Outils de Recherche Numérique",
          description:
            "Maîtrisez les outils numériques essentiels pour vos recherches académiques et professionnelles.",
          category: "Formation",
          date: "2024-04-12",
          time: "13:30",
          duration: "2h30",
          location: "Salle informatique B",
          instructor: "Mme. Aminata Traoré",
          maxParticipants: 30,
          currentParticipants: 30,
          image: "/placeholder.svg?height=200&width=300",
          tags: ["Numérique", "Recherche", "Outils"],
          level: "Débutant",
          isRegistered: true,
          status: "Complet",
        },
      ]

      setEvents(mockEvents)
      setMyEvents(mockEvents.filter((event) => event.isRegistered))
      setLoading(false)
    }

    loadEvents()
  }, [])

  // Filtrage des événements
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleRegisterEvent = async (eventId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, isRegistered: true, currentParticipants: event.currentParticipants + 1 }
            : event,
        ),
      )

      const event = events.find((e) => e.id === eventId)
      if (event) {
        setMyEvents((prev) => [...prev, { ...event, isRegistered: true }])
      }

      toast({
        title: "Inscription confirmée",
        description: "Vous êtes maintenant inscrit à cet événement.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire à cet événement.",
        variant: "destructive",
      })
    }
  }

  const handleUnregisterEvent = async (eventId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, isRegistered: false, currentParticipants: Math.max(0, event.currentParticipants - 1) }
            : event,
        ),
      )

      setMyEvents((prev) => prev.filter((event) => event.id !== eventId))

      toast({
        title: "Désinscription confirmée",
        description: "Vous n'êtes plus inscrit à cet événement.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se désinscrire de cet événement.",
        variant: "destructive",
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Formation":
        return <GraduationCap className="h-4 w-4" />
      case "Conférence":
        return <Presentation className="h-4 w-4" />
      case "Workshop":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getLevelBadge = (level: string) => {
    const colors = {
      Débutant: "bg-green-500",
      Intermédiaire: "bg-yellow-500",
      Avancé: "bg-red-500",
      "Tous niveaux": "bg-blue-500",
    }
    return <Badge className={colors[level] || "bg-gray-500"}>{level}</Badge>
  }

  const isEventFull = (event: any) => {
    return event.currentParticipants >= event.maxParticipants
  }

  const isEventPast = (event: any) => {
    return new Date(event.date) < new Date()
  }

  if (loading) {
    return (
      <div className="container-2ie py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Événements de la Bibliothèque</h1>
        <p className="text-muted-foreground">
          Participez à nos formations, conférences et ateliers pour enrichir vos connaissances
        </p>
      </div>

      {/* Filtres */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, description ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="Formation">Formation</SelectItem>
                <SelectItem value="Conférence">Conférence</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Séminaire">Séminaire</SelectItem>
                <SelectItem value="Table Ronde">Table Ronde</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Tous les événements ({filteredEvents.length})</TabsTrigger>
          <TabsTrigger value="my-events">Mes inscriptions ({myEvents.length})</TabsTrigger>
        </TabsList>

        {/* Tous les événements */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <Badge className="bg-white/90 text-gray-800">
                      {getCategoryIcon(event.category)}
                      <span className="ml-1">{event.category}</span>
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">{getLevelBadge(event.level)}</div>
                  {event.isRegistered && (
                    <div className="absolute bottom-3 right-3">
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Inscrit
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {event.time} ({event.duration})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {event.currentParticipants}/{event.maxParticipants} participants
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardContent className="pt-0">
                  {event.isRegistered ? (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleUnregisterEvent(event.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Se désinscrire
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={isEventFull(event) || isEventPast(event)}
                      onClick={() => handleRegisterEvent(event.id)}
                    >
                      {isEventFull(event) ? (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Complet
                        </>
                      ) : isEventPast(event) ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Terminé
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          S'inscrire
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Mes événements */}
        <TabsContent value="my-events">
          <div className="space-y-4">
            {myEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className="bg-blue-100 text-blue-800">
                              {getCategoryIcon(event.category)}
                              <span className="ml-1">{event.category}</span>
                            </Badge>
                            {getLevelBadge(event.level)}
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Inscrit
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                          <p className="text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{new Date(event.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {event.time} ({event.duration})
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {event.currentParticipants}/{event.maxParticipants} participants
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button variant="outline" size="sm" onClick={() => handleUnregisterEvent(event.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Se désinscrire
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {myEvents.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune inscription</h3>
                  <p className="text-muted-foreground">Vous n'êtes inscrit à aucun événement pour le moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun événement trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos critères de recherche ou vos filtres.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
