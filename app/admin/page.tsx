"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getStats, getBooks, getReservations } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context"; // Fix import path
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({});
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    if (token) {
      getStats().then(setStats);
      getBooks().then(setBooks);
      getReservations().then(setReservations);
    }
  }, [token]);

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard stats={stats} books={books} reservations={reservations} />
    </ProtectedRoute>
  )
}

