import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientCartProvider } from "@/components/client-cart-provider"
import { ClientReviewProvider } from "@/components/client-review-provider"
import { ClientEnhancedToastProvider } from "@/components/client-enhanced-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Caldos da Cynthia - Caldos Artesanais",
  description: "Caldos artesanais feitos com amor e ingredientes frescos. Entrega rápida em São Miguel dos Campos.",
  keywords: "caldos, artesanal, delivery, São Miguel dos Campos, comida caseira",
  authors: [{ name: "Cynthia Gonçalves" }],
  creator: "Cynthia Gonçalves",
  publisher: "Caldos da Cynthia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientCartProvider>
          <ClientReviewProvider>
            <ClientEnhancedToastProvider>{children}</ClientEnhancedToastProvider>
          </ClientReviewProvider>
        </ClientCartProvider>
      </body>
    </html>
  )
}
