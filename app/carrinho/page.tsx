"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, CreditCard, Banknote, Phone } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CepSearch } from "@/components/cep-search"
import { useCart } from "@/contexts/cart-context"
import type { PaymentMethod } from "@/types/product"
import { Footer } from "@/components/footer"
import { MobileNavbar } from "@/components/mobile-navbar"
import { useToast } from "@/contexts/toast-context"

export default function CarrinhoPage() {
  const { state, dispatch, getSubtotal, getTotal } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const { showToast } = useToast()

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toFixed(2).replace(".", ",")}`
  }

  const updateQuantity = (productId: number, variationSize: number, newQuantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, variationSize, quantity: newQuantity },
    })
  }

  const removeItem = (productId: number, variationSize: number) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { productId, variationSize },
    })
    showToast("Item removido do carrinho", "info")
  }

  const handleAddressChange = (field: string, value: string) => {
    dispatch({
      type: "SET_DELIVERY_ADDRESS",
      payload: { ...state.deliveryAddress, [field]: value },
    })
  }

  const handleAddressComplete = (address: any) => {
    dispatch({
      type: "SET_DELIVERY_ADDRESS",
      payload: address,
    })
  }

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    dispatch({
      type: "SET_PAYMENT_METHOD",
      payload: method,
    })
  }

  const handleFinalizePedido = async () => {
    if (!state.paymentMethod) {
      showToast("Selecione um método de pagamento", "error")
      return
    }

    if (!state.deliveryAddress.cep || !state.deliveryAddress.rua || !state.deliveryAddress.numero) {
      showToast("Preencha o endereço de entrega completo", "error")
      return
    }

    setIsProcessing(true)

    // Simula processamento do pedido com progresso
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    showToast("Pedido finalizado com sucesso!", "success")
    dispatch({ type: "CLEAR_CART" })
    setIsProcessing(false)
  }

  // Calcular progresso para frete grátis
  const freeShippingThreshold = 3000 // R$ 30,00
  const subtotal = getSubtotal()
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0)

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-cynthia-cream">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center border-cynthia-yellow-mustard/30 bg-white">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🛒</div>
              <h1 className="text-2xl font-bold mb-4 text-cynthia-green-dark">Seu carrinho está vazio</h1>
              <p className="text-gray-600 mb-6">Adicione alguns caldos deliciosos!</p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white"
              >
                Ver Cardápio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cynthia-cream">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Progresso para Frete Grátis */}
        {remainingForFreeShipping > 0 && (
          <Alert className="mb-6 border-cynthia-yellow-mustard bg-cynthia-yellow-mustard/10">
            <AlertDescription className="text-cynthia-green-dark">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  <strong>Frete grátis</strong> em pedidos acima de R$ 30,00
                </span>
                <Badge variant="outline" className="border-cynthia-orange-pumpkin text-cynthia-orange-pumpkin bg-white">
                  Faltam {formatPrice(remainingForFreeShipping)}
                </Badge>
              </div>
              <Progress value={progressToFreeShipping} className="h-2" />
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seus Pedidos */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-cynthia-yellow-mustard/30 bg-white">
              <CardHeader>
                <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
                  🛒 Seus Pedidos
                  <Badge className="bg-cynthia-yellow-mustard text-cynthia-green-dark">
                    {state.items.length} itens
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.variation.tamanho_ml}`}
                    className="flex items-center gap-4 p-4 border rounded-lg border-cynthia-yellow-mustard/30 bg-cynthia-cream/30"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.imagem_url || "/placeholder.svg?height=64&width=64&query=caldo"}
                        alt={item.product.nome}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-cynthia-green-dark">{item.product.nome}</h3>
                      <p className="text-sm text-gray-600">{item.variation.nome_tamanho}</p>
                      <Badge
                        variant="outline"
                        className="mt-1 border-cynthia-green-dark text-cynthia-green-dark bg-white"
                      >
                        {formatPrice(item.variation.preco_centavos)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.variation.tamanho_ml, item.quantity - 1)}
                        className="w-8 h-8 p-0 rounded-full bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80 text-white border-cynthia-orange-pumpkin"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Badge className="bg-cynthia-green-dark text-white px-3">{item.quantity}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.variation.tamanho_ml, item.quantity + 1)}
                        className="w-8 h-8 p-0 rounded-full bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80 text-white border-cynthia-orange-pumpkin"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-cynthia-orange-pumpkin">
                        {formatPrice(item.variation.preco_centavos * item.quantity)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product.id, item.variation.tamanho_ml)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Endereço de Entrega com CEP Search */}
            <Card className="border-cynthia-yellow-mustard/30 bg-white">
              <CardHeader>
                <CardTitle className="text-cynthia-green-dark">📍 Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <CepSearch
                  address={state.deliveryAddress}
                  onAddressChange={handleAddressChange}
                  onAddressComplete={handleAddressComplete}
                />
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card className="border-cynthia-yellow-mustard/30 bg-white">
              <CardHeader>
                <CardTitle className="text-cynthia-green-dark">💳 Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={state.paymentMethod || ""}
                  onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-cynthia-yellow-mustard/30 hover:bg-cynthia-yellow-mustard/10">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <Label
                      htmlFor="cartao"
                      className="flex items-center gap-2 cursor-pointer text-cynthia-green-dark font-medium"
                    >
                      <CreditCard className="w-4 h-4 text-cynthia-green-dark" />
                      Cartão de Crédito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-cynthia-yellow-mustard/30 hover:bg-cynthia-yellow-mustard/10">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label
                      htmlFor="pix"
                      className="flex items-center gap-2 cursor-pointer text-cynthia-green-dark font-medium"
                    >
                      <Image src="/icons/pix-logo.png" alt="PIX" width={16} height={16} className="w-6 h-6 object-contain" />
                      Pix
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-cynthia-yellow-mustard/30 hover:bg-cynthia-yellow-mustard/10">
                    <RadioGroupItem value="dinheiro" id="dinheiro" />
                    <Label
                      htmlFor="dinheiro"
                      className="flex items-center gap-2 cursor-pointer text-cynthia-green-dark font-medium"
                    >
                      <Banknote className="w-4 h-4 text-cynthia-green-dark" />
                      Dinheiro
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="border-cynthia-yellow-mustard/30 bg-white">
              <CardHeader>
                <CardTitle className="text-cynthia-green-dark">📋 Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-cynthia-green-dark font-medium">Subtotal</span>
                  <span className="font-semibold text-cynthia-green-dark">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cynthia-green-dark font-medium">Taxa de entrega</span>
                  <span
                    className={`font-medium ${remainingForFreeShipping === 0 ? "line-through text-gray-400" : "text-cynthia-green-dark"}`}
                  >
                    {formatPrice(state.deliveryFee)}
                  </span>
                </div>
                {remainingForFreeShipping === 0 && (
                  <div className="flex justify-between text-cynthia-green-leaf">
                    <span className="font-medium">Frete grátis! 🎉</span>
                    <span className="font-semibold">R$ 0,00</span>
                  </div>
                )}
                <Separator className="bg-cynthia-yellow-mustard/30" />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-cynthia-green-dark">Total</span>
                  <span className="text-cynthia-orange-pumpkin">
                    {formatPrice(remainingForFreeShipping === 0 ? getSubtotal() : getTotal())}
                  </span>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="text-sm text-cynthia-green-dark font-medium">Processando pedido...</div>
                    <Progress value={66} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={handleFinalizePedido}
                  disabled={!state.paymentMethod || isProcessing}
                  className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white font-medium"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Finalizar Pedido
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      <MobileNavbar />
    </div>
  )
}
