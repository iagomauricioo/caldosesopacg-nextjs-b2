"use client"

import { useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { ClientForm } from "@/components/client-form"

interface ClientFormContainerProps {
  onComplete: (clientId: string) => void
}

export function ClientFormContainer({ onComplete }: ClientFormContainerProps) {
  const [isPending, startTransition] = useTransition()

  const handleClientSubmit = (clientData: any) => {
    startTransition(() => {
      // Simular salvamento do cliente
      const clientId = `client_${Date.now()}`
      onComplete(clientId)
    })
  }

  return (
    <Card className="border-cynthia-green-dark/20">
      <CardHeader className="bg-cynthia-cream">
        <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
          <User className="w-5 h-5" />
          Dados para Entrega
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm onSubmit={handleClientSubmit} isLoading={isPending} />
      </CardContent>
    </Card>
  )
}
