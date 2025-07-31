"use client"

import { useCart } from "@/contexts/cart-context"
import { EmptyCart } from "./empty-cart"
import { CartSummary } from "./cart-summary"
import { CartItemCard } from "./cart-item-card"
import { CheckoutFlow } from "./checkout-flow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export function CartContainer() {
  const { state } = useCart()

  // Verificação de segurança
  if (!state || !state.items || state.items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Lista de itens do carrinho */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
              <ShoppingCart className="w-5 h-5" />
              Seus Caldos ({state.items.length} {state.items.length === 1 ? "item" : "itens"})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.items.map((item) => (
              <CartItemCard key={`${item.id}-${item.tamanho_ml}`} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resumo e checkout */}
      <div className="space-y-6">
        <CartSummary />
        <CheckoutFlow />
      </div>
    </div>
  )
}
