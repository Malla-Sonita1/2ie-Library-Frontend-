"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getUserReservationsWithQueue, cancelReservation, fulfillReservation } from "@/lib/api";

export type Reservation = {
  id: number;
  book_id: number;
  status: 'en_attente' | 'annulee' | 'honoree';
  reserved_at: string;
  reservation_date: string;
  queue_position: number;
  title: string;
  author: string;
  image?: string;
};

export default function ReservationsPage() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      getUserReservationsWithQueue().then(setReservations);
    }
  }, [token]);

  async function handleCancel(id: number) {
    setLoading(true);
    setMessage("");
    try {
      const res = await cancelReservation(id);
      if (res.success) {
        setMessage("Réservation annulée.");
        setReservations(prev => prev.filter(r => r.id !== id));
      } else {
        setMessage(res.message || "Erreur lors de l'annulation.");
      }
    } catch {
      setMessage("Erreur lors de l'annulation.");
    }
    setLoading(false);
  }

  async function handleFulfill(id: number) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fulfillReservation(id);
      if (res.success) {
        setMessage("Réservation honorée, emprunt créé.");
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "honoree" } : r));
      } else {
        setMessage(res.message || "Erreur lors de l'emprunt.");
      }
    } catch {
      setMessage("Erreur lors de l'emprunt.");
    }
    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mes réservations</h2>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <ul className="space-y-4">
        {reservations.length === 0 && <li>Aucune réservation en cours.</li>}
        {reservations.map(r => (
          <li key={r.id} className="border p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {r.image && <img src={r.image} alt={r.title} className="w-16 h-24 object-cover rounded" />}
              <div>
                <div><b>Livre :</b> {r.title} <span className="text-gray-500">par {r.author}</span></div>
                <div><b>Date de réservation :</b> {r.reservation_date}</div>
                <div><b>Statut :</b> {r.status}</div>
                <div><b>Position dans la file d'attente :</b> {r.queue_position}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              {r.status === "en_attente" && (
                <>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50" onClick={() => handleCancel(r.id)} disabled={loading}>Annuler</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" onClick={() => handleFulfill(r.id)} disabled={loading}>Honorer</button>
                </>
              )}
              {r.status === "honoree" && <span className="text-green-700">Emprunté</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
