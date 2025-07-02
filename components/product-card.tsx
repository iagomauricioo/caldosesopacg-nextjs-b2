"use client"

import Image from "next/image"
import { useState } from "react"
import { Minus, Plus, Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { Product, ProductVariation } from "@/types/product"
import { useCart } from "@/contexts/cart-context"
import { useEnhancedToast } from "@/components/enhanced-toast"
import { useReviews } from "@/contexts/review-context"
import { useProducts } from "@/hooks/use-products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()
  const { getProductImage } = useProducts()
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation>(product.variacoes[0])
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { showProductAddedToast } = useEnhancedToast()
  const { getProductStats } = useReviews()
  const stats = getProductStats(product.id)

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toFixed(2).replace(".", ",")}`
  }

  const handleAddToCart = async () => {
    setIsLoading(true)

    // Animação de loading
    await new Promise((resolve) => setTimeout(resolve, 800))

    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: { product, variation: selectedVariation },
      })
    }

    // Toast melhorado
    showProductAddedToast(product.nome, selectedVariation.nome_tamanho)

    setIsLoading(false)
    setQuantity(1)
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Aqui você implementaria a lógica de favoritos
  }

  return (
    <Card className="h-[580px] flex flex-col overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-white border-cynthia-yellow-mustard/30 group relative">
      {/* Botão de Favorito */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <Heart
          className={`w-4 h-4 transition-colors duration-300 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      <CardHeader className="p-0 flex-shrink-0">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cynthia-yellow-mustard/10 to-cynthia-orange-pumpkin/10">
          {/* Skeleton de loading da imagem */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}

          <Image
            src={getProductImage(product.id) || "/placeholder.svg"}
            alt={product.nome}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge de disponibilidade */}
          {product.disponivel && (
            <Badge className="absolute top-3 right-3 bg-cynthia-green-leaf text-white font-medium shadow-md animate-pulse">
              Disponível
            </Badge>
          )}

          {/* Badge de desconto (exemplo) */}
          <Badge className="absolute bottom-3 left-3 bg-cynthia-orange-pumpkin text-white font-medium shadow-md">
            Mais Vendido
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-cynthia-green-dark line-clamp-2 flex-1 mr-2 group-hover:text-cynthia-orange-pumpkin transition-colors duration-300">
            {product.nome}
          </h3>
          <Badge
            variant="outline"
            className="border-cynthia-orange-pumpkin text-cynthia-orange-pumpkin bg-white font-semibold flex-shrink-0 shadow-sm"
          >
            {formatPrice(selectedVariation.preco_centavos)}
          </Badge>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2 flex-shrink-0">{product.descricao}</p>

        {/* Avaliações */}
        {stats.totalReviews > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 transition-colors duration-200 ${
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
          {/* Seletor de tamanho melhorado */}
          <div className="flex-shrink-0">
            <label className="text-sm font-medium mb-2 block text-cynthia-green-dark">Tamanho:</label>
            <Select
              value={selectedVariation.nome_tamanho}
              onValueChange={(value) => {
                const variation = product.variacoes.find((v) => v.nome_tamanho === value)
                if (variation) setSelectedVariation(variation)
              }}
            >
              <SelectTrigger className="border-cynthia-yellow-mustard/50 focus:border-cynthia-green-dark text-cynthia-green-dark hover:border-cynthia-orange-pumpkin transition-colors duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-cynthia-yellow-mustard/30">
                {product.variacoes.map((variation) => (
                  <SelectItem
                    key={variation.nome_tamanho}
                    value={variation.nome_tamanho}
                    className="text-cynthia-green-dark hover:bg-cynthia-yellow-mustard/20"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{variation.nome_tamanho}</span>
                      <span className="ml-4 font-semibold text-cynthia-orange-pumpkin">
                        {formatPrice(variation.preco_centavos)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seletor de quantidade melhorado */}
          <div className="flex items-center justify-center flex-shrink-0">
            <div className="flex items-center gap-3 bg-cynthia-cream/30 rounded-full p-1">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                className="w-8 h-8 p-0 rounded-full bg-white hover:bg-cynthia-orange-pumpkin hover:text-white border-cynthia-orange-pumpkin/50 transition-all duration-300 hover:scale-110"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Badge
                variant="outline"
                className="px-4 py-2 border-cynthia-green-dark text-cynthia-green-dark bg-white font-bold text-base min-w-[3rem] text-center"
              >
                {quantity}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                className="w-8 h-8 p-0 rounded-full bg-white hover:bg-cynthia-orange-pumpkin hover:text-white border-cynthia-orange-pumpkin/50 transition-all duration-300 hover:scale-110"
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
          className="w-full bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 font-medium relative overflow-hidden group"
        >
          {/* Efeito de loading */}
          {isLoading && <div className="absolute inset-0 bg-cynthia-green-leaf animate-pulse" />}

          {isLoading ? (
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adicionando...
            </div>
          ) : product.disponivel ? (
            <div className="flex items-center gap-2 relative z-10">
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Adicionar ao Carrinho
            </div>
          ) : (
            "Indisponível"
          )}

          {/* Efeito de hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-cynthia-orange-pumpkin to-cynthia-green-leaf opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </Button>
      </CardFooter>
    </Card>
  )
}
