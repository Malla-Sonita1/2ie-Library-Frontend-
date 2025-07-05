"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { Search, BookOpen, Clock, Heart, Eye, Grid3X3, List } from "lucide-react"
import { BookRatingComments } from "@/components/BookRatingComments"
import { borrowBook, reserveBook } from "@/lib/api"

// Définition du type Book
interface Book {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  image: string
  available: boolean
  description: string
  publishedYear: number
  pages: number
  language: string
  publisher: string
  tags: string[]
}

// Ajoute les props books et loading
interface CatalogueContentProps {
  books: any[];
  loading: boolean;
}

export function CatalogueContent({ books, loading }: CatalogueContentProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [viewMode, setViewMode] = useState("grid")
  const [favorites, setFavorites] = useState(new Set())
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Génère dynamiquement la liste des catégories à partir des livres
  const categories = [
    "all",
    ...Array.from(new Set(books.map((book: Book) => book.category).filter(Boolean)))
  ]

  // Génère dynamiquement la liste des tags à partir des livres
  const tags = Array.from(new Set(books.flatMap((book: Book) => book.tags || [])))

  // Filtrage et tri des livres reçus en props
  const filteredBooks = books
    .filter((book: any) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Filtrage catégorie dynamique, insensible à la casse et aux espaces
      const matchesCategory =
        selectedCategory === "all" ||
        (book.category && book.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim());
      const matchesAvailability =
        selectedAvailability === "all" ||
        (selectedAvailability === "available" && book.available) ||
        (selectedAvailability === "borrowed" && !book.available)
      // Filtrage par tags (tous les tags sélectionnés doivent être présents)
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => (book.tags || []).includes(tag))

      return matchesSearch && matchesCategory && matchesAvailability && matchesTags
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "rating":
          return b.rating - a.rating
        case "year":
          return b.publishedYear - a.publishedYear
        default:
          return 0
      }
    })

  // Ajoute la durée maximale d'emprunt/réservation (2 semaines)
  const MAX_DURATION_DAYS = 14;

  // Nouvelle fonction pour réserver un livre (toujours possible)
  const handleReserveBook = async (bookId: number) => {
    try {
      const today = new Date();
      const reservationDate = new Date(today.getTime() + MAX_DURATION_DAYS * 24 * 60 * 60 * 1000);
      const res = await import("@/lib/api").then(m => m.reserveBook(bookId, reservationDate.toISOString().slice(0, 10)));
      if (res && res.success !== false) {
        toast({
          title: "Réservation confirmée",
          description: `Le livre est réservé jusqu'au ${reservationDate.toLocaleDateString("fr-FR")}.`,
        });
      } else {
        toast({
          title: "Erreur réservation",
          description: res?.message || "Impossible de réserver ce livre.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de réserver ce livre pour le moment.",
        variant: "destructive",
      });
    }
  };

  const handleBorrowBook = async (bookId: number) => {
    try {
      const today = new Date();
      const dueDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 semaines
      const res = await borrowBook(bookId, dueDate.toISOString().slice(0, 10));
      if (res && res.success !== false) {
        toast({
          title: "Emprunt confirmé",
          description: `Le livre a été emprunté jusqu'au ${dueDate.toLocaleDateString("fr-FR")}.`,
        });
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

  const toggleFavorite = (bookId: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(bookId)) {
      newFavorites.delete(bookId)
      toast({
        title: "Retiré des favoris",
        description: "Le livre a été retiré de vos favoris.",
      })
    } else {
      newFavorites.add(bookId)
      toast({
        title: "Ajouté aux favoris",
        description: "Le livre a été ajouté à vos favoris.",
      })
    }
    setFavorites(newFavorites)
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Catalogue de la Bibliothèque</h1>
        <p className="text-muted-foreground">Découvrez notre collection de {books.length} ouvrages spécialisés</p>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Recherche */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, auteur, ou mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Catégorie */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Disponibilité */}
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Disponibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les livres</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="borrowed">Empruntés</SelectItem>
              </SelectContent>
            </Select>

            {/* Tri */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Titre</SelectItem>
                <SelectItem value="author">Auteur</SelectItem>
                <SelectItem value="rating">Note</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtres par tags */}
            <div>
              <label className="block text-xs font-semibold mb-1">Tags</label>
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
                  <button
                    key={tag}
                    className={`px-2 py-1 rounded text-xs border ${selectedTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                    onClick={e => {
                      e.preventDefault();
                      setSelectedTags(selectedTags.includes(tag)
                        ? selectedTags.filter(t => t !== tag)
                        : [...selectedTags, tag])
                    }}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mode d'affichage */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">{filteredBooks.length} livre(s) trouvé(s)</p>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des livres */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-3 right-3 ${
                    book.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {book.available ? "Disponible" : "Emprunté"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 left-3 bg-white/80 hover:bg-white"
                  onClick={() => toggleFavorite(book.id)}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(book.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/70 text-white px-2 py-1 rounded">
                  {/* Retiré : rating et reviews */}
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">
                    {book.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{book.publishedYear}</span>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </CardTitle>
                <CardDescription className="text-sm">par {book.author}</CardDescription>
              </CardHeader>

              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>
                <BookRatingComments bookId={book.id.toString()} />
                <div className="flex flex-wrap gap-1 mb-3">
                  {(book.tags || []).slice(0, 3).map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{book.pages} pages</span>
                  <span>ISBN: {book.isbn}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <div className="flex space-x-2 w-full">
                  <Button
                    className="flex-1"
                    variant="default"
                    onClick={() => handleReserveBook(book.id)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Réserver
                    <span className="ml-2 text-xs text-muted-foreground">(max 2 semaines)</span>
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!book.available}
                    onClick={() => handleBorrowBook(book.id)}
                  >
                    Emprunter
                    <span className="ml-2 text-xs text-muted-foreground">(max 2 semaines)</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    width={100}
                    height={140}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {book.category}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-1">{book.title}</h3>
                        <p className="text-muted-foreground mb-2">par {book.author}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-2 ${book.available ? "bg-green-500" : "bg-red-500"}`}>
                          {book.available ? "Disponible" : "Emprunté"}
                        </Badge>
                        <div className="flex items-center">
                          {/* Retiré : Star, rating, reviews */}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                    <BookRatingComments bookId={book.id.toString()} />

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        <span>{book.pages} pages</span>
                        <span>{book.publishedYear}</span>
                        <span>ISBN: {book.isbn}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          onClick={() => handleReserveBook(book.id)}
                        >
                          Réserver
                        </Button>
                        <Button
                          variant="secondary"
                          disabled={!book.available}
                          onClick={() => handleBorrowBook(book.id)}
                        >
                          Emprunter
                          <span className="ml-2 text-xs text-muted-foreground">(max 2 semaines)</span>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(book.id)}>
                          <Heart className={`h-4 w-4 ${favorites.has(book.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredBooks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun livre trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos critères de recherche ou vos filtres.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
