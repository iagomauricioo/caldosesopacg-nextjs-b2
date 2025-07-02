import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { ReviewProvider } from "@/contexts/review-context"
import { EnhancedToastProvider } from "@/components/enhanced-toast"
import { ErrorBoundary } from "@/components/error-boundary"

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
        <ErrorBoundary>
          <CartProvider>
            <ReviewProvider>
              <EnhancedToastProvider>{children}</EnhancedToastProvider>
            </ReviewProvider>
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
