"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Smartphone, Banknote, Copy, CheckCircle, Clock, QrCode, Info } from "lucide-react"
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

export default function PaymentForm({ clientData, onPaymentSuccess }: PaymentFormProps) {
  const { items, total, deliveryFee, clearCart } = useCart()
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "DINHEIRO">("PIX")
  const [changeFor, setChangeFor] = useState("")
  const [observations, setObservations] = useState("")
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<PixResponse["data"] | null>(null)
  const [pixCopied, setPixCopied] = useState(false)

  const subtotal = total
  const totalWithDelivery = subtotal + deliveryFee
  const changeAmount = changeFor ? Number.parseFloat(changeFor) - totalWithDelivery / 100 : 0

  const handlePixPayment = async () => {
    console.log("🔥 Criando PIX estático...")
    console.log("💰 Valor:", Math.round(totalWithDelivery))
    console.log("👤 Cliente ID:", clientData.telefone.replace(/\D/g, ""))

    try {
      setLoading(true)

      const pixPayload = {
        description: "Pedido Caldos da Cynthia",
        value: Math.round(totalWithDelivery),
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

  const handleSubmitOrder = async () => {
    console.log("🚀 Enviando pedido...")
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
          produto_id: item.id,
          quantidade: item.quantity,
          preco_unitario_centavos: item.price,
          observacoes: item.observations || null,
        })),
        subtotal_centavos: subtotal,
        taxa_entrega_centavos: deliveryFee,
        total_centavos: totalWithDelivery,
        forma_pagamento: paymentMethod,
        troco_para_centavos:
          paymentMethod === "DINHEIRO" && changeFor ? Math.round(Number.parseFloat(changeFor) * 100) : null,
        observacoes: observations || null,
        pagamento_id: pixData?.id || null,
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

      clearCart()
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

  return (
    <div className="space-y-6">
      {/* Resumo do Pedido */}
      <Card className="border-cynthia-green-dark/20">
        <CardHeader className="bg-cynthia-cream">
          <CardTitle className="text-cynthia-green-dark">Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-cynthia-green-dark">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity}x{" "}
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.price / 100)}
                </p>
                {item.observations && <p className="text-xs text-cynthia-orange-pumpkin">Obs: {item.observations}</p>}
              </div>
              <p className="font-semibold text-cynthia-green-dark">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  (item.price * item.quantity) / 100,
                )}
              </p>
            </div>
          ))}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal / 100)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Entrega:</span>
              <span className={deliveryFee === 0 ? "text-cynthia-green-leaf font-semibold" : ""}>
                {deliveryFee === 0
                  ? "Grátis"
                  : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(deliveryFee / 100)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-cynthia-green-dark">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalWithDelivery / 100)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forma de Pagamento */}
      <Card className="border-cynthia-green-dark/20">
        <CardHeader className="bg-cynthia-cream">
          <CardTitle className="text-cynthia-green-dark">Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-cynthia-cream/50 transition-colors">
              <RadioGroupItem value="PIX" id="pix" className="border-cynthia-green-dark text-cynthia-green-dark" />
              <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                <Smartphone className="w-5 h-5 text-cynthia-green-leaf" />
                <div>
                  <p className="font-medium text-cynthia-green-dark">PIX</p>
                  <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                </div>
              </Label>
              <Badge className="bg-cynthia-green-leaf text-white">Recomendado</Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-cynthia-cream/50 transition-colors opacity-50">
              <RadioGroupItem value="CREDIT_CARD" id="card" disabled className="border-gray-400" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-not-allowed flex-1">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-400">Cartão de Crédito</p>
                  <p className="text-sm text-gray-400">Em breve</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-cynthia-cream/50 transition-colors">
              <RadioGroupItem
                value="DINHEIRO"
                id="money"
                className="border-cynthia-green-dark text-cynthia-green-dark"
              />
              <Label htmlFor="money" className="flex items-center gap-2 cursor-pointer flex-1">
                <Banknote className="w-5 h-5 text-cynthia-yellow-mustard" />
                <div>
                  <p className="font-medium text-cynthia-green-dark">Dinheiro</p>
                  <p className="text-sm text-muted-foreground">Pagamento na entrega</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "DINHEIRO" && (
            <div className="space-y-2 p-4 bg-cynthia-yellow-mustard/10 rounded-lg border border-cynthia-yellow-mustard/20">
              <Label htmlFor="change" className="text-cynthia-green-dark font-medium">
                Troco para quanto?
              </Label>
              <Input
                id="change"
                type="number"
                step="0.01"
                placeholder="Ex: 50.00"
                value={changeFor}
                onChange={(e) => setChangeFor(e.target.value)}
                className="border-cynthia-yellow-mustard/30 focus:border-cynthia-green-dark"
              />
              {changeFor && changeAmount > 0 && (
                <p className="text-sm text-cynthia-green-dark">
                  <strong>Troco:</strong>{" "}
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(changeAmount)}
                </p>
              )}
              {changeFor && changeAmount < 0 && (
                <p className="text-sm text-red-600">
                  Valor insuficiente. Mínimo:{" "}
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                    totalWithDelivery / 100,
                  )}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PIX QR Code */}
      {paymentMethod === "PIX" && pixData && (
        <Card className="border-cynthia-green-leaf/30">
          <CardHeader className="bg-cynthia-green-leaf/10">
            <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
              <QrCode className="w-5 h-5" />
              Pagamento PIX
            </CardTitle>
            <CardDescription>Escaneie o QR Code ou copie o código PIX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-cynthia-green-leaf/30 bg-cynthia-green-leaf/5">
              <Info className="h-4 w-4 text-cynthia-green-leaf" />
              <AlertDescription className="text-cynthia-green-dark">
                <strong>PIX ID:</strong> {pixData.id}
                <br />
                <strong>Valor:</strong>{" "}
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  Math.round(totalWithDelivery) / 100,
                )}
                <br />
                <strong>Referência:</strong> {pixData.externalReference}
                <br />
                <strong>Expira em:</strong> 5 minutos
              </AlertDescription>
            </Alert>

            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg border-2 border-cynthia-green-dark/20">
                <Image
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>

              <div className="w-full space-y-2">
                <Label className="text-cynthia-green-dark font-medium">Código PIX (Copia e Cola)</Label>
                <div className="flex gap-2">
                  <Input value={pixData.payload} readOnly className="font-mono text-xs border-cynthia-green-dark/30" />
                  <Button
                    onClick={copyPixCode}
                    variant="outline"
                    size="icon"
                    className={`border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white ${
                      pixCopied ? "bg-cynthia-green-leaf text-white" : ""
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
      <Card className="border-cynthia-green-dark/20">
        <CardHeader className="bg-cynthia-cream">
          <CardTitle className="text-cynthia-green-dark">Observações (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Alguma observação especial para seu pedido?"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="border-cynthia-green-dark/30 focus:border-cynthia-green-dark"
          />
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="space-y-3">
        {paymentMethod === "PIX" && !pixData && (
          <Button
            onClick={handlePixPayment}
            disabled={loading}
            className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white"
            size="lg"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Gerar PIX
              </>
            )}
          </Button>
        )}

        {(paymentMethod !== "PIX" || pixData) && (
          <Button
            onClick={handleSubmitOrder}
            disabled={loading || (paymentMethod === "DINHEIRO" && changeAmount < 0)}
            className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white"
            size="lg"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Enviando Pedido...
              </>
            ) : (
              "Finalizar Pedido"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
