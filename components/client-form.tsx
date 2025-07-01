"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, MapPin, Phone, CheckCircle, AlertTriangle } from "lucide-react"
import type { ClientFormData, ClientResponse } from "@/types/client"

// Tipo para a resposta real da API de endereço
interface EnderecoResponse {
  id: number
  clienteId: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  pontoReferencia?: string
  enderecoPrincipal: boolean
}

interface ClientFormProps {
  onClientSaved: (clientId: string) => void
}

export function ClientForm({ onClientSaved }: ClientFormProps) {
  const [telefone, setTelefone] = useState("")
  const [clientData, setClientData] = useState<ClientResponse["data"] | null>(null)
  const [endereco, setEndereco] = useState<EnderecoResponse | null>(null)
  const [formData, setFormData] = useState<ClientFormData>({
    nome: "",
    cpf: "",
    telefone: "",
    endereco: {
      rua: "",
      complemento: "",
      numero: "",
      bairro: "",
      pontoReferencia: "",
      cep: "",
    },
  })

  // Log inicial do formData
  console.log("Estado inicial do formData:", formData)

  // Monitorar mudanças no formData
  useEffect(() => {
    console.log("formData atualizado:", formData)
    console.log("formData.endereco:", formData.endereco)
  }, [formData])

  const [isLoadingClient, setIsLoadingClient] = useState(false)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [isCreatingClient, setIsCreatingClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [clientFound, setClientFound] = useState(false)

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }
  //teste
  const handleTelefoneChange = (value: string) => {
    const formatted = formatPhone(value)
    setTelefone(formatted)
    setError(null)
    setSuccess(null)
    setClientFound(false)
    setClientData(null)
    setEndereco(null)
  }

  const limparFormulario = () => {
    setTelefone("")
    setClientData(null)
    setEndereco(null)
    setFormData({
      nome: "",
      cpf: "",
      telefone: "",
      endereco: {
        rua: "",
        complemento: "",
        numero: "",
        bairro: "",
        pontoReferencia: "",
        cep: "",
      },
    })
  }

  const searchClient = async () => {
    console.log("searchClient chamada com telefone:", telefone)
    limparFormulario()
    const cleanPhone = telefone.replace(/\D/g, "")
    console.log("Telefone limpo:", cleanPhone)

    setIsLoadingClient(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:8080/api/v1/clientes/${cleanPhone}`)

      if (response.ok) {
        const data: ClientResponse = await response.json()
        console.log("Dados do cliente encontrado:", data.data)
        setClientData(data.data)
        setClientFound(true)
        setSuccess(`Cliente encontrado: ${data.data.nome}`)

        // Preencher dados do formulário
        setFormData((prev) => ({
          ...prev,
          nome: data.data.nome,
          cpf: data.data.cpf,
          telefone: data.data.telefone,
        }))

        // Buscar endereço do cliente
        console.log("Chamando searchClientAddress para:", cleanPhone)
        await searchClientAddress(cleanPhone)
      } else {
        setClientFound(false)
        setSuccess("Cliente não encontrado. Preencha os dados para cadastrar.")
        setFormData((prev) => ({
          ...prev,
          telefone: cleanPhone,
        }))
      }
    } catch (err) {
      setError("Erro ao buscar cliente")
      console.error("Erro ao buscar cliente:", err)
    } finally {
      setIsLoadingClient(false)
    }
  }

  // Busca automática quando telefone estiver completo
  useEffect(() => {
    const cleanPhone = telefone.replace(/\D/g, "")
    console.log("useEffect - Telefone:", cleanPhone, "Tamanho:", cleanPhone.length)
    
    if (cleanPhone.length === 11) {
      console.log("useEffect - Telefone completo, agendando busca...")
      const timeoutId = setTimeout(() => {
        console.log("useEffect - Executando busca...")
        searchClient()
      }, 500)

      return () => {
        console.log("useEffect - Limpando timeout")
        clearTimeout(timeoutId)
      }
    }
  }, [telefone])

  const searchClientAddress = async (telefone: string) => {
    setIsLoadingAddress(true)

    try {
      const response = await fetch(`http://localhost:8080/api/v1/clientes/${telefone}/endereco`)

      if (response.ok) {
        const enderecoData = await response.json()
        console.log("Resposta da API de endereço:", enderecoData)
        
        if (enderecoData) {
          console.log("Estrutura do endereço:", JSON.stringify(enderecoData, null, 2))
          setEndereco(enderecoData)

          // Preencher dados do endereço
          const formEnderecoData = {
            rua: enderecoData.rua || "",
            complemento: enderecoData.complemento || "",
            numero: enderecoData.numero || "",
            bairro: enderecoData.bairro || "",
            pontoReferencia: enderecoData.pontoReferencia || "",
            cep: formatCEP(enderecoData.cep || ""),
          }
          
          console.log("Dados do endereço a serem preenchidos:", formEnderecoData)
          
          setFormData((prev) => {
            const newData = {
              ...prev,
              endereco: formEnderecoData,
            }
            console.log("Estado anterior:", prev)
            console.log("Novo formData:", newData)
            console.log("formEnderecoData:", formEnderecoData)
            return newData
          })
        } else {
          console.log("data.data não encontrado na resposta")
        }
      } else {
        console.log("Resposta não ok:", response.status, response.statusText)
      }
    } catch (err) {
      console.error("Erro ao buscar endereço:", err)
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value)
    } else if (field === "endereco.cep") {
      value = formatCEP(value)
    }

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
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

  const createClient = async () => {
    setIsCreatingClient(true)
    setError(null)

    try {
      const clientPayload = {
        nome: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ""),
        telefone: formData.telefone.replace(/\D/g, ""),
        endereco: {
          rua: formData.endereco?.rua || "",
          complemento: formData.endereco?.complemento || "",
          numero: formData.endereco?.numero || "",
          bairro: formData.endereco?.bairro || "",
          pontoReferencia: formData.endereco?.pontoReferencia || "",
          cep: (formData.endereco?.cep || "").replace(/\D/g, ""),
        },
      }

      const response = await fetch("http://localhost:8080/api/v1/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientPayload),
      })

      if (!response.ok) {
        throw new Error("Erro ao cadastrar cliente")
      }

      const data: ClientResponse = await response.json()
      setSuccess("Cliente cadastrado com sucesso!")
      onClientSaved(data.data.clienteId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar cliente")
    } finally {
      setIsCreatingClient(false)
    }
  }

  const handleSubmit = () => {
    if (clientFound && clientData) {
      // Cliente já existe, usar o ID existente
      onClientSaved(clientData.clienteId)
    } else {
      // Criar novo cliente
      createClient()
    }
  }

  const isFormValid = () => {
    if (clientFound) return true

    return (
      formData.nome.trim() &&
      formData.cpf.replace(/\D/g, "").length === 11 &&
      formData.telefone.replace(/\D/g, "").length === 11 &&
      formData.endereco?.rua?.trim() &&
      formData.endereco?.numero?.trim() &&
      formData.endereco?.bairro?.trim() &&
      (formData.endereco?.cep || "").replace(/\D/g, "").length === 8
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
      <CardContent className="space-y-6">
        {/* Busca por Telefone */}
        <div className="space-y-4 p-4 bg-cynthia-cream/20 rounded-lg border border-cynthia-yellow-mustard/30">
          <h3 className="font-semibold text-cynthia-green-dark flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Buscar Cliente
          </h3>

          <div>
            <Label htmlFor="telefone-busca">Telefone</Label>
            <div className="relative">
              <Input
                id="telefone-busca"
                value={telefone}
                onChange={(e) => handleTelefoneChange(e.target.value)}
                placeholder="(82) 99999-9999"
                maxLength={15}
                className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark pr-10"
              />
              {isLoadingClient && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-cynthia-green-dark" />
                </div>
              )}
            </div>
            <p className="text-xs text-cynthia-green-dark/70 mt-1">
              Digite o telefone completo para buscar automaticamente
            </p>
          </div>
        </div>

        {/* Mensagens de Status */}
        {error && (
          <Alert className="border-red-400 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-cynthia-green-leaf bg-cynthia-green-leaf/10">
            <CheckCircle className="h-4 w-4 text-cynthia-green-leaf" />
            <AlertDescription className="text-cynthia-green-dark font-medium">{success}</AlertDescription>
          </Alert>
        )}

        {/* Loading do Endereço */}
        {isLoadingAddress && (
          <Alert className="border-cynthia-yellow-mustard bg-cynthia-yellow-mustard/10">
            <Loader2 className="h-4 w-4 animate-spin text-cynthia-green-dark" />
            <AlertDescription className="text-cynthia-green-dark font-medium">
              Carregando endereço do cliente...
            </AlertDescription>
          </Alert>
        )}

        {/* Formulário de Dados */}
        {(clientFound || (!clientFound && telefone.replace(/\D/g, "").length === 11)) && (
          <div className="space-y-4">
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Seu nome completo"
                  readOnly={clientFound}
                  className={clientFound ? "bg-gray-50" : ""}
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
                  readOnly={clientFound}
                  className={clientFound ? "bg-gray-50" : ""}
                />
              </div>
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
                    value={formData.endereco?.rua || ""}
                    onChange={(e) => handleInputChange("endereco.rua", e.target.value)}
                    placeholder="Nome da rua"
                    className={endereco ? "bg-gray-50" : ""}
                    readOnly={!!endereco}
                  />
                </div>
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    value={formData.endereco?.numero || ""}
                    onChange={(e) => handleInputChange("endereco.numero", e.target.value)}
                    placeholder="123"
                    className={endereco ? "bg-gray-50" : ""}
                    readOnly={!!endereco}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={formData.endereco?.bairro || ""}
                    onChange={(e) => handleInputChange("endereco.bairro", e.target.value)}
                    placeholder="Nome do bairro"
                    className={endereco ? "bg-gray-50" : ""}
                    readOnly={!!endereco}
                  />
                </div>
                <div>
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    value={formData.endereco?.cep || ""}
                    onChange={(e) => handleInputChange("endereco.cep", e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className={endereco ? "bg-gray-50" : ""}
                    readOnly={!!endereco}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={formData.endereco?.complemento || ""}
                    onChange={(e) => handleInputChange("endereco.complemento", e.target.value)}
                    placeholder="Apto, casa, etc."
                    className={endereco ? "bg-gray-50" : ""}
                    readOnly={!!endereco}
                  />
                </div>
                <div>
                  <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
                  <Input
                    id="pontoReferencia"
                    value={formData.endereco?.pontoReferencia || ""}
                    onChange={(e) => handleInputChange("endereco.pontoReferencia", e.target.value)}
                    placeholder="Próximo ao..."
                    className={endereco ? "bg-gray-50" : ""}
                    readOnly={!!endereco}
                  />
                </div>
              </div>
            </div>

            {/* Botão de Confirmação */}
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isCreatingClient}
              className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80"
            >
              {isCreatingClient ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cadastrando Cliente...
                </>
              ) : clientFound ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Cliente Existente
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Cadastrar Novo Cliente
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
