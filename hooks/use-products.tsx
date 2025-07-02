"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"

// Mock data baseado na sua API
const mockProducts: Product[] = [
  {
    id: 1,
    nome: "Caldo de Frango",
    descricao: "Caldo tradicional de frango",
    disponivel: true,
    ordem_exibicao: 1,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 1700 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1400 },
    ],
    imagem_url: "/images/caldos/caldo-de-galinha.png",
  },
  {
    id: 2,
    nome: "Caldo de Kenga",
    descricao: "Caldo com frango, calabresa e bacon",
    disponivel: true,
    ordem_exibicao: 2,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 1800 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1500 },
    ],
    imagem_url: "/images/caldos/caldo-de-kenga.png",
  },
  {
    id: 3,
    nome: "Caldo de Charque",
    descricao: "Caldo saboroso de charque",
    disponivel: true,
    ordem_exibicao: 3,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 2000 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1700 },
    ],
    imagem_url: "/images/caldos/caldo-de-charque.jpeg",
  },
  {
    id: 4,
    nome: "Caldo de Feijão",
    descricao: "Caldo tradicional de feijão",
    disponivel: true,
    ordem_exibicao: 4,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 2000 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1700 },
    ],
    imagem_url: "/images/caldos/caldo-de-feijao.png",
  },
  {
    id: 5,
    nome: "Caldo de Legumes",
    descricao: "Caldo vegetariano de legumes",
    disponivel: true,
    ordem_exibicao: 5,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 1800 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1500 },
    ],
    imagem_url: "/images/caldos/caldo-de-legumes.jpeg",
  },
  {
    id: 6,
    nome: "Creme de Abóbora",
    descricao: "Creme cremoso de abóbora",
    disponivel: true,
    ordem_exibicao: 6,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 1900 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1600 },
    ],
    imagem_url: "/images/caldos/creme-de-abobora.jpeg",
  },
]

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("http://localhost:8080/api/v1/produtos")

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Erro ao carregar produtos da API, usando dados mockados:", error)
        setError("Usando dados de exemplo")
        setProducts(mockProducts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductById = (id: number): Product | undefined => {
    return products.find((product) => product.id === id)
  }

  const getProductImage = (productId: number): string => {
    const product = getProductById(productId)
    if (product?.imagem_url) {
      // Se a URL é relativa (começa com /), manter como está
      if (product.imagem_url.startsWith('/')) {
        return product.imagem_url
      }
      // Se é uma URL externa, usar diretamente
      if (product.imagem_url.startsWith('http')) {
        return product.imagem_url
      }
      // Se não tem protocolo, assumir que é relativa
      return product.imagem_url
    }

    // Fallback para imagens locais baseado no ID
    const imageMap: { [key: number]: string } = {
      1: "/images/caldos/caldo-de-galinha.png",
      2: "/images/caldos/caldo-de-kenga.png",
      3: "/images/caldos/caldo-de-charque.jpeg",
      4: "/images/caldos/caldo-de-feijao.png",
      5: "/images/caldos/caldo-de-legumes.jpeg",
      6: "/images/caldos/creme-de-abobora.jpeg",
    }

    return imageMap[productId] || "/placeholder.svg?height=200&width=300&text=Caldo"
  }

  return {
    products,
    isLoading,
    error,
    getProductById,
    getProductImage,
  }
}
