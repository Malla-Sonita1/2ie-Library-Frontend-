"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminUsersManagement } from "@/components/admin/admin-users-management"

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminUsersManagement />
    </ProtectedRoute>
  )
}
