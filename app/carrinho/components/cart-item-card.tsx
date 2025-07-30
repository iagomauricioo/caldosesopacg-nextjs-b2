"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import type { CartItem } from "@/types/product"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { dispatch } = useCart()

  const getImageUrl = (productId: number): string => {
    const imageMap: { [key: number]: string } = {
      1: "/images/caldos/caldo-de-galinha.png",
      2: "/images/caldos/caldo-de-kenga.png",
      3: "/images/caldos/caldo-de-charque.jpeg",
      4: "/images/caldos/caldo-de-feijao.png",
      5: "/images/caldos/caldo-de-legumes.jpeg",
      6: "/images/caldos/creme-de-abobora.jpeg",
    }
    return imageMap[productId] || "/placeholder.svg"
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({
        type: "REMOVE_ITEM",
        payload: {
          productId: item.product.id,
          variationSize: item.variation.tamanho_ml,
        },
      })
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: {
          productId: item.product.id,
          variationSize: item.variation.tamanho_ml,
          quantity: newQuantity,
        },
      })
    }
  }

  const handleRemoveItem = () => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: {
        productId: item.product.id,
        variationSize: item.variation.tamanho_ml,
      },
    })
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-cynthia-cream/30 rounded-lg">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
        <Image
          src={getImageUrl(item.product.id) || "/placeholder.svg"}
          alt={item.product.nome}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg"
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-cynthia-green-dark truncate">{item.product.nome}</h3>
        <p className="text-xs text-gray-600">{item.variation.nome_tamanho}</p>

        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="h-6 w-6 p-0 border-cynthia-yellow-mustard/50"
          >
            <Minus className="w-3 h-3" />
          </Button>

          <Badge variant="secondary" className="bg-cynthia-yellow-light text-cynthia-green-dark">
            {item.quantity}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="h-6 w-6 p-0 border-cynthia-yellow-mustard/50"
          >
            <Plus className="w-3 h-3" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveItem}
            className="h-6 w-6 p-0 border-red-300 text-red-600 hover:bg-red-50 ml-auto bg-transparent"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-cynthia-green-dark">
          R$ {((item.variation.preco_centavos * item.quantity) / 100).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
