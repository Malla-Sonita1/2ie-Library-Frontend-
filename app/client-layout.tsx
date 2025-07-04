// // Ce fichier est à supprimer si doublon avec clientLayout.tsx

// "use client"

// import type React from "react"
// import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
// import { AuthProvider } from "@/contexts/auth-context"
// import { Toaster } from "@/components/ui/toaster"
// import { Navbar } from "@/components/navbar"
// import { Footer } from "@/components/footer"
// import { Chatbot } from "@/components/chatbot"
// import { useAuth } from "@/contexts/auth-context"

// function ConditionalLayout({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth()

//   return (
//     <>
//       {user && <Navbar />}
//       <main className={user ? "pt-16" : ""}>{children}</main>
//       {user && <Footer />}
//       {user && <Chatbot />}
//     </>
//   )
// }

// export default function ClientLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
//       <AuthProvider>
//         <ConditionalLayout>{children}</ConditionalLayout>
//         <Toaster />
//       </AuthProvider>
//     </ThemeProvider>
//   )
// }
