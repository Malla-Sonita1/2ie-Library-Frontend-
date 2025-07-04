"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { ReservationsContent } from "@/components/reservations/reservations-content"
import { getReservations } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react"

export default function ReservationsPage() {
  const { token } = useAuth()
  const [reservations, setReservations] = useState([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      getReservations()
        .then(setReservations)
        .catch((err) => {
          setError(err.message || 'Erreur lors du chargement des réservations')
        })
    }
  }, [token])

  return (
    <ProtectedRoute requiredRole="student">
      {error ? (
        <div className="text-red-600 font-semibold p-4">{error}</div>
      ) : (
        <ReservationsContent reservations={reservations} />
      )}
    </ProtectedRoute>
  )
}
