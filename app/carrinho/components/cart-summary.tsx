"use client"

import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart } from "lucide-react"
import { CartItemCard } from "./cart-item-card"

export function CartSummary() {
  const { state, getSubtotal } = useCart()
  const deliveryFee = 500 // R$ 5,00 em centavos

  return (
    <Card className="border-cynthia-yellow-mustard/30 sticky top-4">
      <CardHeader>
        <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Resumo do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.items.map((item) => (
          <CartItemCard key={`${item.product.id}-${item.variation.tamanho_ml}`} item={item} />
        ))}

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-cynthia-green-dark">
            <span>Subtotal:</span>
            <span>R$ {(getSubtotal() / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-cynthia-green-dark">
            <span>Taxa de entrega:</span>
            <span>R$ {(deliveryFee / 100).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold text-cynthia-green-dark">
            <span>Total:</span>
            <span>R$ {((getSubtotal() + deliveryFee) / 100).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
