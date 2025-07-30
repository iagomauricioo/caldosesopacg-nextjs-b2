"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { EmptyCart } from "./empty-cart"
import { CartItemCard } from "./cart-item-card"
import { CartSummary } from "./cart-summary"
import { CheckoutFlow } from "./checkout-flow"

export function CartContainer() {
  const { state, getItemCount, getSubtotal, getTotal } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  // Verificar se o carrinho está vazio
  if (!state.items || state.items.length === 0) {
    return <EmptyCart />
  }

  if (showCheckout) {
    return <CheckoutFlow onBack={() => setShowCheckout(false)} items={state.items} total={getTotal()} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="text-cynthia-green-dark hover:text-cynthia-green-dark/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div className="h-6 w-px bg-cynthia-green-dark/20" />
          <h1 className="text-2xl font-bold text-cynthia-green-dark flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Meu Carrinho ({getItemCount()})
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-cynthia-green-dark/20">
            <CardHeader className="bg-cynthia-cream">
              <CardTitle className="text-cynthia-green-dark">Itens do Pedido ({state.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {state.items.map((item) => (
                <CartItemCard key={`${item.product.id}-${item.variation.tamanho_ml}`} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumo e Checkout */}
        <div className="space-y-4">
          <CartSummary />

          <Button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white"
            size="lg"
          >
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  )
}
