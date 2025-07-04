import { NextResponse } from "next/server"

/**
 * API Route pour la gestion des livres
 * GET /api/books - Récupère la liste des livres
 *
 * Cette API simule une base de données avec des données statiques
 * En production, cela serait connecté à une vraie base de données
 */

// Données simulées des livres
const books = [
  {
    id: 1,
    title: "L'Art de la Programmation",
    author: "Donald Knuth",
    category: "Informatique",
    isbn: "978-0201896831",
    image: "/placeholder.svg?height=300&width=200",
    available: true,
    rating: 4.8,
    description:
      "Guide complet de l'algorithmique et de la programmation informatique. Ce livre couvre les concepts fondamentaux et avancés de la programmation.",
    publishYear: 2019,
    pages: 650,
    language: "Français",
    location: "Section A - Étagère 12",
    addedDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Intelligence Artificielle Moderne",
    author: "Stuart Russell",
    category: "Informatique",
    isbn: "978-0136042594",
    image: "/placeholder.svg?height=300&width=200",
    available: false,
    rating: 4.9,
    description:
      "Approche contemporaine de l'IA et du machine learning. Explore les dernières avancées en intelligence artificielle.",
    publishYear: 2020,
    pages: 890,
    language: "Français",
    location: "Section A - Étagère 15",
    addedDate: "2024-02-10",
  },
  {
    id: 3,
    title: "Développement Durable",
    author: "Marie Dubois",
    category: "Environnement",
    isbn: "978-2100789456",
    image: "/placeholder.svg?height=300&width=200",
    available: true,
    rating: 4.6,
    description:
      "Enjeux environnementaux et solutions innovantes pour l'avenir. Un guide complet sur les pratiques durables.",
    publishYear: 2021,
    pages: 420,
    language: "Français",
    location: "Section B - Étagère 8",
    addedDate: "2024-01-20",
  },
  {
    id: 4,
    title: "Génie Civil Moderne",
    author: "Jean-Pierre Martin",
    category: "Ingénierie",
    isbn: "978-2100567890",
    image: "/placeholder.svg?height=300&width=200",
    available: true,
    rating: 4.7,
    description: "Techniques avancées en construction et infrastructure. Couvre les méthodes modernes du génie civil.",
    publishYear: 2022,
    pages: 780,
    language: "Français",
    location: "Section C - Étagère 5",
    addedDate: "2024-03-05",
  },
  {
    id: 5,
    title: "Gestion de l'Eau",
    author: "Dr. Aminata Traoré",
    category: "Environnement",
    isbn: "978-2100123456",
    image: "/placeholder.svg?height=300&width=200",
    available: true,
    rating: 4.5,
    description:
      "Ressources hydriques et techniques de traitement de l'eau. Guide pratique pour la gestion durable de l'eau.",
    publishYear: 2021,
    pages: 520,
    language: "Français",
    location: "Section B - Étagère 12",
    addedDate: "2024-02-28",
  },
  {
    id: 6,
    title: "Énergies Renouvelables",
    author: "Prof. Ousmane Kaboré",
    category: "Ingénierie",
    isbn: "978-2100987654",
    image: "/placeholder.svg?height=300&width=200",
    available: false,
    rating: 4.8,
    description:
      "Technologies solaires, éoliennes et hydroélectriques. Exploration complète des énergies alternatives.",
    publishYear: 2023,
    pages: 680,
    language: "Français",
    location: "Section C - Étagère 10",
    addedDate: "2024-03-15",
  },
  {
    id: 7,
    title: "Mathématiques Appliquées",
    author: "Dr. Sophie Laurent",
    category: "Mathématiques",
    isbn: "978-2100456789",
    image: "/placeholder.svg?height=300&width=200",
    available: true,
    rating: 4.4,
    description: "Calcul différentiel et intégral pour l'ingénierie. Approche pratique des mathématiques appliquées.",
    publishYear: 2020,
    pages: 590,
    language: "Français",
    location: "Section D - Étagère 3",
    addedDate: "2024-01-10",
  },
  {
    id: 8,
    title: "Chimie de l'Environnement",
    author: "Prof. Ibrahim Sawadogo",
    category: "Environnement",
    isbn: "978-2100321654",
    image: "/placeholder.svg?height=300&width=200",
    available: true,
    rating: 4.6,
    description:
      "Processus chimiques dans les écosystèmes naturels. Étude des interactions chimiques environnementales.",
    publishYear: 2022,
    pages: 450,
    language: "Français",
    location: "Section B - Étagère 15",
    addedDate: "2024-02-15",
  },
  {
    id: 9,
    title: "Réseaux et Télécommunications",
    author: "Dr. Fatou Diallo",
    category: "Informatique",
    isbn: "978-2100654321",
    image: "/placeholder.svg?height=300&width=200",
    available: true,
    rating: 4.7,
    description: "Architectures réseau et protocoles de communication. Guide complet des technologies de réseau.",
    publishYear: 2023,
    pages: 720,
    language: "Français",
    location: "Section A - Étagère 18",
    addedDate: "2024-03-20",
  },
  {
    id: 10,
    title: "Mécanique des Fluides",
    author: "Prof. Alassane Ouédraogo",
    category: "Ingénierie",
    isbn: "978-2100789123",
    image: "/placeholder.svg?height=300&width=200",
    available: false,
    rating: 4.5,
    description: "Principes fondamentaux de la mécanique des fluides. Applications en ingénierie hydraulique.",
    publishYear: 2021,
    pages: 640,
    language: "Français",
    location: "Section C - Étagère 7",
    addedDate: "2024-01-25",
  },
]

export async function GET(request: Request) {
  try {
    // Simulation d'un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Récupération des paramètres de requête pour le filtrage
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const author = searchParams.get("author")
    const available = searchParams.get("available")
    const search = searchParams.get("search")

    let filteredBooks = [...books]

    // Filtrage par catégorie
    if (category && category !== "all") {
      filteredBooks = filteredBooks.filter((book) => book.category.toLowerCase() === category.toLowerCase())
    }

    // Filtrage par auteur
    if (author && author !== "all") {
      filteredBooks = filteredBooks.filter((book) => book.author.toLowerCase().includes(author.toLowerCase()))
    }

    // Filtrage par disponibilité
    if (available === "true") {
      filteredBooks = filteredBooks.filter((book) => book.available)
    } else if (available === "false") {
      filteredBooks = filteredBooks.filter((book) => !book.available)
    }

    // Recherche textuelle
    if (search) {
      const searchLower = search.toLowerCase()
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.isbn.includes(search) ||
          book.description.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json(filteredBooks)
  } catch (error) {
    console.error("Erreur lors de la récupération des livres:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// POST pour ajouter un nouveau livre (pour l'admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation des données requises
    const requiredFields = ["title", "author", "category", "isbn", "description", "publishYear", "pages"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis` }, { status: 400 })
      }
    }

    // Vérification de l'unicité de l'ISBN
    const existingBook = books.find((book) => book.isbn === body.isbn)
    if (existingBook) {
      return NextResponse.json({ error: "Un livre avec cet ISBN existe déjà" }, { status: 409 })
    }

    // Création du nouveau livre
    const newBook = {
      id: Math.max(...books.map((b) => b.id)) + 1,
      title: body.title,
      author: body.author,
      category: body.category,
      isbn: body.isbn,
      image: body.image || "/placeholder.svg?height=300&width=200",
      available: body.available !== undefined ? body.available : true,
      rating: body.rating || 0,
      description: body.description,
      publishYear: Number.parseInt(body.publishYear),
      pages: Number.parseInt(body.pages),
      language: body.language || "Français",
      location: body.location || "À définir",
      addedDate: new Date().toISOString().split("T")[0],
    }

    // Ajout à la liste (en production, cela serait sauvegardé en base)
    books.push(newBook)

    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
