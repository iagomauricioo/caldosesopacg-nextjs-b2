"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { EmptyCart } from "./empty-cart"
import { CheckoutFlow } from "./checkout-flow"
import { CartSummary } from "./cart-summary"

export function CartContainer() {
  const { state } = useCart()
  const [currentStep, setCurrentStep] = useState<"client" | "payment" | "confirmation">("client")
  const [clientId, setClientId] = useState<string | null>(null)

  if (state.items.length === 0) {
    return <EmptyCart />
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-cynthia-green-dark mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumo do Pedido - Server Component */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>

        {/* Fluxo de Checkout - Client Component */}
        <div className="lg:col-span-2">
          <CheckoutFlow
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            clientId={clientId}
            onClientSaved={setClientId}
          />
        </div>
      </div>
    </>
  )
}
