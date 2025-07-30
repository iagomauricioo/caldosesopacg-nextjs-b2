"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, CreditCard, CheckCircle } from "lucide-react"
import { ClientFormContainer } from "./client-form-container"
import { PaymentFormContainer } from "./payment-form-container"
import { OrderConfirmation } from "./order-confirmation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  observations?: string
}

interface CheckoutFlowProps {
  onBack: () => void
  items: CartItem[]
  total: number
}

type CheckoutStep = "client" | "payment" | "confirmation"

export function CheckoutFlow({ onBack, items, total }: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("client")
  const [clientId, setClientId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleClientComplete = (id: string) => {
    setClientId(id)
    setCurrentStep("payment")
  }

  const handlePaymentComplete = (id: string) => {
    setOrderId(id)
    setCurrentStep("confirmation")
  }

  const steps = [
    { id: "client", label: "Dados", icon: User, active: currentStep === "client", completed: !!clientId },
    { id: "payment", label: "Pagamento", icon: CreditCard, active: currentStep === "payment", completed: !!orderId },
    {
      id: "confirmation",
      label: "Confirmação",
      icon: CheckCircle,
      active: currentStep === "confirmation",
      completed: false,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-cynthia-green-dark hover:text-cynthia-green-dark/80">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Carrinho
        </Button>

        <h1 className="text-2xl font-bold text-cynthia-green-dark">Finalizar Pedido</h1>
      </div>

      {/* Indicador de progresso */}
      <div className="flex items-center justify-center space-x-8 py-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${
                  step.active
                    ? "border-cynthia-green-dark bg-cynthia-green-dark text-white"
                    : step.completed
                      ? "border-cynthia-green-leaf bg-cynthia-green-leaf text-white"
                      : "border-gray-300 bg-white text-gray-400"
                }
              `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`
                ml-2 text-sm font-medium
                ${
                  step.active ? "text-cynthia-green-dark" : step.completed ? "text-cynthia-green-leaf" : "text-gray-400"
                }
              `}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`
                  w-16 h-px mx-4 transition-colors
                  ${step.completed ? "bg-cynthia-green-leaf" : "bg-gray-300"}
                `}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Conteúdo do passo atual */}
      <div className="min-h-[400px]">
        {currentStep === "client" && <ClientFormContainer onComplete={handleClientComplete} />}

        {currentStep === "payment" && (
          <PaymentFormContainer clientId={clientId} items={items} total={total} onComplete={handlePaymentComplete} />
        )}

        {currentStep === "confirmation" && <OrderConfirmation orderId={orderId} />}
      </div>
    </div>
  )
}
