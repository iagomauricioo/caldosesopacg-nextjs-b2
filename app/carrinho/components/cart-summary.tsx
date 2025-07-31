"use client"

import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Receipt } from "lucide-react"

export function CartSummary() {
  const { state } = useCart()

  if (!state || !state.items) {
    return null
  }

  const subtotal = state.items.reduce((total, item) => {
    return total + item.preco_centavos * item.quantidade
  }, 0)

  const frete = subtotal >= 3000 ? 0 : 500 // Frete grátis acima de R$ 30
  const total = subtotal + frete

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
          <Receipt className="w-5 h-5" />
          Resumo do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span className={frete === 0 ? "text-green-600 font-medium" : ""}>
              {frete === 0 ? "Grátis" : `R$ ${(frete / 100).toFixed(2)}`}
            </span>
          </div>
          {frete === 0 && <p className="text-sm text-green-600">🎉 Você ganhou frete grátis!</p>}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold text-cynthia-green-dark">
          <span>Total</span>
          <span>R$ {(total / 100).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
