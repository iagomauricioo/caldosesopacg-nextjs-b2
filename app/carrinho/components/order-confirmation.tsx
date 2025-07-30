"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function OrderConfirmation() {
  const { dispatch } = useCart()

  const handleFinishOrder = () => {
    dispatch({ type: "CLEAR_CART" })
    // Redirecionar ou mostrar mensagem de sucesso
    alert("Pedido finalizado com sucesso!")
  }

  return (
    <Card className="border-cynthia-green-leaf bg-cynthia-green-leaf/5">
      <CardHeader>
        <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-cynthia-green-leaf" />
          Confirmar Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-cynthia-green-dark/70 mb-4">Revise todos os dados e confirme seu pedido.</p>
        <Button onClick={handleFinishOrder} className="w-full bg-cynthia-green-leaf hover:bg-cynthia-green-leaf/80">
          Finalizar Pedido
        </Button>
      </CardContent>
    </Card>
  )
}
