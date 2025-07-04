"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle, Send, Bot, User, HelpCircle } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Bonjour ! Je suis l'assistant virtuel de la bibliothèque 2iE. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Questions fréquentes
  const quickQuestions = [
    "Comment emprunter un livre ?",
    "Quels sont les horaires ?",
    "Comment renouveler un emprunt ?",
    "Où trouver un livre ?",
  ]

  // Réponses automatiques simulées
  const getAutomaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("emprunter") || message.includes("emprunt")) {
      return "Pour emprunter un livre : 1) Connectez-vous à votre compte, 2) Recherchez le livre dans le catalogue, 3) Cliquez sur 'Réserver' si disponible. Vous pouvez emprunter jusqu'à 5 livres simultanément pour une durée de 2 semaines."
    }

    if (message.includes("horaire") || message.includes("heure")) {
      return "La bibliothèque est ouverte du lundi au vendredi de 8h à 18h, et le samedi de 9h à 16h. Fermée le dimanche et jours fériés."
    }

    if (message.includes("renouveler") || message.includes("prolonger")) {
      return "Vous pouvez renouveler vos emprunts depuis votre compte dans la section 'Mes Réservations', à condition qu'aucune réservation ne soit en attente sur le livre."
    }

    if (message.includes("trouver") || message.includes("localiser") || message.includes("où")) {
      return "Chaque livre a une cote indiquée dans sa fiche. Utilisez le plan de la bibliothèque disponible à l'accueil ou demandez de l'aide au personnel."
    }

    if (message.includes("retard") || message.includes("amende")) {
      return "En cas de retard, une amende de 100 FCFA par jour et par livre s'applique. Vous pouvez consulter vos amendes dans votre compte."
    }

    if (message.includes("inscription") || message.includes("compte")) {
      return "L'inscription est gratuite pour tous les étudiants et personnel de 2iE. Présentez-vous à l'accueil avec votre carte d'étudiant ou badge personnel."
    }

    if (message.includes("contact") || message.includes("aide")) {
      return "Vous pouvez nous contacter : 📧 bibliotheque@2ie.edu 📞 +226 25 49 28 00 📍 2iE Campus, Kamboinsé, Ouagadougou"
    }

    // Réponse par défaut
    return "Je ne suis pas sûr de comprendre votre question. Pouvez-vous la reformuler ? Ou contactez directement le personnel de la bibliothèque pour une assistance personnalisée."
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simuler un délai de réponse
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: getAutomaticResponse(inputMessage),
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    handleSendMessage()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-2ie-blue hover:bg-2ie-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 pb-2 border-b bg-gradient-to-r from-2ie-blue to-2ie-green text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-white">Assistant 2iE</DialogTitle>
                  <DialogDescription className="text-white/80">Bibliothèque en ligne</DialogDescription>
                </div>
              </div>
              <Badge className="bg-white/20 text-white">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                En ligne
              </Badge>
            </div>
          </DialogHeader>

          {/* Zone de messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-2ie-blue text-white" : "bg-2ie-green text-white"
                    }`}
                  >
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-2ie-blue text-white ml-auto"
                        : "bg-gray-100 dark:bg-gray-800 text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.type === "user" ? "text-white/70" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Indicateur de frappe */}
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-2ie-green text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Questions rapides */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
              <p className="text-sm font-medium mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-2ie-blue" />
                Questions fréquentes :
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-2 text-xs bg-transparent"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Tapez votre message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-2ie-blue hover:bg-2ie-blue/90 text-white"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Bot className="h-3 w-3 mr-1" />
              Assistant automatique - Pour une aide personnalisée, contactez le personnel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
