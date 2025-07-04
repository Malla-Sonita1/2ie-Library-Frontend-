import { NextResponse } from "next/server"

/**
 * API Route pour la gestion des réservations
 * GET /api/reservations - Récupère les réservations d'un utilisateur
 * POST /api/reservations - Crée une nouvelle réservation
 * DELETE /api/reservations/[id] - Annule une réservation
 */

// Données simulées des réservations
let reservations = [
  {
    id: 1,
    userId: 1,
    bookId: 2,
    bookTitle: "Intelligence Artificielle Moderne",
    bookAuthor: "Stuart Russell",
    bookImage: "/placeholder.svg?height=300&width=200",
    reservationDate: "2024-03-20",
    expirationDate: "2024-03-27",
    status: "active", // active, expired, cancelled, fulfilled
    pickupLocation: "Comptoir principal",
  },
  {
    id: 2,
    userId: 1,
    bookId: 6,
    bookTitle: "Énergies Renouvelables",
    bookAuthor: "Prof. Ousmane Kaboré",
    bookImage: "/placeholder.svg?height=300&width=200",
    reservationDate: "2024-03-18",
    expirationDate: "2024-03-25",
    status: "active",
    pickupLocation: "Comptoir principal",
  },
  {
    id: 3,
    userId: 1,
    bookId: 10,
    bookTitle: "Mécanique des Fluides",
    bookAuthor: "Prof. Alassane Ouédraogo",
    bookImage: "/placeholder.svg?height=300&width=200",
    reservationDate: "2024-03-15",
    expirationDate: "2024-03-22",
    status: "expired",
    pickupLocation: "Comptoir principal",
  },
]

// Fonction utilitaire pour calculer les jours restants
function getDaysRemaining(expirationDate: string): number {
  const today = new Date()
  const expiry = new Date(expirationDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// Fonction pour mettre à jour le statut des réservations expirées
function updateExpiredReservations() {
  const today = new Date().toISOString().split("T")[0]
  reservations = reservations.map((reservation) => {
    if (reservation.status === "active" && reservation.expirationDate < today) {
      return { ...reservation, status: "expired" }
    }
    return reservation
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 })
    }

    // Mise à jour des réservations expirées
    updateExpiredReservations()

    // Filtrage par utilisateur
    const userReservations = reservations
      .filter((reservation) => reservation.userId === Number.parseInt(userId))
      .map((reservation) => ({
        ...reservation,
        daysRemaining: getDaysRemaining(reservation.expirationDate),
      }))
      .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime())

    return NextResponse.json(userReservations)
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, bookId, bookTitle, bookAuthor, bookImage } = body

    // Validation des données requises
    if (!userId || !bookId) {
      return NextResponse.json({ error: "ID utilisateur et ID livre requis" }, { status: 400 })
    }

    // Vérification si l'utilisateur a déjà réservé ce livre
    const existingReservation = reservations.find(
      (reservation) =>
        reservation.userId === userId && reservation.bookId === bookId && reservation.status === "active",
    )

    if (existingReservation) {
      return NextResponse.json({ error: "Vous avez déjà réservé ce livre" }, { status: 409 })
    }

    // Vérification du nombre maximum de réservations actives (limite: 5)
    const activeReservations = reservations.filter(
      (reservation) => reservation.userId === userId && reservation.status === "active",
    )

    if (activeReservations.length >= 5) {
      return NextResponse.json({ error: "Vous avez atteint la limite de 5 réservations actives" }, { status: 409 })
    }

    // Création de la nouvelle réservation
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 7) // Réservation valide 7 jours

    const newReservation = {
      id: Math.max(...reservations.map((r) => r.id), 0) + 1,
      userId: Number.parseInt(userId),
      bookId: Number.parseInt(bookId),
      bookTitle: bookTitle || `Livre #${bookId}`,
      bookAuthor: bookAuthor || "Auteur inconnu",
      bookImage: bookImage || "/placeholder.svg?height=300&width=200",
      reservationDate: today.toISOString().split("T")[0],
      expirationDate: expirationDate.toISOString().split("T")[0],
      status: "active",
      pickupLocation: "Comptoir principal",
    }

    reservations.push(newReservation)

    // Ajout des jours restants pour la réponse
    const reservationWithDays = {
      ...newReservation,
      daysRemaining: getDaysRemaining(newReservation.expirationDate),
    }

    return NextResponse.json(reservationWithDays, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reservationId = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!reservationId || !userId) {
      return NextResponse.json({ error: "ID réservation et ID utilisateur requis" }, { status: 400 })
    }

    // Recherche de la réservation
    const reservationIndex = reservations.findIndex(
      (reservation) =>
        reservation.id === Number.parseInt(reservationId) && reservation.userId === Number.parseInt(userId),
    )

    if (reservationIndex === -1) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    const reservation = reservations[reservationIndex]

    // Vérification si la réservation peut être annulée
    if (reservation.status !== "active") {
      return NextResponse.json({ error: "Cette réservation ne peut pas être annulée" }, { status: 409 })
    }

    // Annulation de la réservation
    reservations[reservationIndex] = {
      ...reservation,
      status: "cancelled",
    }

    return NextResponse.json({
      message: "Réservation annulée avec succès",
      reservation: reservations[reservationIndex],
    })
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
