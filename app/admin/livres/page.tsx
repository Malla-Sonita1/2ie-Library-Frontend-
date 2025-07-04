"use client";

import { useEffect, useState } from "react";
import { getBooks, addBook, updateBook, deleteBook } from "../../../lib/api";

export type Book = {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  available: boolean;
  description?: string;
  publishedYear?: number;
  pages?: number;
  language?: string;
  publisher?: string;
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Book>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getBooks().then(setBooks).finally(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (editId) {
      const res = await updateBook(editId, form);
      if (res.success) {
        setBooks(books.map(b => b.id === editId ? { ...b, ...form } as Book : b));
        setEditId(null);
        setForm({});
        setMessage("Livre modifié");
      }
    } else {
      const res = await addBook(form);
      if (res.success && res.book) {
        setBooks([res.book, ...books]);
        setForm({});
        setMessage("Livre ajouté");
      }
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    setLoading(true);
    const res = await deleteBook(id);
    if (res.success) {
      setBooks(books.filter(b => b.id !== id));
      setMessage("Livre supprimé");
    }
    setLoading(false);
  }

  function handleEdit(book: Book) {
    setEditId(book.id);
    setForm(book);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des livres</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input name="title" placeholder="Titre" value={form.title || ""} onChange={handleChange} className="border px-2 py-1 mr-2" required />
        <input name="author" placeholder="Auteur" value={form.author || ""} onChange={handleChange} className="border px-2 py-1 mr-2" required />
        <input name="isbn" placeholder="ISBN" value={form.isbn || ""} onChange={handleChange} className="border px-2 py-1 mr-2" />
        <input name="category" placeholder="Catégorie" value={form.category || ""} onChange={handleChange} className="border px-2 py-1 mr-2" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>{editId ? "Modifier" : "Ajouter"}</button>
        {editId && <button type="button" className="ml-2" onClick={() => { setEditId(null); setForm({}); }}>Annuler</button>}
      </form>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Titre</th>
            <th className="border px-2 py-1">Auteur</th>
            <th className="border px-2 py-1">Catégorie</th>
            <th className="border px-2 py-1">Disponible</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td className="border px-2 py-1">{book.title}</td>
              <td className="border px-2 py-1">{book.author}</td>
              <td className="border px-2 py-1">{book.category}</td>
              <td className="border px-2 py-1">{book.available ? "Oui" : "Non"}</td>
              <td className="border px-2 py-1">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(book)}>Modifier</button>
                <button className="text-red-600" onClick={() => handleDelete(book.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
