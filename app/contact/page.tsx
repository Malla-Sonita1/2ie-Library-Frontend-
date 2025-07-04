"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Users,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"

/**
 * Page Contact - Formulaire de contact et informations
 * Fonctionnalités :
 * - Formulaire de contact avec validation
 * - Informations de contact statiques
 * - Carte interactive (Google Maps embed)
 * - Réseaux sociaux
 * - FAQ rapide
 */
export default function ContactPage() {
  return (
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
    
  )
}
