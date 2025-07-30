"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { User, CreditCard, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { ClientFormContainer } from "./client-form-container"
import { PaymentFormContainer } from "./payment-form-container"
import { OrderConfirmation } from "./order-confirmation"

type CheckoutStep = "client" | "payment" | "confirmation"

interface CheckoutFlowProps {
  currentStep: CheckoutStep
  onStepChange: (step: CheckoutStep) => void
  clientId: string | null
  onClientSaved: (id: string) => void
}

export function CheckoutFlow({ currentStep, onStepChange, clientId, onClientSaved }: CheckoutFlowProps) {
  const steps = [
    { id: "client", label: "Cliente", icon: User },
    { id: "payment", label: "Pagamento", icon: CreditCard },
    { id: "confirmation", label: "Confirmação", icon: CheckCircle },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

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

  const handleNext = () => {
    const nextIndex = Math.min(steps.length - 1, currentStepIndex + 1)
    onStepChange(steps[nextIndex].id as CheckoutStep)
  }

  const handlePrevious = () => {
    const prevIndex = Math.max(0, currentStepIndex - 1)
    onStepChange(steps[prevIndex].id as CheckoutStep)
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = index < currentStepIndex

            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${
                  isActive
                    ? "text-cynthia-green-dark font-semibold"
                    : isCompleted
                      ? "text-cynthia-green-leaf"
                      : "text-gray-400"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    isActive
                      ? "bg-cynthia-green-dark text-white"
                      : isCompleted
                        ? "bg-cynthia-green-leaf text-white"
                        : "bg-gray-200"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            )
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Tabs value={currentStep} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-cynthia-cream/50">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = index < currentStepIndex

            return (
              <TabsTrigger
                key={step.id}
                value={step.id}
                disabled={index > currentStepIndex}
                className="data-[state=active]:bg-cynthia-green-dark data-[state=active]:text-white"
              >
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-cynthia-green-leaf" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="client" className="space-y-6">
          <ClientFormContainer onClientSaved={onClientSaved} />
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <PaymentFormContainer clientId={clientId} />
        </TabsContent>

        <TabsContent value="confirmation" className="space-y-6">
          <OrderConfirmation />
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className="border-cynthia-yellow-mustard/50 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceedToNext() || currentStepIndex === steps.length - 1}
          className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
        >
          Próximo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
