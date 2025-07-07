"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, AlertTriangle } from "lucide-react"
import type { CepResponse } from "@/types/cep"
import type { DeliveryAddress } from "@/types/product"

interface CepSearchProps {
  address: DeliveryAddress
  onAddressChange: (field: string, value: string) => void
  onAddressComplete: (address: DeliveryAddress) => void
}

export function CepSearch({ address, onAddressChange, onAddressComplete }: CepSearchProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cepData, setCepData] = useState<CepResponse | null>(null)
  const [addressConfirmed, setAddressConfirmed] = useState(false)

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCepChange = (value: string) => {
    const formattedCep = formatCep(value)
    onAddressChange("cep", formattedCep)

    // Reset states when CEP changes
    setError(null)
    setCepData(null)
    setAddressConfirmed(false)
  }

  const searchCep = async () => {
    const cleanCep = address.cep.replace(/\D/g, "")

    if (cleanCep.length !== 8) {
      setError("CEP deve ter 8 dígitos")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://api.caldosesopacg.com/api/v1/cep/${cleanCep}`)

      if (!response.ok) {
        throw new Error("CEP não encontrado")
      }

      const apiResponse = await response.json();
      const data: CepResponse = apiResponse.data;

      // Validar se é São Miguel dos Campos
      function normalizeString(str: string | undefined | null) {
        return (str || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();
      }
      console.log("Cidade retornada pela API:", data.cidade);
      const cidadeNormalizada = normalizeString(data.cidade);
      const cidadeEsperada = normalizeString("São Miguel dos Campos");
      console.log("Comparação cidade:", cidadeNormalizada, cidadeEsperada, cidadeNormalizada === cidadeEsperada);
      if (cidadeNormalizada !== cidadeEsperada) {
        setError("Só fazemos entregas em São Miguel dos Campos, Alagoas");
        setIsLoading(false);
        return;
      }

      setCepData(data)

      // Preencher os campos automaticamente
      onAddressChange("bairro", data.bairro)
      onAddressChange("rua", data.rua)

      // Se tem coordenadas, considerar confirmado
      setAddressConfirmed(true)
      onAddressComplete({
        ...address,
        bairro: data.bairro,
        rua: data.rua,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar CEP")
    } finally {
      setIsLoading(false)
    }
  }

  // Busca automática quando CEP estiver completo
  useEffect(() => {
    const cleanCep = address.cep.replace(/\D/g, "")
    
    if (cleanCep.length === 8) {
      const timeoutId = setTimeout(() => {
        searchCep()
      }, 500)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [address.cep])

  return (
    <div className="space-y-4">
      {/* Campo CEP */}
      <div className="relative">
        <Label htmlFor="cep" className="text-cynthia-green-dark font-medium">
          CEP *
        </Label>
        <div className="relative">
          <Input
            id="cep"
            placeholder="00000-000"
            value={address.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
            className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark text-cynthia-green-dark pr-10"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-cynthia-green-dark" />
            </div>
          )}
        </div>
        <p className="text-xs text-cynthia-green-dark/70 mt-1">
          Digite o CEP completo para buscar automaticamente
        </p>
      </div>

      {/* Erro */}
      {error && (
        <Alert className="border-red-400 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Campos adicionais - só aparecem após confirmação */}
      {addressConfirmed && (
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
          <div>
            <Label htmlFor="bairro" className="text-cynthia-green-dark font-medium">
              Bairro
            </Label>
            <Input
              id="bairro"
              value={address.bairro}
              onChange={(e) => onAddressChange("bairro", e.target.value)}
              className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark bg-cynthia-cream/50 text-cynthia-green-dark"
              readOnly={!!cepData}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="rua" className="text-cynthia-green-dark font-medium">
              Rua
            </Label>
            <Input
              id="rua"
              value={address.rua}
              onChange={(e) => onAddressChange("rua", e.target.value)}
              className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark bg-cynthia-cream/50 text-cynthia-green-dark"
              readOnly={!!cepData}
            />
          </div>
          <div>
            <Label htmlFor="numero" className="text-cynthia-green-dark font-medium">
              Número *
            </Label>
            <Input
              id="numero"
              placeholder="123"
              value={address.numero}
              onChange={(e) => onAddressChange("numero", e.target.value)}
              className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark text-cynthia-green-dark"
            />
          </div>
          <div>
            <Label htmlFor="complemento" className="text-cynthia-green-dark font-medium">
              Complemento
            </Label>
            <Input
              id="complemento"
              placeholder="Apto, casa, etc."
              value={address.complemento}
              onChange={(e) => onAddressChange("complemento", e.target.value)}
              className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark text-cynthia-green-dark"
            />
          </div>
        </div>
      )}

      {/* Sucesso */}
      {addressConfirmed && (
        <Alert className="border-cynthia-green-leaf bg-cynthia-green-leaf/10">
          <MapPin className="h-4 w-4 text-cynthia-green-leaf" />
          <AlertDescription className="text-cynthia-green-dark font-medium">
            Endereço confirmado! ✅ Fazemos entrega nesta região.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
