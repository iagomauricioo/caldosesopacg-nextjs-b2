"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, MapPin } from "lucide-react"
import type { ClientFormData, ClientResponse } from "@/types/client"

interface ClientFormProps {
  onClientSaved: (clientId: string) => void
  endereco: any // Vem do CEP search
}

export function ClientForm({ onClientSaved, endereco }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    nome: "",
    cpf: "",
    telefone: "",
    endereco: {
      rua: endereco?.logradouro || "",
      complemento: "",
      numero: "",
      bairro: endereco?.bairro || "",
      pontoReferencia: "",
      cep: endereco?.cep || "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value)
    } else if (field === "telefone") {
      value = formatPhone(value)
    } else if (field === "endereco.cep") {
      value = formatCEP(value)
    }

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const checkExistingClient = async (telefone: string): Promise<string | null> => {
    try {
      const cleanPhone = telefone.replace(/\D/g, "")
      const response = await fetch(`http://localhost:8080/api/v1/clientes/${cleanPhone}`)

      if (response.ok) {
        const data: ClientResponse = await response.json()
        return data.data.clienteId
      }

      return null
    } catch (error) {
      console.error("Erro ao verificar cliente existente:", error)
      return null
    }
  }

  const createClient = async (): Promise<string> => {
    const clientData = {
      nome: formData.nome,
      cpf: formData.cpf.replace(/\D/g, ""),
      telefone: formData.telefone.replace(/\D/g, ""),
      endereco: {
        ...formData.endereco,
        cep: formData.endereco.cep.replace(/\D/g, ""),
      },
    }

    const response = await fetch("http://localhost:8080/api/v1/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    })

    if (!response.ok) {
      throw new Error("Erro ao cadastrar cliente")
    }

    const data: ClientResponse = await response.json()
    return data.data.clienteId
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Primeiro, verificar se o cliente já existe
      const existingClientId = await checkExistingClient(formData.telefone)

      if (existingClientId) {
        setSuccess("Cliente encontrado! Dados carregados com sucesso.")
        onClientSaved(existingClientId)
      } else {
        // Criar novo cliente
        const newClientId = await createClient()
        setSuccess("Cliente cadastrado com sucesso!")
        onClientSaved(newClientId)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao processar cliente")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.nome.trim() &&
      formData.cpf.replace(/\D/g, "").length === 11 &&
      formData.telefone.replace(/\D/g, "").length === 11 &&
      formData.endereco.rua.trim() &&
      formData.endereco.numero.trim() &&
      formData.endereco.bairro.trim() &&
      formData.endereco.cep.replace(/\D/g, "").length === 8
    )
  }

  return (
    <Card className="border-cynthia-yellow-mustard/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
          <User className="w-5 h-5" />
          Dados do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleInputChange("telefone", e.target.value)}
              placeholder="(82) 99999-9999"
              maxLength={15}
              required
            />
          </div>

          {/* Endereço */}
          <div className="space-y-4 pt-4 border-t border-cynthia-yellow-mustard/30">
            <h3 className="font-semibold text-cynthia-green-dark flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço de Entrega
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="rua">Rua *</Label>
                <Input
                  id="rua"
                  value={formData.endereco.rua}
                  onChange={(e) => handleInputChange("endereco.rua", e.target.value)}
                  placeholder="Nome da rua"
                  required
                />
              </div>
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={formData.endereco.numero}
                  onChange={(e) => handleInputChange("endereco.numero", e.target.value)}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleInputChange("endereco.bairro", e.target.value)}
                  placeholder="Nome do bairro"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={formData.endereco.cep}
                  onChange={(e) => handleInputChange("endereco.cep", e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.endereco.complemento}
                  onChange={(e) => handleInputChange("endereco.complemento", e.target.value)}
                  placeholder="Apto, casa, etc."
                />
              </div>
              <div>
                <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
                <Input
                  id="pontoReferencia"
                  value={formData.endereco.pontoReferencia}
                  onChange={(e) => handleInputChange("endereco.pontoReferencia", e.target.value)}
                  placeholder="Próximo ao..."
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Confirmar Dados do Cliente"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
