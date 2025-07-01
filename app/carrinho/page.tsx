"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  User,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { ClientForm } from "@/components/client-form"
import Image from "next/image"
import Link from "next/link"

type CheckoutStep = "client" | "payment" | "confirmation"

export default function CartPage() {
  const { state, dispatch, getSubtotal, getTotal, getItemCount } = useCart()
  const { getProductImage } = useProducts()
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

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-white to-cynthia-yellow-light/20 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto text-cynthia-green-dark/30 mb-6" />
            <h1 className="text-3xl font-bold text-cynthia-green-dark mb-4">Seu carrinho está vazio</h1>
            <p className="text-cynthia-green-dark/70 mb-8">Adicione alguns caldos deliciosos ao seu carrinho!</p>
            <Link href="/">
              <Button className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80">Ver Cardápio</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-white to-cynthia-yellow-light/20 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cynthia-green-dark mb-4">Finalizar Pedido</h1>

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="border-cynthia-yellow-mustard/30 sticky top-4">
              <CardHeader>
                <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.variation.tamanho_ml}`} className="flex items-center gap-3 p-3 bg-cynthia-cream/30 rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                      <Image
                        src={item.product.imagem_url || "/placeholder.svg"}
                        alt={item.product.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-cynthia-green-dark truncate">{item.product.nome}</h3>
                      <p className="text-xs text-gray-600">{item.variation.nome_tamanho}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              dispatch({
                                type: "REMOVE_ITEM",
                                payload: { productId: item.product.id, variationSize: item.variation.tamanho_ml },
                              })
                            } else {
                              dispatch({
                                type: "UPDATE_QUANTITY",
                                payload: { productId: item.product.id, variationSize: item.variation.tamanho_ml, quantity: item.quantity - 1 },
                              })
                            }
                          }}
                          className="h-6 w-6 p-0 border-cynthia-yellow-mustard/50"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Badge variant="secondary" className="bg-cynthia-yellow-light text-cynthia-green-dark">
                          {item.quantity}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: { productId: item.product.id, variationSize: item.variation.tamanho_ml, quantity: item.quantity + 1 },
                            })
                          }}
                          className="h-6 w-6 p-0 border-cynthia-yellow-mustard/50"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            dispatch({
                              type: "REMOVE_ITEM",
                              payload: { productId: item.product.id, variationSize: item.variation.tamanho_ml },
                            })
                          }}
                          className="h-6 w-6 p-0 border-red-300 text-red-600 hover:bg-red-50 ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-cynthia-green-dark">
                        R$ {((item.variation.preco_centavos * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-cynthia-green-dark">
                    <span>Subtotal:</span>
                    <span>R$ {(getSubtotal() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-cynthia-green-dark">
                    <span>Taxa de entrega:</span>
                    <span>R$ 5,00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-cynthia-green-dark">
                    <span>Total:</span>
                    <span>R$ {((getSubtotal() / 100) + 5).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulários */}
          <div className="lg:col-span-2">
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
                <ClientForm onClientSaved={handleClientSaved} />
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                <Card className="border-cynthia-yellow-mustard/30">
                  <CardHeader>
                    <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Forma de Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cynthia-green-dark/70 mb-4">
                      Selecione a forma de pagamento (PIX, Dinheiro, etc.)
                    </p>
                    <Button
                      onClick={handlePaymentComplete}
                      className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
                    >
                      Confirmar Pagamento
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="confirmation" className="space-y-6">
                <Card className="border-cynthia-green-leaf bg-cynthia-green-leaf/5">
                  <CardHeader>
                    <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-cynthia-green-leaf" />
                      Confirmar Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cynthia-green-dark/70 mb-4">Revise todos os dados e confirme seu pedido.</p>
                    <Button
                      onClick={handleFinishOrder}
                      className="w-full bg-cynthia-green-leaf hover:bg-cynthia-green-leaf/80"
                    >
                      Finalizar Pedido
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navegação */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  const prevIndex = Math.max(0, currentStepIndex - 1)
                  setCurrentStep(steps[prevIndex].id as CheckoutStep)
                }}
                disabled={currentStepIndex === 0}
                className="border-cynthia-yellow-mustard/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              <Button
                onClick={() => {
                  const nextIndex = Math.min(steps.length - 1, currentStepIndex + 1)
                  setCurrentStep(steps[nextIndex].id as CheckoutStep)
                }}
                disabled={!canProceedToNext() || currentStepIndex === steps.length - 1}
                className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
