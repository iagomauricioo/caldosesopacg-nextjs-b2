"use client"

import { useTransition } from "react"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItem {
  id: number
  nome: string
  tamanho_ml: number
  nome_tamanho: string
  preco_centavos: number
  quantidade: number
  imagem_url?: string
}

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const [isPending, startTransition] = useTransition()

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return

    startTransition(() => {
      updateQuantity(item.id, item.tamanho_ml, newQuantity)
    })
  }

  const handleRemove = () => {
    startTransition(() => {
      removeFromCart(item.id, item.tamanho_ml)
    })
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Imagem do produto */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={item.imagem_url || "/placeholder.svg?height=80&width=80"}
              alt={item.nome}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Informações do produto */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-cynthia-green-dark truncate">{item.nome}</h3>
            <p className="text-sm text-gray-600">{item.nome_tamanho}</p>
            <p className="text-lg font-bold text-cynthia-orange-pumpkin">R$ {(item.preco_centavos / 100).toFixed(2)}</p>
          </div>

          {/* Controles de quantidade */}
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isPending}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(item.quantidade - 1)}
                disabled={isPending || item.quantidade <= 1}
                className="w-8 h-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>

              <span className="w-8 text-center font-medium">{item.quantidade}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(item.quantidade + 1)}
                disabled={isPending}
                className="w-8 h-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
