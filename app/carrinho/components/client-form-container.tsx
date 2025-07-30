"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, PartyPopper } from "lucide-react"
import { ClientForm } from "@/components/client-form"
import { searchClientByPhone, createClient } from "@/app/actions/cart-actions"
import type { ClientData } from "@/app/actions/cart-actions"

interface ClientFormContainerProps {
  onClientSaved: (clientId: string) => void
}

export function ClientFormContainer({ onClientSaved }: ClientFormContainerProps) {
  const [isPending, startTransition] = useTransition()
  const [clientData, setClientData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSearchClient = (telefone: string) => {
    startTransition(async () => {
      setError(null)
      setSuccess(null)

      const result = await searchClientByPhone(telefone)

      if (result.success && result.data) {
        setClientData(result.data)
        setSuccess(`Cliente encontrado! Prosseguindo com ${result.data.nome}...`)
        setTimeout(() => {
          onClientSaved(result.data.clienteId)
        }, 1500)
      } else {
        setSuccess("Cliente não encontrado. Preencha seus dados para continuar.")
      }
    })
  }

  const handleCreateClient = (data: ClientData) => {
    startTransition(async () => {
      setError(null)

      const result = await createClient(data)

      if (result.success) {
        setSuccess(`🎉 Perfeito ${data.nome}! Seus dados foram confirmados.`)
        setTimeout(() => {
          onClientSaved(result.data.clienteId)
        }, 2000)
      } else {
        setError(result.error || "Erro ao cadastrar cliente")
      }
    })
  }

  return (
    <Card className="border-cynthia-yellow-mustard/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
          <User className="w-5 h-5" />
          Dados do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-red-400 bg-red-50">
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-cynthia-green-leaf bg-cynthia-green-leaf/10">
            <PartyPopper className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-cynthia-green-dark font-medium">{success}</AlertDescription>
          </Alert>
        )}

        <ClientForm
          onSearchClient={handleSearchClient}
          onCreateClient={handleCreateClient}
          clientData={clientData}
          isLoading={isPending}
        />
      </CardContent>
    </Card>
  )
}
