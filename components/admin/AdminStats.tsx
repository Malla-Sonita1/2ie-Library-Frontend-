"use client"
import { Bar } from "react-chartjs-2"
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js"
import { useEffect, useState } from "react"
import { getStats } from "@/lib/api"
Chart.register(BarElement, CategoryScale, LinearScale)

export function AdminStats() {
  const [stats, setStats] = useState<{ month: number; total: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
      .then((data) => {
        // Correction : utiliser data.monthlyBorrows ou fallback []
        setStats(Array.isArray(data) ? data : (data.monthlyBorrows || []))
      })
      .catch(() => setStats([]))
      .finally(() => setLoading(false))
  }, [])

  // Générer les labels et données dynamiquement
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
  // Compléter les mois manquants avec total: 0
  const statsByMonth: { month: number; total: number }[] = Array.from({ length: 12 }, (_, i) => {
    const found = stats.find((s) => s.month === i + 1)
    // Cast 'found' en any pour supporter 'total' ou 'borrows' sans erreur TS
    return { month: i + 1, total: found ? (typeof (found as any).total === 'number' ? (found as any).total : ((found as any).borrows ?? 0)) : 0 }
  })
  const chartData = {
    labels: statsByMonth.map((s) => months[s.month - 1]),
    datasets: [
      {
        label: "Livres empruntés",
        data: statsByMonth.map((s) => s.total),
        backgroundColor: "#6366f1",
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Nombre d\'emprunts',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Mois',
        },
      },
    },
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="font-bold mb-2">Statistiques des emprunts</h3>
      {loading ? (
        <div className="text-center text-muted-foreground">Chargement des statistiques...</div>
      ) : (
        <Bar data={chartData} options={options} height={200} />
      )}
    </div>
  )
}
