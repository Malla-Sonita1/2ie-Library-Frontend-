"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { getReservations, getUserReservations } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

export default function MonComptePage() {
  return (
    <ProtectedRoute requiredRole="student">
      <MonCompteContent />
    </ProtectedRoute>
  )
}

type Emprunt = {
  id: number;
  book_id: number;
  user_id: number;
  status: 'active' | 'returned' | 'expired';
  reserved_at: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export function MonCompteContent() {
  const { token, user } = useAuth();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [empruntsHist, setEmpruntsHist] = useState<Emprunt[]>([]);
  const [reservationsHist, setReservationsHist] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Séparation des emprunts actifs
  const empruntsActifs = emprunts.filter(e => e.status === "active");
  // Séparation des réservations en cours
  const reservationsActives = reservations.filter(r => r.status === "en_attente");

  useEffect(() => {
    if (token) {
      import("@/lib/api").then(api => {
        api.getUserLoans().then(setEmprunts).catch(() => setEmprunts([]));
        api.getUserHistory().then(setEmpruntsHist).catch(() => setEmpruntsHist([]));
        api.getUserReservationsHistory().then(setReservationsHist).catch(() => setReservationsHist([]));
        api.getUserReservations().then(setReservations).catch(() => setReservations([]));
      });
    }
  }, [token]);

  async function handleReturn(empruntId: number) {
    setLoading(true);
    setMessage("");
    try {
      const res = await import("@/lib/api").then(m => m.returnBook(empruntId));
      if (res.success) {
        setMessage("Livre retourné avec succès.");
        setEmprunts(prev => prev.map(r => r.id === empruntId ? { ...r, status: "returned" } : r));
      } else {
        setMessage(res.message || "Erreur lors du retour.");
      }
    } catch (e) {
      setMessage("Erreur lors du retour.");
    }
    setLoading(false);
  }

  return (
    <div className="py-8 px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-2ie-blue">Mes emprunts actifs</h2>
      {message && <div className="mb-2 text-green-600 font-semibold">{message}</div>}
      <ul className="space-y-4">
        {empruntsActifs.length === 0 && <li className="text-gray-500">Aucun emprunt en cours.</li>}
        {empruntsActifs.map((r: any) => (
          <li key={r.id} className="border p-4 rounded-lg bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div><b>Livre :</b> {r.book_id}</div>
              <div><b>Date d'emprunt :</b> {r.reserved_at ? new Date(r.reserved_at).toLocaleDateString() : "-"}</div>
              <div><b>Date de fin prévue :</b> {r.due_date ? new Date(r.due_date).toLocaleDateString("fr-FR") : "-"}</div>
              <div><b>Statut :</b> <span className="text-blue-700 font-semibold">{r.status}</span></div>
              {(r.status === "returned" || r.status === "expired") && (
                <div><b>Date de fin d'emprunt :</b> {r.updated_at ? new Date(r.updated_at).toLocaleDateString("fr-FR") : "-"}</div>
              )}
            </div>
            {r.status === "active" && (
              <button
                className="mt-2 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleReturn(r.id)}
                disabled={loading}
              >
                Retourner
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="my-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-2ie-blue">Mes réservations en cours</h2>
        <ul className="space-y-4">
          {reservationsActives.length === 0 && <li className="text-gray-500">Aucune réservation en cours.</li>}
          {reservationsActives.map((res: any) => (
            <li key={res.id} className="border p-4 rounded-lg bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><b>Livre :</b> {res.title}</div>
                <div><b>Date de réservation :</b> {res.reservation_date ? new Date(res.reservation_date).toLocaleDateString() : "-"}</div>
                <div><b>Statut :</b> <span className="text-blue-700 font-semibold">{res.status}</span></div>
                <div><b>Position dans la file :</b> {res.queue_position}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="my-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-2ie-blue">Historique des emprunts</h2>
        {empruntsHist.filter(loan => loan.status !== "active").length === 0 ? (
          <ul className="space-y-4"><li className="text-gray-500">Aucun emprunt historique.</li></ul>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empruntsHist.filter(loan => loan.status !== "active").map((loan) => (
              <div key={"emp-"+loan.id} className="border rounded-lg shadow bg-white">
                <div className="p-4 border-b bg-blue-50">
                  <span className="font-bold">Livre ID:</span> {loan.book_id}
                </div>
                <div className="p-4">
                  <div><span className="font-semibold">Emprunté le:</span> {loan.reserved_at ? new Date(loan.reserved_at).toLocaleDateString("fr-FR") : "-"}</div>
                  <div><span className="font-semibold">À rendre avant:</span> {loan.due_date ? new Date(loan.due_date).toLocaleDateString("fr-FR") : "-"}</div>
                  <div><span className="font-semibold">Statut:</span> <span className="text-blue-700 font-semibold">{loan.status}</span></div>
                  <div><span className="font-semibold">Date de fin d'emprunt:</span> {loan.updated_at ? new Date(loan.updated_at).toLocaleDateString("fr-FR") : "-"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="my-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-2ie-blue">Historique des réservations</h2>
        {reservationsHist.filter(r => r.status !== "en_attente").length === 0 ? (
          <ul className="space-y-4"><li className="text-gray-500">Aucune réservation historique.</li></ul>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservationsHist.filter(r => r.status !== "en_attente").map((res) => (
              <div key={"res-"+res.id} className="border rounded-lg shadow bg-white">
                <div className="p-4 border-b bg-blue-50">
                  <span className="font-bold">Réservation — Livre :</span> {res.title}
                </div>
                <div className="p-4">
                  <div><span className="font-semibold">Date de réservation:</span> {res.reservation_date ? new Date(res.reservation_date).toLocaleDateString("fr-FR") : "-"}</div>
                  <div><span className="font-semibold">Statut:</span> <span className="text-blue-700 font-semibold">{res.status}</span></div>
                  <div><span className="font-semibold">Position dans la file:</span> {res.queue_position}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
