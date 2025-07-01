"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, CheckCircle, X } from "lucide-react"

interface SimpleMapProps {
  latitude: string
  longitude: string
  address: string
  onConfirm: () => void
  onReject: () => void
}

export function SimpleMap({ latitude, longitude, address, onConfirm, onReject }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simular um mapa simples com coordenadas
    if (mapRef.current) {
      const lat = Number.parseFloat(latitude)
      const lng = Number.parseFloat(longitude)

      // Criar um mapa visual simples
      mapRef.current.innerHTML = `
        <div class="relative w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <div class="w-full h-full bg-gradient-to-r from-green-200 via-blue-200 to-green-200"></div>
          </div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="bg-red-500 w-6 h-6 rounded-full border-4 border-white shadow-lg animate-bounce"></div>
            <div class="bg-red-500 w-3 h-3 rounded-full absolute top-6 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div class="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
            Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}
          </div>
        </div>
      `
    }
  }, [latitude, longitude])

  return (
    <Card className="border-cynthia-yellow-mustard/30">
      <CardHeader>
        <CardTitle className="text-cynthia-green-dark flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cynthia-orange-pumpkin" />
          Confirme sua localização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={mapRef} />

        <div className="bg-cynthia-cream p-3 rounded-lg border border-cynthia-yellow-mustard/30">
          <p className="text-sm text-cynthia-green-dark">
            <strong>Endereço:</strong> {address}
          </p>
        </div>

        <div className="text-center">
          <p className="text-cynthia-green-dark mb-4 font-medium">Você está aqui?</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onConfirm} className="bg-cynthia-green-leaf hover:bg-cynthia-green-leaf/80 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Sim, estou aqui
            </Button>
            <Button
              onClick={onReject}
              variant="outline"
              className="border-cynthia-orange-pumpkin text-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin hover:text-white bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Não, corrigir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
