"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Smartphone, Banknote, Copy, Check, QrCode } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface PaymentFormProps {
  clientData: {
    id: string
    nome: string
    telefone: string
    endereco?: {
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [pixData, setPixData] = useState<PixResponse["data"] | null>(null)
  const [copied, setCopied] = useState(false)

  const finalTotal = total + deliveryFee

  const handlePixPayment = async () => {
    console.log("🔥 Criando PIX estático...")
    console.log("💰 Valor:", finalTotal)
    console.log("👤 Cliente ID:", clientData.id)

    try {
      setIsProcessing(true)

      const pixPayload = {
        description: `Pedido Caldos da Cynthia - ${items.length} item(s)`,
        value: finalTotal,
        expirationSeconds: 300, // 5 minutos
        externalReference: clientData.id,
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

      const data: PixResponse = await response.json()
      console.log("✅ Resposta completa da API:", data)

      if (data.success && data.data) {
        setPixData(data.data)
        console.log("🎯 PIX criado com sucesso!")
        console.log("🆔 ID do PIX:", data.data.id)
        console.log("💳 Payload:", data.data.payload)

        toast({
          title: "PIX Gerado!",
          description: "Escaneie o QR Code ou copie o código PIX para pagar.",
        })
      } else {
        throw new Error(data.message || "Erro ao gerar PIX")
      }
    } catch (error) {
      console.error("❌ Erro ao gerar PIX:", error)
      toast({
        title: "Erro no PIX",
        description: "Não foi possível gerar o código PIX. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "PIX") {
      await handlePixPayment()
      return
    }

    // Para outros métodos de pagamento, criar o pedido diretamente
    try {
      setIsProcessing(true)

      const orderData = {
        cliente_id: clientData.id,
        items: items.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantity,
          preco_unitario_centavos: Math.round(item.price * 100),
        })),
        subtotal_centavos: Math.round(total * 100),
        taxa_entrega_centavos: Math.round(deliveryFee * 100),
        total_centavos: Math.round(finalTotal * 100),
        forma_pagamento: paymentMethod,
        troco_para_centavos:
          paymentMethod === "DINHEIRO" && changeFor ? Math.round(Number.parseFloat(changeFor) * 100) : null,
        observacoes: null,
      }

      console.log("📝 Criando pedido:", orderData)

      const response = await fetch("https://api.caldosesopacg.com/api/v1/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Pedido criado:", result)

      toast({
        title: "Pedido Realizado!",
        description: `Seu pedido foi recebido e será preparado em breve.`,
      })

      clearCart()
      onPaymentSuccess()
    } catch (error) {
      console.error("❌ Erro ao criar pedido:", error)
      toast({
        title: "Erro no Pedido",
        description: "Não foi possível processar seu pedido. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const copyPixCode = async () => {
    if (pixData?.payload) {
      try {
        await navigator.clipboard.writeText(pixData.payload)
        setCopied(true)
        toast({
          title: "Código Copiado!",
          description: "Cole no seu app do banco para pagar.",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Erro ao copiar:", error)
      }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground ml-2">x{item.quantity}</span>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="flex justify-between">
            <span>Taxa de Entrega</span>
            <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : "Grátis"}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Dados de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Nome:</strong> {clientData.nome}
            </p>
            <p>
              <strong>Telefone:</strong> {clientData.telefone}
            </p>
            {clientData.endereco && (
              <div>
                <strong>Endereço:</strong>
                <p className="text-sm text-muted-foreground">
                  {clientData.endereco.rua}, {clientData.endereco.numero}
                  {clientData.endereco.complemento && ` - ${clientData.endereco.complemento}`}
                  <br />
                  {clientData.endereco.bairro}, {clientData.endereco.cidade}
                  <br />
                  CEP: {clientData.endereco.cep}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PIX Gerado */}
      {pixData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              PIX Gerado
            </CardTitle>
            <CardDescription>Escaneie o QR Code ou copie o código PIX para pagar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg border">
                <Image
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>

              {/* Informações do PIX */}
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID do PIX:</span>
                  <span className="font-mono">{pixData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-bold">{formatCurrency(finalTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Referência:</span>
                  <span className="font-mono text-xs">{pixData.externalReference}</span>
                </div>
              </div>

              {/* Código PIX */}
              <div className="w-full">
                <Label htmlFor="pix-code">Código PIX</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="pix-code" value={pixData.payload} readOnly className="font-mono text-xs" />
                  <Button type="button" variant="outline" size="icon" onClick={copyPixCode} disabled={copied}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  ⏰ Este PIX expira em 5 minutos. Após o pagamento, seu pedido será confirmado automaticamente.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Pagamento */}
      {!pixData && (
        <Card>
          <CardHeader>
            <CardTitle>Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PIX" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="h-4 w-4" />
                    PIX
                    <Badge variant="secondary">Instantâneo</Badge>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 opacity-50">
                  <RadioGroupItem value="CREDIT_CARD" id="credit" disabled />
                  <Label htmlFor="credit" className="flex items-center gap-2 cursor-not-allowed">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Crédito
                    <Badge variant="outline">Em breve</Badge>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DINHEIRO" id="money" />
                  <Label htmlFor="money" className="flex items-center gap-2 cursor-pointer">
                    <Banknote className="h-4 w-4" />
                    Dinheiro
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "DINHEIRO" && (
                <div className="space-y-2">
                  <Label htmlFor="change">Troco para quanto? (opcional)</Label>
                  <Input
                    id="change"
                    type="number"
                    step="0.01"
                    min={finalTotal}
                    placeholder={`Mínimo: ${formatCurrency(finalTotal)}`}
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                  />
                  {changeFor && Number.parseFloat(changeFor) > finalTotal && (
                    <p className="text-sm text-muted-foreground">
                      Troco: {formatCurrency(Number.parseFloat(changeFor) - finalTotal)}
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isProcessing} size="lg">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {paymentMethod === "PIX" && "Gerar PIX"}
                    {paymentMethod === "CREDIT_CARD" && "Pagar com Cartão"}
                    {paymentMethod === "DINHEIRO" && "Finalizar Pedido"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
