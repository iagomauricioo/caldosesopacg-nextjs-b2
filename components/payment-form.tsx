"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Smartphone, Banknote, Copy, CheckCircle, Clock, QrCode, Info, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface PaymentFormProps {
  clientData: {
    nome: string
    telefone: string
    cpf?: string
    endereco: {
      rua: string
      numero: string
      bairro: string
      cidade: string
      cep: string
      complemento?: string
    }
  }
  onPaymentSuccess: () => void
}

interface PixResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    id: string
    encodedImage: string
    payload: string
    allowsMultiplePayments: boolean
    expirationDate: string | null
    externalReference: string | null
  }
  timestamp: string
}

interface CreditCardResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    id: string
    name: string
    value: number
    active: boolean
    chargeType: string
    url: string
    billingType: string
    subscriptionCycle: null
    description: string
    endDate: null
    deleted: boolean
    viewCount: number
    maxInstallmentCount: number
    dueDateLimitDays: number
    notificationEnabled: boolean
    isAddressRequired: null
    externalReference: null
  }
  timestamp: string
}

export default function PaymentForm({ clientData, onPaymentSuccess }: PaymentFormProps) {
  const { state, getSubtotal, getTotal, dispatch } = useCart()
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "DINHEIRO">("PIX")
  const [changeFor, setChangeFor] = useState("")
  const [observations, setObservations] = useState("")
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<PixResponse["data"] | null>(null)
  const [pixCopied, setPixCopied] = useState(false)
  const [pixTimer, setPixTimer] = useState<number>(300) // 5 minutos em segundos

  // Temporizador do PIX
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (pixData && pixTimer > 0) {
      interval = setInterval(() => {
        setPixTimer((prev) => {
          if (prev <= 1) {
            // PIX expirou
            setPixData(null)
            toast({
              title: "PIX Expirado",
              description: "O código PIX expirou. Gere um novo código.",
              variant: "destructive",
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pixData, pixTimer, toast])

  const items = state.items
  const subtotal = getSubtotal()
  const totalWithDelivery = getTotal()
  const deliveryFee = state.deliveryFee
  const changeAmount = changeFor ? Number.parseFloat(changeFor) - totalWithDelivery / 100 : 0

  // Verificação de segurança para items
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-cynthia-green-dark/70">Nenhum item no carrinho</p>
      </div>
    )
  }

  const handleCreditCardPayment = async () => {
    console.log("💳 Criando link de pagamento com cartão...")
    console.log("💰 Valor:", Math.round(totalWithDelivery))
    console.log("👤 Cliente ID:", clientData.telefone.replace(/\D/g, ""))

    try {
      setLoading(true)

      const creditCardPayload = {
        billingType: "CREDIT_CARD",
        chargeType: "INSTALLMENT",
        name: "Caldos da Cynthia",
        description: "Venda de caldos",
        value: Math.round(totalWithDelivery) / 100,
        maxInstallmentCount: 1,
        notificationEnabled: false,
      }

      console.log("📦 Payload Cartão:", creditCardPayload)

      const response = await fetch("http://localhost:8080/api/v1/cobranca/cartao-de-credito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creditCardPayload),
      })

      console.log("📡 Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result: CreditCardResponse = await response.json()
      console.log("✅ Resposta completa da API:", result)

      if (result.success && result.data) {
        console.log("🎯 Link de cartão criado com sucesso!")
        console.log("🆔 ID do pagamento:", result.data.id)
        console.log("🔗 URL:", result.data.url)

        toast({
          title: "Link de Pagamento Gerado!",
          description: "Redirecionando para a página de pagamento...",
        })

        // Redirecionar para a URL do pagamento
        window.open(result.data.url, "_blank")

        // Aguardar um pouco antes de prosseguir
        setTimeout(() => {
          dispatch({ type: "CLEAR_CART" })
          onPaymentSuccess()
        }, 2000)
      } else {
        throw new Error(result.message || "Erro ao gerar link de pagamento")
      }
    } catch (error) {
      console.error("❌ Erro ao gerar link de cartão:", error)
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível gerar o link de pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePixPayment = async () => {
    console.log("🔥 Criando PIX estático...")
    console.log("💰 Valor:", Math.round(totalWithDelivery))
    console.log("👤 Cliente ID:", clientData.telefone.replace(/\D/g, ""))

    try {
      setLoading(true)

      const pixPayload = {
        description: "Pedido Caldos da Cynthia",
        value: Math.round(totalWithDelivery) / 100,
        expirationSeconds: 300, // 5 minutos
        externalReference: clientData.telefone.replace(/\D/g, ""),
      }

      console.log("📦 Payload PIX:", pixPayload)

      const response = await fetch("https://api.caldosesopacg.com/api/v1/cobranca/pix/qrCode/estatico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pixPayload),
      })

      console.log("📡 Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result: PixResponse = await response.json()
      console.log("✅ Resposta completa da API:", result)

      if (result.success && result.data) {
        setPixData(result.data)
        setPixTimer(300) // Reset timer para 5 minutos
        console.log("🎯 PIX criado com sucesso!")
        console.log("🆔 ID do PIX:", result.data.id)
        console.log("💳 Payload:", result.data.payload)

        toast({
          title: "PIX Gerado!",
          description: "Escaneie o QR Code ou copie o código PIX para pagar.",
        })
      } else {
        throw new Error(result.message || "Erro ao gerar PIX")
      }
    } catch (error) {
      console.error("❌ Erro ao gerar PIX:", error)
      toast({
        title: "Erro no PIX",
        description: "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMoneyPayment = async () => {
    console.log("💵 Processando pagamento em dinheiro...")
    try {
      setLoading(true)

      const orderData = {
        cliente: {
          nome: clientData.nome,
          telefone: clientData.telefone.replace(/\D/g, ""),
          cpf: clientData.cpf?.replace(/\D/g, "") || null,
        },
        endereco: clientData.endereco,
        itens: items.map((item) => ({
          produto_id: item.product.id,
          quantidade: item.quantity,
          preco_unitario_centavos: item.variation.preco_centavos,
          observacoes: null,
        })),
        subtotal_centavos: subtotal,
        taxa_entrega_centavos: deliveryFee,
        total_centavos: totalWithDelivery,
        forma_pagamento: paymentMethod,
        troco_para_centavos:
          paymentMethod === "DINHEIRO" && changeFor ? Math.round(Number.parseFloat(changeFor) * 100) : null,
        observacoes: observations || null,
        pagamento_id: null,
      }

      console.log("📦 Dados do pedido:", orderData)

      const response = await fetch("https://api.caldosesopacg.com/api/v1/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      console.log("📡 Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Pedido criado:", result)

      toast({
        title: "Pedido Enviado!",
        description: "Seu pedido foi recebido com sucesso.",
      })

      dispatch({ type: "CLEAR_CART" })
      onPaymentSuccess()
    } catch (error) {
      console.error("❌ Erro ao enviar pedido:", error)
      toast({
        title: "Erro no Pedido",
        description: "Não foi possível enviar o pedido. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOrder = async () => {
    console.log("🚀 Enviando pedido...")
    try {
      setLoading(true)

      if (paymentMethod === "PIX") {
        await handlePixPayment()
      } else if (paymentMethod === "CREDIT_CARD") {
        await handleCreditCardPayment()
      } else if (paymentMethod === "DINHEIRO") {
        await handleMoneyPayment()
      }
    } catch (error) {
      console.error("❌ Erro ao processar pagamento:", error)
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyPixCode = async () => {
    if (pixData?.payload) {
      try {
        await navigator.clipboard.writeText(pixData.payload)
        setPixCopied(true)
        toast({
          title: "Código Copiado!",
          description: "Cole no seu app de pagamentos.",
        })
        setTimeout(() => setPixCopied(false), 3000)
      } catch (error) {
        console.error("Erro ao copiar:", error)
        toast({
          title: "Erro ao Copiar",
          description: "Não foi possível copiar o código.",
          variant: "destructive",
        })
      }
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Pedido */}
      <Card className="border-cynthia-green-dark/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cynthia-cream to-cynthia-yellow-mustard/20">
          <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Resumo do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-white">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.variation.tamanho_ml}`}
              className="flex justify-between items-center p-3 rounded-lg bg-cynthia-cream/30 border border-cynthia-green-dark/10"
            >
              <div>
                <p className="font-medium text-cynthia-green-dark">{item.product.nome}</p>
                <p className="text-sm text-cynthia-green-dark/70">
                  {item.quantity}x{" "}
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                    item.variation.preco_centavos / 100,
                  )}
                </p>
              </div>
              <p className="font-semibold text-cynthia-green-dark">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  (item.variation.preco_centavos * item.quantity) / 100,
                )}
              </p>
            </div>
          ))}

          <Separator className="bg-cynthia-green-dark/20" />

          <div className="space-y-2 p-4 bg-cynthia-cream/20 rounded-lg">
            <div className="flex justify-between text-cynthia-green-dark">
              <span>Subtotal:</span>
              <span>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal / 100)}
              </span>
            </div>
            <div className="flex justify-between text-cynthia-green-dark">
              <span>Taxa de Entrega:</span>
              <span className={deliveryFee === 0 ? "text-cynthia-green-leaf font-semibold" : ""}>
                {deliveryFee === 0
                  ? "Grátis"
                  : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(deliveryFee / 100)}
              </span>
            </div>
            <Separator className="bg-cynthia-green-dark/20" />
            <div className="flex justify-between text-lg font-bold text-cynthia-green-dark">
              <span>Total:</span>
              <span className="text-cynthia-orange-pumpkin">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalWithDelivery / 100)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forma de Pagamento */}
      <Card className="border-cynthia-green-dark/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cynthia-cream to-cynthia-yellow-mustard/20">
          <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Forma de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-white">
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
            <div
              className={`flex items-center space-x-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                paymentMethod === "PIX"
                  ? "border-cynthia-green-leaf bg-cynthia-green-leaf/10 shadow-md"
                  : "border-cynthia-green-dark/20 hover:bg-cynthia-cream/30 hover:border-cynthia-green-dark/40"
              }`}
            >
              <RadioGroupItem value="PIX" id="pix" className="border-cynthia-green-dark text-cynthia-green-leaf" />
              <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 rounded-full bg-cynthia-green-leaf/20">
                  <Smartphone className="w-5 h-5 text-cynthia-green-leaf" />
                </div>
                <div>
                  <p className="font-semibold text-cynthia-green-dark">PIX</p>
                  <p className="text-sm text-cynthia-green-dark/70">Pagamento instantâneo</p>
                </div>
              </Label>
              <Badge className="bg-cynthia-green-leaf text-white hover:bg-cynthia-green-leaf/90">Recomendado</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-cynthia-cream/50 transition-colors">
              <RadioGroupItem
                value="CREDIT_CARD"
                id="card"
                className="border-cynthia-green-dark text-cynthia-green-dark"
              />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="w-5 h-5 text-cynthia-green-dark" />
                <div>
                  <p className="font-medium text-cynthia-green-dark">Cartão de Crédito</p>
                  <p className="text-sm text-muted-foreground">Pagamento seguro</p>
                </div>
              </Label>
            </div>

            <div
              className={`flex items-center space-x-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                paymentMethod === "DINHEIRO"
                  ? "border-cynthia-yellow-mustard bg-cynthia-yellow-mustard/10 shadow-md"
                  : "border-cynthia-green-dark/20 hover:bg-cynthia-cream/30 hover:border-cynthia-green-dark/40"
              }`}
            >
              <RadioGroupItem
                value="DINHEIRO"
                id="money"
                className="border-cynthia-green-dark text-cynthia-yellow-mustard"
              />
              <Label htmlFor="money" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 rounded-full bg-cynthia-yellow-mustard/20">
                  <Banknote className="w-5 h-5 text-cynthia-yellow-mustard" />
                </div>
                <div>
                  <p className="font-semibold text-cynthia-green-dark">Dinheiro</p>
                  <p className="text-sm text-cynthia-green-dark/70">Pagamento na entrega</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "DINHEIRO" && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-cynthia-yellow-mustard/10 to-cynthia-cream/50 rounded-lg border-2 border-cynthia-yellow-mustard/30">
              <Label htmlFor="change" className="text-cynthia-green-dark font-semibold flex items-center gap-2">
                <Banknote className="w-4 h-4" />
                Troco para quanto?
              </Label>
              <Input
                id="change"
                type="number"
                step="0.01"
                placeholder="Ex: 50.00"
                value={changeFor}
                onChange={(e) => setChangeFor(e.target.value)}
                className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark bg-white"
              />
              {changeFor && changeAmount > 0 && (
                <div className="p-3 bg-cynthia-green-leaf/10 rounded-lg border border-cynthia-green-leaf/30">
                  <p className="text-sm text-cynthia-green-dark font-medium">
                    <strong>Troco:</strong>{" "}
                    <span className="text-cynthia-green-leaf">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(changeAmount)}
                    </span>
                  </p>
                </div>
              )}
              {changeFor && changeAmount < 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600 font-medium">
                    Valor insuficiente. Mínimo:{" "}
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      totalWithDelivery / 100,
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PIX QR Code */}
      {paymentMethod === "PIX" && pixData && (
        <Card className="border-cynthia-green-leaf/40 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cynthia-green-leaf/10 to-cynthia-cream/50">
            <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
              <QrCode className="w-5 h-5 text-cynthia-green-leaf" />
              Pagamento PIX
            </CardTitle>
            <CardDescription className="text-cynthia-green-dark/70">
              Escaneie o QR Code ou copie o código PIX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 bg-white">
            <Alert className="border-cynthia-green-leaf/40 bg-gradient-to-r from-cynthia-green-leaf/5 to-cynthia-cream/30">
              <Info className="h-4 w-4 text-cynthia-green-leaf" />
              <AlertDescription className="text-cynthia-green-dark">
                <div className="space-y-1">
                  <p>
                    <strong>PIX ID:</strong> <span className="font-mono text-sm">{pixData.id}</span>
                  </p>
                  <p>
                    <strong>Valor:</strong>{" "}
                    <span className="text-cynthia-orange-pumpkin font-semibold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        Math.round(totalWithDelivery) / 100,
                      )}
                    </span>
                  </p>
                  <p>
                    <strong>Referência:</strong> {pixData.externalReference}
                  </p>
                  <p>
                    <strong>Expira em:</strong>{" "}
                    <span
                      className={`font-semibold ${pixTimer <= 60 ? "text-red-500" : "text-cynthia-orange-pumpkin"}`}
                    >
                      {formatTime(pixTimer)}
                    </span>
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  pixTimer <= 60 ? "bg-red-500" : pixTimer <= 120 ? "bg-yellow-500" : "bg-cynthia-green-leaf"
                }`}
                style={{ width: `${(pixTimer / 300) * 100}%` }}
              />
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="p-6 bg-white rounded-xl border-4 border-cynthia-green-dark/20 shadow-lg">
                <Image
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>

              <div className="w-full space-y-2">
                <Label className="text-cynthia-green-dark font-semibold">Código PIX (Copia e Cola)</Label>
                <div className="flex gap-2">
                  <Input
                    value={pixData.payload}
                    readOnly
                    className="font-mono text-xs border-cynthia-green-dark/30 bg-cynthia-cream/20"
                  />
                  <Button
                    onClick={copyPixCode}
                    variant="outline"
                    size="icon"
                    className={`border-2 transition-all duration-200 ${
                      pixCopied
                        ? "bg-cynthia-green-leaf text-white border-cynthia-green-leaf hover:bg-cynthia-green-leaf/90"
                        : "border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white"
                    }`}
                  >
                    {pixCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      <Card className="border-cynthia-green-dark/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cynthia-cream to-cynthia-yellow-mustard/20">
          <CardTitle className="text-cynthia-green-dark">Observações (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <Textarea
            placeholder="Alguma observação especial para seu pedido?"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="border-cynthia-green-dark/30 focus:border-cynthia-green-dark bg-cynthia-cream/10 min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="space-y-3">
        {paymentMethod === "PIX" && !pixData && (
          <Button
            onClick={handlePixPayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cynthia-green-dark to-cynthia-green-leaf hover:from-cynthia-green-dark/90 hover:to-cynthia-green-leaf/90 text-white shadow-lg transition-all duration-200"
            size="lg"
          >
            {loading ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 mr-2" />
                Gerar PIX
              </>
            )}
          </Button>
        )}

        {(paymentMethod !== "PIX" || pixData) && (
          <Button
            onClick={handleSubmitOrder}
            disabled={loading || (paymentMethod === "DINHEIRO" && changeAmount < 0)}
            className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : paymentMethod === "PIX" ? (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Gerar PIX
              </>
            ) : paymentMethod === "CREDIT_CARD" ? (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar com Cartão
              </>
            ) : (
              <>
                <Banknote className="w-4 h-4 mr-2" />
                Finalizar Pedido
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
