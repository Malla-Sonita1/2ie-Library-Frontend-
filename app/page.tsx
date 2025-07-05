"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BookOpen,
  UserPlus,
  LogIn,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  X,
  Shield,
  GraduationCap,
  Heart,
  Sparkles,
  Library,
  Search,
  Globe,
  Smartphone,
  TrendingUp,
  Award,
  Clock,
  Menu,
  Star,
  Zap,
  Phone,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getStats } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";

/**
 * Page d'accueil - Landing page de la bibliothèque 2iE
 * Design moderne, interactif et mobile-first avec couleurs vibrantes
 */
export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrows: 0,
    satisfaction: 0,
  })

  // Chargement des statistiques depuis le backend
  useEffect(() => {
    if (user?.role === "admin") {
      const loadStats = async () => {
        try {
          const stats = await getStats();
          setStats(stats);
        } catch {
          // fallback ou valeurs par défaut
        }
      };
      loadStats();
    }
  }, [user]);


  // Afficher la landing page pour tout le monde
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header moderne et coloré */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo avec gradient */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <BookOpen className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  2iE Library
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">Institut International d'Ingénierie</p>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a
                href="#ressources"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Ressources
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Services
              </a>
              <a
                href="#horaires"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Horaires
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-pink-600 transition-colors font-medium hover:scale-105 transform duration-200"
              >
                Contact
              </a>
            </nav>

            {/* Actions de connexion avec effets */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 hover:scale-105 group"
              >
                <Link href="/auth/login" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Connexion</span>
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 hover:scale-105 group"
              >
                <Link href="/auth/register" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Inscription</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section avec parallax et couleurs vibrantes */}
      <section className="relative pt-20 lg:pt-32 pb-20 lg:pb-32 overflow-hidden">
        {/* Background animé avec gradients colorés */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          <div
            className="absolute -top-40 -right-40 w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Contenu principal avec animations */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium animate-bounce-in hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Bibliothèque Universitaire Innovante
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight animate-fade-in">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Votre centre de
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    ressources académiques
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                    à 2iE
                  </span>
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-slide-in">
                  Accédez à une collection à des ouvrages
                  spécialisés en ingénierie, environnement et sciences appliquées pour soutenir vos études et
                  recherches.
                </p>
              </div>

              {/* CTA Buttons avec effets avancés */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
                <Link href="/auth/login" className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-xl px-8 py-6 text-lg transition-all duration-300 mb-2">
                  <LogIn className="h-5 w-5 mr-2" />
                  Connexion
                </Link>
                <Link href="/auth/register" className="flex items-center justify-center space-x-2 border-2 border-blue-300 hover:border-blue-400 text-blue-700 font-semibold rounded-lg px-8 py-6 text-lg bg-white/80 backdrop-blur-sm transition-all duration-300">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Inscription
                </Link>
              </div>
            </div>

            {/* Illustration interactive avec effets 3D */}
            <div className="relative animate-fade-in">
              <div className="relative z-10">
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 group">
                  <CardContent className="p-8 lg:p-10">
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300">
                          <Library className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">Accès aux Ressources</h3>
                        <p className="text-gray-600 text-lg">
                          Connectez-vous avec vos identifiants pour accéder à toutes nos ressources académiques
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg group hover:scale-105"
                        >
                          <Link href="/auth/register">
                            <GraduationCap className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                            Créer un compte
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white/50 backdrop-blur-sm py-6 text-lg group hover:scale-105 transition-all duration-300"
                        >
                          <Link href="/auth/login">
                            Connexion
                            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">
                           Réservé à la communauté 2iE •  Accès immédiat •  20+ ressources
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Éléments décoratifs flottants avec animations */}
              <div className="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 opacity-80 animate-bounce hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute -bottom-6 -left-6 w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 opacity-80 animate-pulse hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute top-1/2 -left-10 w-6 h-6 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 opacity-80 animate-bounce hover:scale-110 transition-transform duration-300"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator animé */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" />
        </div>
      </section>

      {/* Section Ressources avec effets hover avancés */}
      <section id="ressources" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200 mb-6 px-4 py-2 hover:scale-105 transition-transform duration-300">
              <BookOpen className="h-4 w-4 mr-2" />
              Collections Spécialisées
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Nos Ressources Académiques
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Une collection riche et diversifiée pour soutenir vos études et recherches dans tous les domaines de
              l'ingénierie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: Zap,
                title: "Génie Électrique & Énergétique",
                description:
                  "Ouvrages spécialisés en électrotechnique, énergies renouvelables et systèmes électriques",
                count: "2,500+ ouvrages",
                color: "from-yellow-500 to-orange-500",
                bgColor: "from-yellow-50 to-orange-100",
                hoverColor: "hover:border-yellow-300",
              },
              {
                icon: Globe,
                title: "Environnement & Développement Durable",
                description: "Ressources sur l'écologie, la gestion environnementale et le développement durable",
                count: "3,200+ ouvrages",
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-50 to-emerald-100",
                hoverColor: "hover:border-green-300",
              },
              {
                icon: Shield,
                title: "Génie Civil & Infrastructure",
                description: "Manuels de construction, géotechnique, hydraulique et aménagement urbain",
                count: "4,100+ ouvrages",
                color: "from-blue-500 to-indigo-500",
                bgColor: "from-blue-50 to-indigo-100",
                hoverColor: "hover:border-blue-300",
              },
              {
                icon: Smartphone,
                title: "Informatique & Numérique",
                description: "Programmation, systèmes d'information, intelligence artificielle et cybersécurité",
                count: "2,800+ ouvrages",
                color: "from-purple-500 to-violet-500",
                bgColor: "from-purple-50 to-violet-100",
                hoverColor: "hover:border-purple-300",
              },
              {
                icon: TrendingUp,
                title: "Management & Entrepreneuriat",
                description: "Gestion de projet, économie, finance et création d'entreprise",
                count: "1,900+ ouvrages",
                color: "from-pink-500 to-rose-500",
                bgColor: "from-pink-50 to-rose-100",
                hoverColor: "hover:border-pink-300",
              },
              {
                icon: Award,
                title: "Recherche & Thèses",
                description: "Accès aux thèses, mémoires et publications scientifiques de 2iE",
                count: "900+ documents",
                color: "from-red-500 to-pink-500",
                bgColor: "from-red-50 to-pink-100",
                hoverColor: "hover:border-red-300",
              },
            ].map((resource, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${resource.bgColor} hover:scale-105 transform cursor-pointer ${resource.hoverColor} border-2 border-transparent hover:-translate-y-2`}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                  >
                    <resource.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl lg:text-2xl text-gray-800 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </CardTitle>
                  <Badge className="bg-white/80 text-gray-700 border-gray-200 hover:bg-white transition-colors">
                    {resource.count}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base lg:text-lg leading-relaxed">
                    {resource.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Services avec animations */}
      <section id="services" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 mb-6 px-4 py-2 hover:scale-105 transition-transform duration-300">
              <Heart className="h-4 w-4 mr-2" />
              Services aux Étudiants
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Comment nous vous accompagnons
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto">
              Des services pensés pour faciliter vos études et optimiser votre temps de recherche
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                icon: Search,
                title: "Recherche Documentaire Assistée",
                description:
                  "Notre équipe vous aide à trouver les ressources pertinentes pour vos projets et recherches académiques.",
                features: ["Aide à la recherche", "Formation aux bases de données", "Sélection bibliographique"],
                color: "from-blue-500 to-indigo-500",
                bgColor: "from-blue-50 to-indigo-100",
              },
              {
                icon: Clock,
                title: "Réservation et Prolongation",
                description: "Système de réservation en ligne avec notifications automatiques pour les échéances.",
                features: ["Réservation en ligne", "Prolongation automatique", "Rappels par email"],
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-50 to-emerald-100",
              },
              {
                icon: Users,
                title: "Espaces de Travail",
                description: "Salles d'étude individuelles et collectives, espaces silencieux pour la concentration.",
                features: ["Salles de groupe", "Espaces silencieux", "Réservation d'espaces"],
                color: "from-purple-500 to-violet-500",
                bgColor: "from-purple-50 to-violet-100",
              },
              {
                icon: Calendar,
                title: "Formations et Ateliers",
                description:
                  "Sessions de formation sur les outils de recherche, la rédaction académique et la citation.",
                features: ["Ateliers méthodologie", "Formation outils numériques", "Aide à la rédaction"],
                color: "from-pink-500 to-rose-500",
                bgColor: "from-pink-50 to-rose-100",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className={`hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${service.bgColor} border-0 hover:scale-105 transform cursor-pointer group hover:-translate-y-2`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-base lg:text-lg">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm lg:text-base text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Horaires avec design moderne */}
      <section id="horaires" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 mb-6 px-4 py-2 hover:scale-105 transition-transform duration-300">
                <Clock className="h-4 w-4 mr-2" />
                Horaires d'Ouverture
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Toujours accessible
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  pour vos études
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La bibliothèque est ouverte 6 jours sur 7 avec un accès numérique 24h/24 pour nos ressources en ligne.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Clock,
                    label: "Lundi - Vendredi",
                    time: "8h00 - 20h00",
                    color: "from-blue-500 to-indigo-500",
                  },
                  { icon: Calendar, label: "Samedi", time: "9h00 - 17h00", color: "from-green-500 to-emerald-500" },
                  { icon: X, label: "Dimanche", time: "Fermé", color: "from-red-500 to-pink-500" },
                  {
                    icon: Globe,
                    label: "Ressources numériques",
                    time: "Accès 24h/24, 7j/7",
                    color: "from-purple-500 to-violet-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 group cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-gray-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-rotate-1">
              <CardContent className="p-8 lg:p-10">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center">Accès Membre</h3>
                <p className="text-gray-600 text-center mb-8 text-lg">
                  Créez votre compte pour accéder à tous nos services et ressources
                </p>

                <div className="space-y-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg group hover:scale-105"
                  >
                    <Link href="/auth/register">
                      <GraduationCap className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Créer mon compte
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 py-6 text-lg bg-white/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/auth/login">
                      Déjà inscrit ? Se connecter
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500">Inscription gratuite pour la communauté 2iE</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Contact avec design moderne */}
      <section
        id="contact"
        className="py-24 lg:py-36 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] rounded-3xl">
              <CardContent className="p-10 lg:p-16">
                <div className="text-center mb-10">
                  <Badge className="bg-white/20 text-white border-white/30 mb-6 px-5 py-2 text-base hover:scale-105 transition-transform duration-300">
                    <MapPin className="h-5 w-5 mr-2" />
                    Nous Contacter
                  </Badge>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                    Besoin d'aide ? <span className="text-blue-400 block">Contactez notre équipe</span>
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-200 mb-2">
                    Notre équipe de bibliothécaires est disponible pour vous accompagner dans vos recherches et répondre à vos questions.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {[
                    { icon: Phone, label: "Téléphone", value: "+226 50 49 27 00", color: "from-green-400 to-blue-500" },
                    { icon: Mail, label: "Email", value: "bibliotheque@2ie.edu", color: "from-blue-400 to-purple-500" },
                    {
                      icon: MapPin,
                      label: "Adresse",
                      value: "Rue de la Science, Ouagadougou",
                      color: "from-purple-400 to-pink-500",
                    },
                    { icon: Globe, label: "Site Web", value: "www.2ie.edu", color: "from-yellow-400 to-red-500" },
                  ].map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-6 group cursor-pointer bg-white/5 hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <contact.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                          {contact.label}
                        </p>
                        <p className="text-gray-200 text-lg">{contact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 text-lg rounded-full"
                  >
                    <Link href="mailto:bibliotheque@2ie.edu">
                      <Mail className="h-5 w-5 mr-2" />
                      Envoyer un email
                    </Link>
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                     Service gratuit pour la communauté 2iE •  Accès immédiat • 📞 Support premium inclus
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer moderne */}
      <Footer />
    </div>
  );
}


