"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, MapPin, User } from "lucide-react"

export function CheckoutFlow() {
  const [step, setStep] = useState<"info" | "payment" | "confirmation">("info")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-cynthia-green-dark">Finalizar Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "info" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Informações pessoais</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Endereço de entrega</span>
            </div>
            <Button
              className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
              onClick={() => setStep("payment")}
            >
              Continuar para Pagamento
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Método de pagamento</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                PIX
              </Button>
              <Button variant="outline" size="sm">
                Cartão
              </Button>
            </div>
            <Button
              className="w-full bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80"
              onClick={() => setStep("confirmation")}
            >
              Finalizar Pedido
            </Button>
          </div>
        )}

        {step === "confirmation" && (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-4xl">✅</div>
            <h3 className="font-bold text-cynthia-green-dark">Pedido Confirmado!</h3>
            <p className="text-sm text-gray-600">Seu pedido foi recebido e está sendo preparado.</p>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep("info")}>
              Fazer Novo Pedido
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
