"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export type Emprunt = {
  id: number;
  book_id: number;
  user_id: number;
  status: 'active' | 'returned' | 'expired';
  reserved_at: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export default function HistoriquePage() {
  const { token } = useAuth();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch("/api/loans/history", { credentials: "include" })
        .then(res => res.json())
        .then(setEmprunts)
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mon historique d'emprunts</h2>
      {loading && <div>Chargement...</div>}
      <ul className="space-y-4">
        {emprunts.length === 0 && !loading && <li>Aucun emprunt trouvé.</li>}
        {emprunts.map(e => (
          <li key={e.id} className="border p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div><b>Livre :</b> {e.book_id}</div>
              <div><b>Date d'emprunt :</b> {e.reserved_at ? new Date(e.reserved_at).toLocaleDateString() : "-"}</div>
              <div><b>Date de retour :</b> {e.status === "returned" ? new Date(e.updated_at).toLocaleDateString() : "-"}</div>
              <div><b>Statut :</b> {e.status}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
