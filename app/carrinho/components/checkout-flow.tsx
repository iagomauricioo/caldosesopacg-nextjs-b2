"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { CartItem } from "@/types/product"

interface CheckoutFlowProps {
  onBack: () => void
  items: CartItem[]
  total: number
}

export function CheckoutFlow({ onBack, items, total }: CheckoutFlowProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Carrinho
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-cynthia-green-dark">Finalizar Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8">
              <p className="text-cynthia-green-dark/70 mb-4">Funcionalidade de checkout em desenvolvimento</p>
              <p className="font-semibold text-cynthia-green-dark">Total: R$ {(total / 100).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
