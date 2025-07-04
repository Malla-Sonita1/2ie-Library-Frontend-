"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Clock } from "lucide-react";
import { getUserLoans } from "@/lib/api";

export default function HistoriqueEmpruntsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    getUserLoans()
      .then((data) => setLoans(data))
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container-2ie py-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Clock className="h-6 w-6" /> Historique de mes emprunts
      </h1>
      {loading ? (
        <p>Chargement...</p>
      ) : loans.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p>Aucun emprunt trouvé.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader>
                <CardTitle>Livre ID: {loan.book_id}</CardTitle>
                <CardDescription>Emprunté le: {new Date(loan.reserved_at).toLocaleDateString("fr-FR")}</CardDescription>
                <CardDescription>À rendre avant: {new Date(loan.due_date).toLocaleDateString("fr-FR")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Status: {loan.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
