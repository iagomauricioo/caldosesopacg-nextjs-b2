"use client"

import Link from "next/link"
import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { SteamAnimation } from "@/components/animations/steam-animation"

export function Header() {
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <header className="bg-cynthia-green-dark text-white sticky top-0 z-40 shadow-lg border-b border-cynthia-green-dark/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-cynthia-yellow-mustard rounded-full flex items-center justify-center group-hover:animate-pulse-soft transition-all duration-300 border-2 border-cynthia-yellow-mustard/20">
                <span className="text-2xl">🍲</span>
              </div>
              <SteamAnimation className="absolute -top-2 left-1/2 transform -translate-x-1/2" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-white">Cynthia Gonçalves</div>
              <div className="text-xs text-white/80">Caldos e Sopa</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-105 transform font-medium"
            >
              Início
            </Link>
            <Link
              href="/cardapio"
              className="text-white hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-105 transform font-medium"
            >
              Cardápio
            </Link>
            <Link
              href="/pedidos"
              className="text-white hover:text-cynthia-yellow-mustard transition-colors duration-300 hover:scale-105 transform font-medium"
            >
              Pedidos
            </Link>
            <Link
              href="/carrinho"
              className="text-white hover:text-cynthia-yellow-mustard flex items-center gap-2 transition-all duration-300 hover:scale-105 transform font-medium"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-cynthia-orange-pumpkin text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center animate-pulse">
                    {itemCount}
                  </Badge>
                )}
              </div>
              Carrinho
            </Link>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/carrinho" className="relative group">
              <ShoppingCart className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-cynthia-orange-pumpkin text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center animate-bounce">
                  {itemCount}
                </Badge>
              )}
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10 text-white">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-cynthia-cream border-cynthia-yellow-mustard/30">
                <SheetHeader>
                  <SheetTitle className="text-cynthia-green-dark">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <nav className="flex flex-col space-y-3">
                    <Link
                      href="/"
                      className="text-cynthia-green-dark hover:text-cynthia-orange-pumpkin transition-colors duration-300 hover:translate-x-2 transform p-2 rounded-lg hover:bg-cynthia-yellow-mustard/20 font-medium"
                    >
                      🏠 Início
                    </Link>
                    <Link
                      href="/cardapio"
                      className="text-cynthia-green-dark hover:text-cynthia-orange-pumpkin transition-colors duration-300 hover:translate-x-2 transform p-2 rounded-lg hover:bg-cynthia-yellow-mustard/20 font-medium"
                    >
                      🍲 Cardápio
                    </Link>
                    <Link
                      href="/pedidos"
                      className="text-cynthia-green-dark hover:text-cynthia-orange-pumpkin transition-colors duration-300 hover:translate-x-2 transform p-2 rounded-lg hover:bg-cynthia-yellow-mustard/20 font-medium"
                    >
                      📋 Pedidos
                    </Link>
                    <Link
                      href="/avaliar"
                      className="text-cynthia-green-dark hover:text-cynthia-orange-pumpkin transition-colors duration-300 hover:translate-x-2 transform p-2 rounded-lg hover:bg-cynthia-yellow-mustard/20 font-medium"
                    >
                      ⭐ Avaliar
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
