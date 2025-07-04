"use client"

import * as React from "react"
import type { JSX } from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Shield,
  Mail,
  Phone,
} from "lucide-react"
import { getUsers, updateUser, deleteUser, addUser } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Définition du type User
interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  joinDate: string
}

export function AdminUsersManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  // Nouveaux états pour les modales
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  })
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "student"
  })
  const [formError, setFormError] = useState("")

  // Chargement des utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const allUsers = await getUsers();
        setUsers(allUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.is_active === false || u.status === "suspended" ? "suspended" : "active",
          joinDate: u.created_at || "",
        })))
      } catch (e) {
        setUsers([])
      }
      setLoading(false)
    }

    loadUsers()
  }, [])

  // Filtrage des utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  interface HandleToggleUserStatusParams {
    userId: number
    currentStatus: string
  }

  const handleToggleUserStatus = async (
    userId: HandleToggleUserStatusParams["userId"],
    currentStatus: HandleToggleUserStatusParams["currentStatus"]
  ): Promise<void> => {
    try {
      // On ne suspend que les étudiants (admins non modifiables ici)
      const user = users.find((u) => u.id === userId)
      if (!user || user.role !== "student") return
      const newStatus = currentStatus === "active" ? "suspended" : "active"
      await fetch(`/api/auth/students/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ ...user, status: newStatus }),
      })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)))

      toast({
        title: "Statut modifié",
        description: `L'utilisateur a été ${newStatus === "active" ? "activé" : "suspendu"}.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur.",
        variant: "destructive",
      })
    }
  }

  // Ajout d'un utilisateur (admin)
  const handleAddUser = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      const res = await addUser(userData);
      if (!res.ok) throw new Error("Erreur lors de l'ajout de l'utilisateur");
      toast({ title: "Utilisateur ajouté", description: "L'utilisateur a été ajouté avec succès." });
      // Recharge la liste
      const allUsers = await getUsers();
      setUsers(allUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.is_active === false || u.status === "suspended" ? "suspended" : "active",
        joinDate: u.created_at || "",
      })));
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'ajouter l'utilisateur.", variant: "destructive" });
    }
  };

  // Modification d'un utilisateur (admin)
  const handleEditUser = async (userId: number, userData: { name: string; email: string; role: string; is_active: boolean }) => {
    try {
      const res = await updateUser(userId, userData);
      if (!res.ok) throw new Error("Erreur lors de la modification de l'utilisateur");
      toast({ title: "Utilisateur modifié", description: "L'utilisateur a été modifié avec succès." });
      // Recharge la liste
      const allUsers = await getUsers();
      setUsers(allUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.is_active === false || u.status === "suspended" ? "suspended" : "active",
        joinDate: u.created_at || "",
      })));
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de modifier l'utilisateur.", variant: "destructive" });
    }
  };

  // Suppression d'un utilisateur (admin)
  const handleDeleteUser = async (userId: number): Promise<void> => {
    try {
      const res = await deleteUser(userId);
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'utilisateur");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({ title: "Utilisateur supprimé", description: "L'utilisateur a été supprimé du système." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer l'utilisateur.", variant: "destructive" });
    }
  };

  interface RoleBadgeProps {
    role: string
  }

  const getRoleBadge = (role: RoleBadgeProps["role"]): JSX.Element => {
    if (role === "admin") {
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <GraduationCap className="h-3 w-3 mr-1" />
          Étudiant
        </Badge>
      )
    }
  }

  interface StatusBadgeProps {
    status: string
  }

  const getStatusBadge = (status: StatusBadgeProps["status"]): JSX.Element => {
    if (status === "active") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Actif
        </Badge>
      )
    } else if (status === "suspended") {
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <XCircle className="h-3 w-3 mr-1" />
          Suspendu
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600">
          <Clock className="h-3 w-3 mr-1" />
          Inactif
        </Badge>
      )
    }
  }

  // Voir utilisateur
  function handleViewUser(user: User) {
    setViewUser(user)
  }
  // Ouvre la modale d'édition
  function handleEditUserDialog(user: User) {
    setEditUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role
    })
  }
  // Ouvre la modale d'ajout
  function handleAddUserDialog() {
    setAddForm({ name: "", email: "", password: "", role: "student" })
    setAddDialogOpen(true)
  }
  // Demande de confirmation suppression
  function handleDeleteUserConfirm(userId: number) {
    setDeleteUserId(userId)
  }
  // Soumission édition
  async function handleEditUserSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editUser) return
    setFormError("")
    if (!editForm.name || !editForm.email) {
      setFormError("Nom et email requis")
      return
    }
    await handleEditUser(editUser.id, {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      is_active: true
    })
    setEditUser(null)
  }
  // Soumission ajout
  async function handleAddUserSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")
    if (!addForm.name || !addForm.email || !addForm.password) {
      setFormError("Tous les champs requis")
      return
    }
    await handleAddUser(addForm)
    setAddDialogOpen(false)
  }
  // Soumission suppression
  async function handleDeleteUserSubmit() {
    if (deleteUserId) {
      await handleDeleteUser(deleteUserId)
      setDeleteUserId(null)
    }
  }

  if (loading) {
    return (
      <div className="container-2ie py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-2ie-blue mx-auto"></div>
            <p className="text-muted-foreground">Chargement des utilisateurs...</p>
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
            <Badge className="bg-2ie-green text-white">
              <Users className="h-3 w-3 mr-1" />
              GESTION DES UTILISATEURS
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Gestion des Utilisateurs</h1>
          <p className="text-lg text-muted-foreground">Administrez les comptes étudiants et administrateurs</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-2ie-blue hover:bg-2ie-blue/90 text-white" onClick={handleAddUserDialog}>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-2ie-blue/10 to-2ie-blue/5 border-l-4 border-2ie-blue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-2ie-blue">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-2ie-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-green/10 to-2ie-green/5 border-l-4 border-2ie-green">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Étudiants</p>
                <p className="text-2xl font-bold text-2ie-green">
                  {users.filter((user) => user.role === "student").length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-2ie-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-red/10 to-2ie-red/5 border-l-4 border-2ie-red">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Administrateurs</p>
                <p className="text-2xl font-bold text-2ie-red">
                  {users.filter((user) => user.role === "admin").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-2ie-red" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-2ie-yellow/10 to-2ie-yellow/5 border-l-4 border-2ie-yellow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold text-2ie-yellow">
                  {users.filter((user) => user.status === "active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-2ie-yellow" />
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
                  placeholder="Rechercher par nom, email ou numéro étudiant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="student">Étudiants</SelectItem>
                <SelectItem value="admin">Administrateurs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="suspended">Suspendus</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>Gérez tous les comptes utilisateurs de la bibliothèque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.joinDate ? new Date(user.joinDate).toLocaleDateString("fr-FR") : ''}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Voir le profil" onClick={() => handleViewUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Modifier l'utilisateur" onClick={() => handleEditUserDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUserConfirm(user.id)}
                          title="Supprimer l'utilisateur"
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog voir utilisateur */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails utilisateur</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-2">
              <div><b>Nom :</b> {viewUser.name}</div>
              <div><b>Email :</b> {viewUser.email}</div>
              <div><b>Rôle :</b> {viewUser.role}</div>
              <div><b>Date d'inscription :</b> {viewUser.joinDate ? new Date(viewUser.joinDate).toLocaleDateString("fr-FR") : ''}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog édition utilisateur */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUserSubmit} className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select value={editForm.role} onValueChange={v => setEditForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            <DialogFooter>
              <Button type="submit">Enregistrer</Button>
              <Button type="button" variant="ghost" onClick={() => setEditUser(null)}>Annuler</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Dialog ajout utilisateur */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUserSubmit} className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <Label>Mot de passe</Label>
              <Input type="password" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select value={addForm.role} onValueChange={v => setAddForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            <DialogFooter>
              <Button type="submit">Ajouter</Button>
              <Button type="button" variant="ghost" onClick={() => setAddDialogOpen(false)}>Annuler</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Dialog confirmation suppression */}
      <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteUserSubmit}>Supprimer</Button>
            <Button variant="ghost" onClick={() => setDeleteUserId(null)}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
