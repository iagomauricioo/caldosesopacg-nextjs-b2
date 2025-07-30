"use client"

import { useState, useTransition } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  observations?: string
  image?: string
}

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { dispatch } = useCart()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showObservations, setShowObservations] = useState(!!item.observations)

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return

    startTransition(() => {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: item.id, quantity: newQuantity },
      })
    })
  }

  const removeItem = () => {
    startTransition(() => {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { id: item.id },
      })

      toast({
        title: "Item removido",
        description: `${item.name} foi removido do carrinho.`,
      })
    })
  }

  const updateObservations = (observations: string) => {
    dispatch({
      type: "UPDATE_OBSERVATIONS",
      payload: { id: item.id, observations },
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {/* Imagem do produto */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-cynthia-cream rounded-lg overflow-hidden">
            {item.image ? (
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🍲</div>
            )}
          </div>
        </div>

        {/* Informações do produto */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-cynthia-green-dark truncate">{item.name}</h3>
          <p className="text-sm text-muted-foreground">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.price / 100)}{" "}
            cada
          </p>
        </div>

        {/* Controles de quantidade */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-cynthia-green-dark/30 bg-transparent"
            onClick={() => updateQuantity(item.quantity - 1)}
            disabled={isPending || item.quantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>

          <span className="w-8 text-center font-medium text-cynthia-green-dark">{item.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-cynthia-green-dark/30 bg-transparent"
            onClick={() => updateQuantity(item.quantity + 1)}
            disabled={isPending}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Preço total e remover */}
        <div className="flex flex-col items-end gap-2">
          <p className="font-bold text-cynthia-green-dark">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format((item.price * item.quantity) / 100)}
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={removeItem}
            disabled={isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Botão de observações */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowObservations(!showObservations)}
          className="text-cynthia-orange-pumpkin hover:text-cynthia-orange-pumpkin/80 h-8 px-2"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          {showObservations ? "Ocultar" : "Adicionar"} observações
        </Button>
      </div>

      {/* Campo de observações */}
      {showObservations && (
        <div className="pl-4">
          <Input
            placeholder="Ex: Sem cebola, bem temperado..."
            value={item.observations || ""}
            onChange={(e) => updateObservations(e.target.value)}
            className="text-sm border-cynthia-orange-pumpkin/30 focus:border-cynthia-orange-pumpkin"
          />
        </div>
      )}

      <Separator className="bg-cynthia-green-dark/10" />
    </div>
  )
}
