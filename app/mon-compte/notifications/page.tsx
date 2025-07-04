"use client";

import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "@/lib/api";

export type Notification = {
  id: number;
  user_id: number;
  type: string;
  message: string;
  created_at: string;
  is_read?: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getNotifications().then(setNotifications).finally(() => setLoading(false));
  }, []);

  async function handleMarkAsRead(id: number) {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mes notifications</h2>
      {loading && <div>Chargement...</div>}
      <ul className="space-y-4">
        {notifications.length === 0 && !loading && <li>Aucune notification.</li>}
        {notifications.map(n => (
          <li key={n.id} className={`border p-4 rounded flex flex-col ${n.is_read ? 'bg-gray-100' : 'bg-white'}`}>
            <div><b>Type :</b> {n.type}</div>
            <div><b>Message :</b> {n.message}</div>
            <div className="text-gray-500 text-sm">{new Date(n.created_at).toLocaleString()}</div>
            {!n.is_read && (
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded w-max hover:bg-blue-700"
                onClick={() => handleMarkAsRead(n.id)}
              >
                Marquer comme lue
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
