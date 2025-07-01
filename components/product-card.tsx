"use client"

import Image from "next/image"
import { useState } from "react"
import { Minus, Plus, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { Product, ProductVariation } from "@/types/product"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"
import { useReviews } from "@/contexts/review-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation>(product.variacoes[0])
  const [quantity, setQuantity] = useState(1)
  const { showToast } = useToast()
  const { getProductStats } = useReviews()
  const stats = getProductStats(product.id)
  const [isLoading, setIsLoading] = useState(false)

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toFixed(2).replace(".", ",")}`
  }

  const handleAddToCart = async () => {
    setIsLoading(true)

    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: { product, variation: selectedVariation },
      })
    }

    showToast(`${product.nome} (${selectedVariation.nome_tamanho}) adicionado ao carrinho!`, "success")

    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
    setQuantity(1)
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const getProductImage = (productId: number) => {
    const imageMap: { [key: number]: string } = {
      1: "/images/caldos/caldo-de-galinha.png",
      2: "/images/caldos/caldo-de-kenga.png",
      3: "/images/caldos/caldo-de-charque.jpeg",
      4: "/images/caldos/caldo-de-feijao.png",
      5: "/images/caldos/caldo-de-legumes.jpeg",
      6: "/images/caldos/creme-de-abobora.jpeg",
    }
    return imageMap[productId] || product.imagem_url || "/placeholder.svg?height=200&width=300"
  }

  return (
    <Card className="h-[580px] flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-cynthia-yellow-mustard/30 group">
      <CardHeader className="p-0 flex-shrink-0">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={getProductImage(product.id) || "/placeholder.svg"}
            alt={product.nome}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product.disponivel && (
            <Badge className="absolute top-2 right-2 bg-cynthia-green-leaf text-white font-medium">Disponível</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-cynthia-green-dark line-clamp-2 flex-1 mr-2">{product.nome}</h3>
          <Badge
            variant="outline"
            className="border-cynthia-orange-pumpkin text-cynthia-orange-pumpkin bg-white font-semibold flex-shrink-0"
          >
            {formatPrice(selectedVariation.preco_centavos)}
          </Badge>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2 flex-shrink-0">{product.descricao}</p>

        {stats.totalReviews > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {stats.averageRating.toFixed(1)} ({stats.totalReviews} avaliações)
              </span>
            </div>
            <Separator className="mb-4 bg-cynthia-yellow-mustard/30 flex-shrink-0" />
          </>
        )}

        <div className="space-y-4 flex-1 flex flex-col justify-end">
          <div className="flex-shrink-0">
            <label className="text-sm font-medium mb-2 block text-cynthia-green-dark">Tamanho:</label>
            <Select
              value={selectedVariation.nome_tamanho}
              onValueChange={(value) => {
                const variation = product.variacoes.find((v) => v.nome_tamanho === value)
                if (variation) setSelectedVariation(variation)
              }}
            >
              <SelectTrigger className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark text-cynthia-green-dark">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-cynthia-yellow-mustard/30">
                {product.variacoes.map((variation) => (
                  <SelectItem
                    key={variation.nome_tamanho}
                    value={variation.nome_tamanho}
                    className="text-cynthia-green-dark"
                  >
                    {variation.nome_tamanho} - {formatPrice(variation.preco_centavos)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                className="w-8 h-8 p-0 rounded-full bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80 text-white border-cynthia-orange-pumpkin"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Badge
                variant="outline"
                className="px-3 py-1 border-cynthia-green-dark text-cynthia-green-dark bg-white font-semibold"
              >
                {quantity}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                className="w-8 h-8 p-0 rounded-full bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80 text-white border-cynthia-orange-pumpkin"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex-shrink-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.disponivel || isLoading}
          className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 font-medium"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adicionando...
            </div>
          ) : product.disponivel ? (
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Adicionar ao Carrinho
            </div>
          ) : (
            "Indisponível"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
