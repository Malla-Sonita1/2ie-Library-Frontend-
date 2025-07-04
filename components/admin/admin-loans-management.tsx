"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAllLoans, returnLoan, getLoanStats } from "@/lib/api";

interface Loan {
  id: number;
  book_id: number;
  user_id: number;
  status: string;
  reserved_at: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  book?: { title: string };
  user?: { name: string; email: string };
}

export function AdminLoansManagement() {
  const { toast } = useToast();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchLoans();
    fetchStats();
  }, []);

  async function fetchLoans() {
    setLoading(true);
    try {
      const res = await getAllLoans();
      // Adaptation pour garantir un tableau
      let loansArr = [];
      if (Array.isArray(res)) loansArr = res;
      else if (res.loans && Array.isArray(res.loans)) loansArr = res.loans;
      else if (res.data && Array.isArray(res.data)) loansArr = res.data;
      setLoans(loansArr);
    } catch {
      setLoans([]);
      toast({ title: "Erreur", description: "Impossible de charger les emprunts", variant: "destructive" });
    }
    setLoading(false);
  }

  async function fetchStats() {
    try {
      const data = await getLoanStats();
      setStats(data);
    } catch {
      setStats(null);
    }
  }

  async function handleReturn(loanId: number) {
    try {
      await returnLoan(loanId, true); // true = admin
      toast({ title: "Livre retourné", description: "Le livre a été marqué comme retourné." });
      fetchLoans();
      fetchStats();
    } catch {
      toast({ title: "Erreur", description: "Impossible de marquer le retour.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques des emprunts</CardTitle>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="flex space-x-8">
              <div>Total emprunts cette année : <b>{stats.totalYear}</b></div>
              <div>Emprunts actifs : <b>{stats.active}</b></div>
              <div>Retours : <b>{stats.returned}</b></div>
            </div>
          ) : (
            <div>Chargement...</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Emprunts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livre</TableHead>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Date d'emprunt</TableHead>
                  <TableHead>Date retour prévue</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(loans) && loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.book?.title || loan.book_id}</TableCell>
                    <TableCell>{loan.user?.name} <br /> <span className="text-xs text-muted-foreground">{loan.user?.email}</span></TableCell>
                    <TableCell>{loan.reserved_at?.slice(0, 10)}</TableCell>
                    <TableCell>{loan.due_date?.slice(0, 10)}</TableCell>
                    <TableCell>{loan.status === "active" ? "Emprunté" : "Retourné"}</TableCell>
                    <TableCell>
                      {loan.status === "active" && (
                        <Button size="sm" onClick={() => handleReturn(loan.id)}>
                          Marquer comme retourné
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
