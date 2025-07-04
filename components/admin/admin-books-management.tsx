"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Star,
} from "lucide-react"
import { getBooks, addBook, deleteBook, updateBook } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

// TypeScript : définition du type Book pour le typage de l’état et des props
interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  rating: number;
  reviews: number;
  description: string;
  publishedYear: number;
  pages: number;
  language: string;
  location: string;
  image?: string;
  addedDate: string;
  borrowCount: number;
  reservationCount: number;
  average_rating?: string | null;
}

export function AdminBooksManagement() {
  const { toast } = useToast()
  const { token } = useAuth ? useAuth() : { token: null };
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [newBook, setNewBook] = useState<{
    title: string;
    author: string;
    isbn: string;
    category: string;
    description: string;
    publishYear: string;
    pages: string;
    language: string;
    image: string;
  }>({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    publishYear: "",
    pages: "",
    language: "Français",
    image: "",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [categories, setCategories] = useState<string[]>(["Informatique", "Environnement", "Ingénierie", "Mathématiques", "Sciences"])

  // Récupération dynamique des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/books/categories", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setCategories(data)
        }
      } catch {}
    }
    fetchCategories()
  }, [token])

  useEffect(() => {
    // Fonction pour charger les livres (simulation d'une API)
    const loadBooks = async () => {
      setLoading(true)
      try {
        const data = await getBooks();
        setBooks(data)
      } catch (error: any) {
        setBooks([])
        toast({
          title: "Erreur",
          description: "Impossible de charger les livres.",
          variant: "destructive",
        })
      }
      setLoading(false)
    }

    loadBooks()
  }, [])

  // Filtrage des livres
  const filteredBooks = books.filter((book: Book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)

    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "available" && book.available) ||
      (selectedStatus === "borrowed" && !book.available)

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Gestion de l'upload d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewBook({ ...newBook, image: file.name })
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Upload image vers backend (à adapter selon votre API)
  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    const res = await fetch("/api/books/upload-image", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    if (!res.ok) throw new Error("Erreur upload image")
    const data = await res.json()
    return data.url // l'URL de l'image stockée
  }

  // Validation avancée ISBN et numérique
  const isValidISBN = (isbn: string) => /^\d{9,13}$/.test(isbn.replace(/-/g, ""))
  const isUniqueISBN = async (isbn: string) => {
    const res = await fetch(`/api/books/check-isbn?isbn=${isbn}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    if (!res.ok) return false
    const data = await res.json()
    return !data.exists
  }

  const handleAddBook = async () => {
    // Validation des champs obligatoires
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.category || !newBook.publishYear || !newBook.pages) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires (titre, auteur, ISBN, catégorie, année, pages).",
        variant: "destructive",
      })
      return
    }
    if (!isValidISBN(newBook.isbn)) {
      toast({ title: "ISBN invalide", description: "L'ISBN doit être numérique (9 à 13 chiffres).", variant: "destructive" })
      return
    }
    if (isNaN(Number(newBook.publishYear)) || isNaN(Number(newBook.pages))) {
      toast({ title: "Erreur numérique", description: "Année et pages doivent être des nombres.", variant: "destructive" })
      return
    }
    if (!(await isUniqueISBN(newBook.isbn))) {
      toast({ title: "Doublon ISBN", description: "Un livre avec cet ISBN existe déjà.", variant: "destructive" })
      return
    }
    let imageUrl = newBook.image
    if (fileInputRef.current?.files?.[0]) {
      try {
        imageUrl = await uploadImage(fileInputRef.current.files[0])
      } catch {
        toast({ title: "Erreur image", description: "Impossible d'uploader l'image.", variant: "destructive" })
        return
      }
    }
    try {
      setLoading(true)
      const bookToAdd = {
        ...newBook,
        image: imageUrl,
        publishYear: Number.parseInt(newBook.publishYear),
        pages: Number.parseInt(newBook.pages),
        available: true,
        rating: 0,
        reviews: 0,
        addedDate: new Date().toISOString().split("T")[0],
        borrowCount: 0,
        reservationCount: 0,
      }
      // Ajout du token dans l'appel API (adapter dans lib/api.ts si besoin)
      const created = await addBook(bookToAdd)
      setBooks((prev: Book[]) => [created, ...prev])
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        category: "",
        description: "",
        publishYear: "",
        pages: "",
        language: "Français",
        image: "",
      })
      setImagePreview("")
      setIsAddDialogOpen(false)
      toast({
        title: "Livre ajouté",
        description: "Le livre a été ajouté avec succès au catalogue.",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible d'ajouter le livre.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId: number) => {
    try {
      setLoading(true)
      await deleteBook(bookId)
      setBooks((prev: Book[]) => prev.filter((book: Book) => book.id !== bookId))
      toast({
        title: "Livre supprimé",
        description: "Le livre a été supprimé du catalogue.",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer le livre.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setBookToDelete(null)
    }
  }

  // Ouvre le dialogue d'édition et pré-remplit le formulaire
  const openEditDialog = (book: Book) => {
    setEditingBook(book)
    setNewBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      description: book.description,
      publishYear: (book.publishedYear ?? '').toString(),
      pages: book.pages ? book.pages.toString() : '',
      language: book.language,
      image: book.image || "",
    })
    setIsEditDialogOpen(true)
  }

  // Fonction pour éditer un livre
  const handleEditBook = async () => {
    if (!editingBook) return
    // Validation des champs obligatoires
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.category || !newBook.publishYear || !newBook.pages) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires (titre, auteur, ISBN, catégorie, année, pages).",
        variant: "destructive",
      })
      return
    }
    try {
      setLoading(true)
      const updated = await updateBook(editingBook.id, {
        ...newBook,
        publishYear: Number.parseInt(newBook.publishYear),
        pages: Number.parseInt(newBook.pages),
      })
      setBooks((prev: Book[]) => prev.map((b) => (b.id === editingBook.id ? { ...b, ...updated } : b)))
      setIsEditDialogOpen(false)
      setEditingBook(null)
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        category: "",
        description: "",
        publishYear: "",
        pages: "",
        language: "Français",
        image: "",
      })
      toast({
        title: "Livre modifié",
        description: "Le livre a été modifié avec succès.",
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de modifier le livre.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (book: Book) => {
    if (book.available) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Disponible
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <XCircle className="h-3 w-3 mr-1" />
          Emprunté
        </Badge>
      )
    }
  }

  if (loading) {
    return (
      <div className="container-2ie py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-2ie-blue mx-auto"></div>
            <p className="text-muted-foreground">Chargement des livres...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-2ie py-8 space-y-8">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Badge className="bg-2ie-blue text-white">
              <BookOpen className="h-3 w-3 mr-1" />
              GESTION DES LIVRES
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Gestion du Catalogue</h1>
          <p className="text-lg text-muted-foreground">Administrez la collection de livres de la bibliothèque</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* SUPPRESSION DU BOUTON IMPORTER */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-2ie-green hover:bg-2ie-green/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un livre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau livre</DialogTitle>
                <DialogDescription>Remplissez les informations du livre à ajouter au catalogue</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {/* Champs de la table books uniquement */}
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Titre du livre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Auteur *</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Nom de l'auteur"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN *</Label>
                  <Input
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    placeholder="978-XXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={newBook.category}
                    onValueChange={(value) => setNewBook({ ...newBook, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishYear">Année de publication</Label>
                  <Input
                    id="publishYear"
                    type="number"
                    value={newBook.publishYear}
                    onChange={(e) => setNewBook({ ...newBook, publishYear: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Nombre de pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={newBook.pages}
                    onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
                    placeholder="300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={newBook.language}
                    onValueChange={(value) => setNewBook({ ...newBook, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Français">Français</SelectItem>
                      <SelectItem value="Anglais">Anglais</SelectItem>
                      <SelectItem value="Espagnol">Espagnol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image de couverture</Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} aria-label="Image de couverture" />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-20 h-28 object-cover rounded shadow mt-2" />
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    placeholder="Description du livre..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
                  Annuler
                </Button>
                <Button onClick={handleAddBook} className="bg-2ie-green hover:bg-2ie-green/90 text-white">
                  Ajouter le livre
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-2ie-blue/10 to-2ie-blue/5 border-l-4 border-2ie-blue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Livres</p>
                <p className="text-2xl font-bold text-2ie-blue">{books.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-2ie-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-green/10 to-2ie-green/5 border-l-4 border-2ie-green">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-2ie-green">{books.filter((book) => book.available).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-2ie-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-red/10 to-2ie-red/5 border-l-4 border-2ie-red">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Empruntés</p>
                <p className="text-2xl font-bold text-2ie-red">{books.filter((book) => !book.available).length}</p>
              </div>
              <XCircle className="h-8 w-8 text-2ie-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-yellow/10 to-2ie-yellow/5 border-l-4 border-2ie-yellow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Réservations</p>
                <p className="text-2xl font-bold text-2ie-yellow">
                  {books.reduce((sum, book) => sum + (book.reservationCount || 0), 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-2ie-yellow" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, auteur ou ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="borrowed">Empruntés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des livres */}
      <Card>
        <CardHeader>
          <CardTitle>Catalogue des Livres ({filteredBooks.length})</CardTitle>
          <CardDescription>Gérez tous les livres de la bibliothèque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Livre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Note</TableHead>
                  {/* SUPPRESSION <TableHead>Emprunts</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id} className="hover:bg-muted/50">
                    <TableCell>
                      {book.image && (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded shadow"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-muted-foreground">par {book.author}</p>
                        <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.category}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(book)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{book.average_rating !== null && book.average_rating !== undefined ? book.average_rating : 0}</span>
                      </div>
                    </TableCell>
                    {/* SUPPRESSION <TableCell>Emprunts</TableCell> */}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {/* DIALOG DE DÉTAILS */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Détails du livre</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p><b>Titre :</b> {book.title}</p>
                              <p><b>Auteur :</b> {book.author}</p>
                              <p><b>Catégorie :</b> {book.category}</p>
                              <p><b>Année :</b> {book.publishedYear ?? ''}</p>
                              <p><b>Langue :</b> {book.language}</p>
                              <p><b>Description :</b> {book.description}</p>
                              {book.image && <img src={book.image} alt={book.title} className="w-24 h-32 object-cover rounded" />}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(book)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => { setBookToDelete(book); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun livre trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog de confirmation suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le livre <b>{bookToDelete?.title}</b> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => bookToDelete && handleDeleteBook(bookToDelete.id)}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog d'édition de livre */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le livre</DialogTitle>
            <DialogDescription>Modifiez les informations du livre puis validez.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                placeholder="Titre du livre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Auteur *</Label>
              <Input
                id="author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                placeholder="Nom de l'auteur"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                placeholder="978-XXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={newBook.category}
                onValueChange={(value) => setNewBook({ ...newBook, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishYear">Année de publication</Label>
              <Input
                id="publishYear"
                type="number"
                value={newBook.publishYear}
                onChange={(e) => setNewBook({ ...newBook, publishYear: e.target.value })}
                placeholder="2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pages">Nombre de pages</Label>
              <Input
                id="pages"
                type="number"
                value={newBook.pages}
                onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
                placeholder="300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select
                value={newBook.language}
                onValueChange={(value) => setNewBook({ ...newBook, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Français">Français</SelectItem>
                  <SelectItem value="Anglais">Anglais</SelectItem>
                  <SelectItem value="Espagnol">Espagnol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image de couverture</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} aria-label="Image de couverture" />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-20 h-28 object-cover rounded shadow mt-2" />
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                placeholder="Description du livre..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleEditBook} className="bg-2ie-blue hover:bg-2ie-blue/90 text-white">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
