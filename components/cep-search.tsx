"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, AlertTriangle } from "lucide-react"
import { SimpleMap } from "@/components/simple-map"
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
  const [showMap, setShowMap] = useState(false)
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
    setShowMap(false)
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
      const response = await fetch(`http://localhost:8080/api/v1/cep/${cleanCep}`)

      if (!response.ok) {
        throw new Error("CEP não encontrado")
      }

      const data: CepResponse = await response.json()

      // Validar se é São Miguel dos Campos
      if (data.cidade !== "São Miguel dos Campos") {
        setError("Só fazemos entregas em São Miguel dos Campos, Alagoas")
        setIsLoading(false)
        return
      }

      setCepData(data)

      // Preencher os campos automaticamente
      onAddressChange("bairro", data.bairro)
      onAddressChange("rua", data.rua)

      // Se tem coordenadas, mostrar mapa
      if (data.location?.coordinates?.latitude && data.location?.coordinates?.longitude) {
        setShowMap(true)
      } else {
        // Se não tem coordenadas, considerar confirmado
        setAddressConfirmed(true)
        onAddressComplete({
          ...address,
          bairro: data.bairro,
          rua: data.rua,
        })
      }
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

  const handleMapConfirm = () => {
    setShowMap(false)
    setAddressConfirmed(true)
    if (cepData) {
      onAddressComplete({
        ...address,
        bairro: cepData.bairro,
        rua: cepData.rua,
      })
    }
  }

  const handleMapReject = () => {
    setShowMap(false)
    setAddressConfirmed(false)
    // Limpar dados para permitir nova busca
    setCepData(null)
    onAddressChange("bairro", "")
    onAddressChange("rua", "")
  }

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

      {/* Mapa de confirmação */}
      {showMap && cepData && (
        <SimpleMap
          latitude={cepData.location.coordinates.latitude}
          longitude={cepData.location.coordinates.longitude}
          address={`${cepData.rua}, ${cepData.bairro}, ${cepData.cidade} - ${cepData.estado}`}
          onConfirm={handleMapConfirm}
          onReject={handleMapReject}
        />
      )}

      {/* Campos adicionais - só aparecem após confirmação */}
      {(addressConfirmed || (cepData && !showMap)) && (
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
