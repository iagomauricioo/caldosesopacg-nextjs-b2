"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"
import { useProducts } from "@/hooks/use-products"
import { ClientForm } from "@/components/client-form"
import { CepSearch } from "@/components/cep-search"
import { Minus, Plus, Trash2, ShoppingBag, MapPin, User, CreditCard, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function CartPage() {
  const { state, dispatch, getSubtotal, getTotal, getItemCount } = useCart()
  const { showToast } = useToast()
  const { getProductImage } = useProducts()

  const [currentStep, setCurrentStep] = useState(1)
  const [endereco, setEndereco] = useState<any>(null)
  const [clientId, setClientId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  const steps = [
    { number: 1, title: "Endereço", icon: MapPin, completed: !!endereco },
    { number: 2, title: "Cliente", icon: User, completed: !!clientId },
    { number: 3, title: "Pagamento", icon: CreditCard, completed: !!paymentMethod },
    { number: 4, title: "Finalizar", icon: CheckCircle, completed: false },
  ]

  const handleQuantityChange = (productId: number, variationSize: number, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { productId, variationSize },
      })
      showToast("Item removido do carrinho", "success")
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, variationSize, quantity: newQuantity },
      })
    }
  }

  const handleAddressConfirmed = (addressData: any) => {
    setEndereco(addressData)
    setCurrentStep(2)
    showToast("Endereço confirmado!", "success")
  }

  const handleClientSaved = (savedClientId: string) => {
    setClientId(savedClientId)
    setCurrentStep(3)
    showToast("Dados do cliente salvos!", "success")
  }

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method)
    setCurrentStep(4)
    showToast("Método de pagamento selecionado!", "success")
  }

  const handleFinishOrder = () => {
    // Aqui você implementaria a lógica para finalizar o pedido
    showToast("Pedido finalizado com sucesso!", "success")
    dispatch({ type: "CLEAR_CART" })
    // Redirecionar para página de confirmação ou WhatsApp
  }

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-cynthia-cream">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-cynthia-green-dark mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-8">Que tal experimentar nossos deliciosos caldos?</p>
            <Button
              onClick={() => window.history.back()}
              className="bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80"
            >
              Voltar ao Menu
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cynthia-cream">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${
                      step.completed
                        ? "bg-cynthia-green-dark border-cynthia-green-dark text-white"
                        : currentStep === step.number
                          ? "bg-cynthia-orange-pumpkin border-cynthia-orange-pumpkin text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {step.completed ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span
                  className={`
                    ml-2 text-sm font-medium
                    ${step.completed || currentStep === step.number ? "text-cynthia-green-dark" : "text-gray-400"}
                  `}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-8 h-0.5 mx-4
                      ${step.completed ? "bg-cynthia-green-dark" : "bg-gray-300"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <CepSearch
                address={state.deliveryAddress}
                onAddressChange={(field, value) => {
                  dispatch({
                    type: "SET_DELIVERY_ADDRESS",
                    payload: { ...state.deliveryAddress, [field]: value },
                  })
                }}
                onAddressComplete={handleAddressConfirmed}
              />
            )}

            {/* Step 2: Client */}
            {currentStep === 2 && endereco && <ClientForm onClientSaved={handleClientSaved} endereco={endereco} />}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card className="border-cynthia-yellow-mustard/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
                    <CreditCard className="w-5 h-5" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={paymentMethod === "pix" ? "default" : "outline"}
                      onClick={() => handlePaymentMethodSelect("pix")}
                      className={`
                        h-20 flex flex-col items-center justify-center gap-2
                        ${
                          paymentMethod === "pix"
                            ? "bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
                            : "border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white"
                        }
                      `}
                    >
                      <Image src="/icons/pix-logo.png" alt="PIX" width={24} height={24} />
                      <span>PIX</span>
                    </Button>

                    <Button
                      variant={paymentMethod === "dinheiro" ? "default" : "outline"}
                      onClick={() => handlePaymentMethodSelect("dinheiro")}
                      className={`
                        h-20 flex flex-col items-center justify-center gap-2
                        ${
                          paymentMethod === "dinheiro"
                            ? "bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
                            : "border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white"
                        }
                      `}
                    >
                      <span className="text-2xl">💵</span>
                      <span>Dinheiro</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Finish */}
            {currentStep === 4 && (
              <Card className="border-cynthia-yellow-mustard/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
                    <CheckCircle className="w-5 h-5" />
                    Finalizar Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        Todos os dados foram preenchidos! Revise seu pedido e finalize.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Endereço:</span>
                        <span className="font-medium">
                          {endereco?.logradouro}, {endereco?.bairro}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cliente:</span>
                        <span className="font-medium">ID: {clientId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pagamento:</span>
                        <span className="font-medium capitalize">{paymentMethod}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleFinishOrder}
                      className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-lg py-3"
                    >
                      Finalizar Pedido 🍲
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-cynthia-yellow-mustard/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
                  <ShoppingBag className="w-5 h-5" />
                  Seu Pedido ({state.items.length} {state.items.length === 1 ? "item" : "itens"})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.variation.tamanho_ml}`} className="flex gap-3 p-3 bg-white/60 rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imagem_url || "/placeholder.svg"}
                        alt={item.product.nome}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-cynthia-green-dark text-sm line-clamp-1">{item.product.nome}</h3>
                      <p className="text-xs text-gray-600">{item.variation.nome_tamanho}</p>
                      <p className="text-sm font-semibold text-cynthia-orange-pumpkin">{formatPrice(item.variation.preco_centavos)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product.id, item.variation.tamanho_ml, item.quantity - 1)}
                          className="h-6 w-6 p-0 border-cynthia-yellow-mustard"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product.id, item.variation.tamanho_ml, item.quantity + 1)}
                          className="h-6 w-6 p-0 border-cynthia-yellow-mustard"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.product.id, item.variation.tamanho_ml, 0)}
                          className="h-6 w-6 p-0 border-red-300 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator className="bg-cynthia-yellow-mustard/30" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <Separator className="bg-cynthia-yellow-mustard/30" />
                  <div className="flex justify-between font-bold text-lg text-cynthia-green-dark">
                    <span>Total:</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                </div>

                {getSubtotal() < 3000 && (
                  <Alert className="border-cynthia-orange-pumpkin/30 bg-cynthia-orange-pumpkin/10">
                                          <AlertDescription className="text-cynthia-green-dark text-sm">
                        Adicione mais {formatPrice(3000 - getSubtotal())} para ganhar frete grátis! 🚚
                      </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
