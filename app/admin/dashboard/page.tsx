import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminBooksManagement } from "@/components/admin/admin-books-management"
import { AdminUsersManagement } from "@/components/admin/admin-users-management"
import { AdminStats } from "@/components/admin/AdminStats"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLoansManagement } from "@/components/admin/admin-loans-management"

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container-2ie py-8">
        <Tabs defaultValue="livres" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="livres">Livres</TabsTrigger>
            <TabsTrigger value="etudiants">Étudiants</TabsTrigger>
            <TabsTrigger value="emprunts">Emprunts</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          <TabsContent value="livres">
            <AdminBooksManagement />
          </TabsContent>
          <TabsContent value="etudiants">
            <AdminUsersManagement />
          </TabsContent>
          <TabsContent value="emprunts">
            <AdminLoansManagement />
          </TabsContent>
          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
