"use client";

import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";

export type Notification = {
  id: number;
  user_id: number;
  type: string;
  message: string;
  created_at: string;
  is_read?: boolean;
};

// Associe un type à une couleur et une icône
const typeMap: Record<string, { color: string; label: string; icon: any }> = {
  retard: { color: "destructive", label: "Retard", icon: AlertTriangle },
  disponibilite: { color: "secondary", label: "Disponibilité", icon: CheckCircle },
  info: { color: "default", label: "Info", icon: Info },
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
    <div className="py-8 px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-2ie-blue flex items-center gap-2">
        <Bell className="h-6 w-6 mr-2 text-2ie-blue" /> Mes notifications
      </h2>
      {loading && <div>Chargement...</div>}
      <ul className="space-y-4">
        {notifications.length === 0 && !loading && <li>Aucune notification.</li>}
        {notifications.map(n => {
          const type = n.type || "info";
          const { color, label, icon: Icon } = typeMap[type] || typeMap["info"];
          return (
            <li
              key={n.id}
              className={`border p-4 rounded flex flex-col gap-2 relative ${n.is_read ? 'bg-gray-100' : 'bg-blue-50 border-blue-300'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-5 w-5 ${color === 'destructive' ? 'text-red-600' : color === 'secondary' ? 'text-green-600' : 'text-blue-600'}`} />
                <Badge variant={color as any}>{label}</Badge>
                {!n.is_read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-2ie-red animate-pulse" title="Non lue"></span>}
              </div>
              <div className="font-medium whitespace-pre-line">{n.message}</div>
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
          );
        })}
      </ul>
    </div>
  );
}
