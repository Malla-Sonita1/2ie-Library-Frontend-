"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { updateProfile } from "@/lib/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await updateProfile({ name, email, password: password || undefined });
    setMessage(res.message || (res.success ? "Profil mis à jour" : "Erreur"));
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input className="w-full border rounded px-2 py-1" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input className="w-full border rounded px-2 py-1" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">Nouveau mot de passe</label>
          <input className="w-full border rounded px-2 py-1" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>Mettre à jour</button>
      </form>
      {message && <div className="mt-4 text-green-700">{message}</div>}
    </div>
  );
}
