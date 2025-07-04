"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { CatalogueContent } from "@/components/catalogue/catalogue-content"
import { getBooks, searchBooks } from "@/lib/api"
import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function CataloguePage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [filters, setFilters] = useState<{ title?: string; author?: string; category?: string; tag?: string }>({})

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true)
      try {
        let data
        if (filters.title || filters.author || filters.category || filters.tag) {
          data = await searchBooks(filters)
        } else {
          data = await getBooks()
        }
        setBooks(data)
      } catch {
        setBooks([])
      }
      setLoading(false)
    }
    loadBooks()
  }, [token, filters])

  // Ajout d'un composant de recherche avancée simple (inputs)
  return (
    <ProtectedRoute>
      <div className="mb-4 flex flex-wrap gap-2 items-end">
        <input
          type="text"
          placeholder="Titre..."
          className="border rounded px-2 py-1"
          onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Auteur..."
          className="border rounded px-2 py-1"
          onChange={e => setFilters(f => ({ ...f, author: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Catégorie..."
          className="border rounded px-2 py-1"
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Tag..."
          className="border rounded px-2 py-1"
          onChange={e => setFilters(f => ({ ...f, tag: e.target.value }))}
        />
      </div>
      <CatalogueContent books={books} loading={loading} />
    </ProtectedRoute>
  )
}
