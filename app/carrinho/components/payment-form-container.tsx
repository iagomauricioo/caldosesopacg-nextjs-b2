"use client"

import { useState, useTransition } from "react"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard } from "lucide-react"
import { PaymentForm } from "@/components/payment-form"

interface PaymentFormContainerProps {
  clientId: string | null
}

export function PaymentFormContainer({ clientId }: PaymentFormContainerProps) {
  const { state, dispatch } = useCart()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handlePaymentComplete = () => {
    // Limpar carrinho e redirecionar
    dispatch({ type: "CLEAR_CART" })
  }

  if (!clientId) {
    return (
      <Alert className="border-yellow-400 bg-yellow-50">
        <AlertDescription className="text-yellow-800 font-medium">
          Complete os dados do cliente primeiro para prosseguir com o pagamento.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-cynthia-yellow-mustard/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
          <CreditCard className="w-5 h-5" />
          Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="border-red-400 bg-red-50 mb-4">
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <PaymentForm clientId={clientId} onPaymentComplete={handlePaymentComplete} isLoading={isPending} />
      </CardContent>
    </Card>
  )
}
