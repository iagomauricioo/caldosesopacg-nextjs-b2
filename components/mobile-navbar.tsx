"use client"

import Link from "next/link"
import { MessageCircle, Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function MobileNavbar() {
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const handleWhatsApp = () => {
    const message = "Olá! Gostaria de fazer um pedido dos Caldos da Cynthia."
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="bg-gradient-to-r from-cynthia-green to-cynthia-green-light rounded-full px-6 py-3 shadow-xl border-2 border-cynthia-cream/20">
        <div className="flex items-center gap-8">
          {/* Cardápio */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-white hover:text-green-200 transition-colors group"
          >
            <div className="bg-cynthia-green-light p-2 rounded-full group-hover:bg-cynthia-orange transition-colors duration-300">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Cardápio</span>
          </Link>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1 text-white hover:text-green-200 transition-colors"
          >
            <div className="bg-cynthia-orange p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">WhatsApp</span>
          </button>

          {/* Avaliar */}
          <Link
            href="/avaliar"
            className="flex flex-col items-center gap-1 text-white hover:text-green-200 transition-colors group"
          >
            <div className="bg-cynthia-orange-dark p-2 rounded-full group-hover:bg-cynthia-orange transition-colors duration-300">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Avaliar</span>
          </Link>
        </div>
      </div>

      {/* Badge do carrinho */}
      {itemCount > 0 && (
        <Link href="/carrinho">
          <div className="absolute -top-2 -right-2 bg-cynthia-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
            {itemCount}
          </div>
        </Link>
      )}
    </div>
  )
}
