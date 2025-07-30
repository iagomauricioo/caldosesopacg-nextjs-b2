"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, CreditCard, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types/product"
import { Suspense } from "react"
import { CartContainer } from "./components/cart-container"
import { CartSkeleton } from "./components/cart-skeleton"

type CheckoutStep = "client" | "payment" | "confirmation"

export default function CarrinhoClientPage() {
  const { state, dispatch, getSubtotal, getTotal, getItemCount } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("client")
  const [clientId, setClientId] = useState<string | null>(null)

  const steps = [
    { id: "client", label: "Cliente", icon: User },
    { id: "payment", label: "Pagamento", icon: CreditCard },
    { id: "confirmation", label: "Confirmação", icon: CheckCircle },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleClientSaved = (id: string) => {
    setClientId(id)
    setCurrentStep("payment")
  }

  const handlePaymentComplete = () => {
    setCurrentStep("confirmation")
  }

  const handleFinishOrder = () => {
    // Aqui você implementaria a finalização do pedido
    dispatch({ type: "CLEAR_CART" })
    alert("Pedido finalizado com sucesso!")
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case "client":
        return !!clientId
      case "payment":
        return true // Implementar validação de pagamento
      default:
        return false
    }
  }

  function getImageUrl(product: Product): string {
    if (product.imagem_url) return product.imagem_url
    const imageMap: { [key: number]: string } = {
      1: "/images/caldos/caldo-de-galinha.png",
      2: "/images/caldos/caldo-de-kenga.png",
      3: "/images/caldos/caldo-de-charque.jpeg",
      4: "/images/caldos/caldo-de-feijao.png",
      5: "/images/caldos/caldo-de-legumes.jpeg",
      6: "/images/caldos/creme-de-abobora.jpeg",
    }
    return imageMap[product.id] || "/placeholder.svg"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-white to-cynthia-yellow-light/20">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<CartSkeleton />}>
          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-24 h-24 mx-auto text-cynthia-green-dark/30 mb-6" />
              <h1 className="text-3xl font-bold text-cynthia-green-dark mb-4">Seu carrinho está vazio</h1>
              <p className="text-cynthia-green-dark/70 mb-8">Adicione alguns caldos deliciosos ao seu carrinho!</p>
              <Link href="/">
                <Button className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80">Ver Cardápio</Button>
              </Link>
            </div>
          ) : (
            <CartContainer />
          )}
        </Suspense>
      </div>
    </div>
  )
}
