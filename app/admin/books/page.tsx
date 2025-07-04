"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminBooksManagement } from "@/components/admin/admin-books-management"

export default function AdminBooksPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminBooksManagement />
    </ProtectedRoute>
  )
}
