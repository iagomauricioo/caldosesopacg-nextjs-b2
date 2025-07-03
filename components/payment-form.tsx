"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface PaymentFormProps {
  clientId: string
  totalAmount: number
  onPaymentComplete: () => void
}

type PaymentMethod = "PIX" | "CREDIT_CARD" | "CASH"

interface AsaasCustomer {
  id: string
  name: string
  externalReference: string
}

interface PaymentData {
  id: string
  status: string
  value: number
  billingType: string
  invoiceUrl?: string
  dueDate: string
}

interface PixData {
  encodedImage: string
  payload: string
  expirationDate: string
}

export function PaymentForm({ clientId, totalAmount, onPaymentComplete }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("PIX")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [cashChange, setCashChange] = useState("")
  const [asaasCustomer, setAsaasCustomer] = useState<AsaasCustomer | null>(null)
  const { toast } = useToast()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getAsaasCustomer = async (): Promise<AsaasCustomer | null> => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/clientes/asaas/${clientId}`)

      if (!response.ok) {
        throw new Error("Cliente não encontrado no sistema de pagamento")
      }

      const result = await response.json()

      if (result.success && result.data && result.data.length > 0) {
        return {
          id: result.data[0].id,
          name: result.data[0].name,
          externalReference: result.data[0].externalReference,
        }
      }

      throw new Error("Dados do cliente inválidos")
    } catch (err) {
      console.error("Erro ao buscar cliente Asaas:", err)
      throw err
    }
  }

  const createPayment = async (billingType: PaymentMethod) => {
    try {
      // Primeiro, buscar o cliente no Asaas
      const customer = await getAsaasCustomer()
      setAsaasCustomer(customer)

      const paymentPayload = {
        billingType,
        customer: customer.id,
        value: totalAmount,
        dueDate: new Date().toISOString().split("T")[0], // Data atual
      }

      const response = await fetch("http://localhost:8080/api/v1/cobranca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar cobrança")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Erro ao processar pagamento")
      }

      return result.data
    } catch (err) {
      console.error("Erro ao criar pagamento:", err)
      throw err
    }
  }

  const getPixQRCode = async (paymentId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/cobranca/${paymentId}/qrcode`)

      if (!response.ok) {
        throw new Error("Erro ao gerar QR Code PIX")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Erro ao gerar QR Code")
      }

      return result.data
    } catch (err) {
      console.error("Erro ao buscar QR Code:", err)
      throw err
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      if (selectedMethod === "CASH") {
        // Para dinheiro, não precisa de integração com API
        setPaymentData({
          id: "cash_" + Date.now(),
          status: "CONFIRMED",
          value: totalAmount,
          billingType: "CASH",
          dueDate: new Date().toISOString().split("T")[0],
        })

        toast({
          title: "Pagamento confirmado!",
          description: "Pagamento em dinheiro registrado com sucesso.",
        })

        setTimeout(() => {
          onPaymentComplete()
        }, 2000)

        return
      }

      // Para PIX e Cartão de Crédito
      const payment = await createPayment(selectedMethod)
      setPaymentData(payment)

      if (selectedMethod === "PIX") {
        // Buscar QR Code para PIX
        const qrCode = await getPixQRCode(payment.id)
        setPixData(qrCode)

        toast({
          title: "PIX gerado!",
          description: "Escaneie o QR Code ou copie o código PIX para pagar.",
        })
      } else if (selectedMethod === "CREDIT_CARD") {
        // Para cartão, abrir URL em nova aba
        if (payment.invoiceUrl) {
          window.open(payment.invoiceUrl, "_blank")

          toast({
            title: "Redirecionando...",
            description: "Você será redirecionado para finalizar o pagamento.",
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar pagamento")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyPixCode = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload)
      toast({
        title: "Código copiado!",
        description: "Código PIX copiado para a área de transferência.",
      })
    }
  }

  const handleConfirmPayment = () => {
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pedido foi processado com sucesso.",
    })
    onPaymentComplete()
  }

  return (
    <Card className="border-cynthia-yellow-mustard/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
          <CreditCard className="w-5 h-5" />
          Forma de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo do Valor */}
        <div className="p-4 bg-cynthia-cream/20 rounded-lg border border-cynthia-yellow-mustard/30">
          <div className="flex justify-between items-center">
            <span className="text-cynthia-green-dark font-medium">Total a pagar:</span>
            <span className="text-2xl font-bold text-cynthia-green-dark">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Mensagens de Status */}
        {error && (
          <Alert className="border-red-400 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Seleção de Método de Pagamento */}
        {!paymentData && (
          <div className="space-y-4">
            <Label className="text-base font-semibold text-cynthia-green-dark">Escolha a forma de pagamento:</Label>

            <RadioGroup
              value={selectedMethod}
              onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border border-cynthia-yellow-mustard/30 rounded-lg hover:bg-cynthia-cream/10">
                <RadioGroupItem value="PIX" id="pix" />
                <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                  <QrCode className="w-5 h-5 text-cynthia-green-dark" />
                  <div>
                    <div className="font-medium text-cynthia-green-dark">PIX</div>
                    <div className="text-sm text-gray-600">Pagamento instantâneo</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border border-cynthia-yellow-mustard/30 rounded-lg hover:bg-cynthia-cream/10">
                <RadioGroupItem value="CREDIT_CARD" id="credit" />
                <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5 text-cynthia-green-dark" />
                  <div>
                    <div className="font-medium text-cynthia-green-dark">Cartão de Crédito</div>
                    <div className="text-sm text-gray-600">Pagamento online seguro</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border border-cynthia-yellow-mustard/30 rounded-lg hover:bg-cynthia-cream/10">
                <RadioGroupItem value="CASH" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Banknote className="w-5 h-5 text-cynthia-green-dark" />
                  <div>
                    <div className="font-medium text-cynthia-green-dark">Dinheiro</div>
                    <div className="text-sm text-gray-600">Pagamento na entrega</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {/* Campo de Troco para Dinheiro */}
            {selectedMethod === "CASH" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Label htmlFor="change" className="text-sm font-medium text-gray-700">
                  Precisa de troco? (Opcional)
                </Label>
                <Input
                  id="change"
                  type="number"
                  placeholder="Ex: 50.00"
                  value={cashChange}
                  onChange={(e) => setCashChange(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Informe o valor em dinheiro que você tem para facilitar o troco
                </p>
              </div>
            )}

            {/* Botão de Processar Pagamento */}
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Pagamento
                </>
              )}
            </Button>
          </div>
        )}

        {/* Exibição do PIX */}
        {paymentData && selectedMethod === "PIX" && pixData && (
          <div className="space-y-4">
            <Alert className="border-cynthia-green-leaf bg-cynthia-green-leaf/10">
              <QrCode className="h-4 w-4 text-cynthia-green-leaf" />
              <AlertDescription className="text-cynthia-green-dark font-medium">
                PIX gerado com sucesso! Escaneie o QR Code ou copie o código para pagar.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-cynthia-yellow-mustard/30 inline-block">
                <Image
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code PIX"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-cynthia-green-dark">Ou copie o código PIX:</Label>
                <div className="flex gap-2">
                  <Input value={pixData.payload} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPixCode}
                    className="border-cynthia-yellow-mustard/50 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Válido até: {new Date(pixData.expirationDate).toLocaleString("pt-BR")}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmPayment}
              className="w-full bg-cynthia-green-leaf hover:bg-cynthia-green-leaf/80"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar Pagamento Realizado
            </Button>
          </div>
        )}

        {/* Exibição do Cartão de Crédito */}
        {paymentData && selectedMethod === "CREDIT_CARD" && (
          <div className="space-y-4">
            <Alert className="border-blue-400 bg-blue-50">
              <ExternalLink className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 font-medium">
                Redirecionando para o pagamento seguro...
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <p className="text-cynthia-green-dark">
                Uma nova aba foi aberta para você finalizar o pagamento com cartão de crédito.
              </p>

              {paymentData.invoiceUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(paymentData.invoiceUrl, "_blank")}
                  className="border-cynthia-yellow-mustard/50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Pagamento Novamente
                </Button>
              )}
            </div>

            <Button
              onClick={handleConfirmPayment}
              className="w-full bg-cynthia-green-leaf hover:bg-cynthia-green-leaf/80"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar Pagamento Realizado
            </Button>
          </div>
        )}

        {/* Exibição do Dinheiro */}
        {paymentData && selectedMethod === "CASH" && (
          <div className="space-y-4">
            <Alert className="border-green-400 bg-green-50">
              <Banknote className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                Pagamento em dinheiro confirmado! Tenha o valor exato ou o troco será calculado na entrega.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-cynthia-cream/20 rounded-lg border border-cynthia-yellow-mustard/30">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total do pedido:</span>
                  <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
                {cashChange && Number.parseFloat(cashChange) > totalAmount && (
                  <div className="flex justify-between text-cynthia-green-dark">
                    <span>Troco para:</span>
                    <span className="font-semibold">{formatCurrency(Number.parseFloat(cashChange))}</span>
                  </div>
                )}
                {cashChange && Number.parseFloat(cashChange) > totalAmount && <Separator />}
                {cashChange && Number.parseFloat(cashChange) > totalAmount && (
                  <div className="flex justify-between text-lg font-bold text-cynthia-green-dark">
                    <span>Troco:</span>
                    <span>{formatCurrency(Number.parseFloat(cashChange) - totalAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
