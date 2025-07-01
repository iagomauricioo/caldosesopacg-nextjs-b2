"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product } from "@/types/product"
import { CheckCircle, Clock, Heart, Award, Info } from "lucide-react"
import { Footer } from "@/components/footer"
import { MobileNavbar } from "@/components/mobile-navbar"
import { FloatingLeaves } from "@/components/animations/floating-leaves"
import { SoupBubbles } from "@/components/animations/soup-bubbles"
import axios from "axios"

// Mock data baseado na sua API
/* const mockProducts: Product[] = [
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
    imagem_url: "/placeholder.svg?height=200&width=300",
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
    imagem_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    nome: "Caldo de Camarão",
    descricao: "Caldo cremoso de camarão",
    disponivel: true,
    ordem_exibicao: 3,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 2000 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1700 },
    ],
    imagem_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    nome: "Caldo de Charque",
    descricao: "Caldo saboroso de charque",
    disponivel: true,
    ordem_exibicao: 4,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 2000 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1700 },
    ],
    imagem_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    nome: "Sopa de Feijão com Carne",
    descricao: "Sopa nutritiva de feijão com carne",
    disponivel: true,
    ordem_exibicao: 1,
    variacoes: [
      { tamanho_ml: 900, nome_tamanho: "900ml", preco_centavos: 2000 },
      { tamanho_ml: 700, nome_tamanho: "700ml", preco_centavos: 1600 },
    ],
    imagem_url: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    nome: "Canja de Galinha",
    descricao: "Canja tradicional de galinha",
    disponivel: true,
    ordem_exibicao: 1,
    variacoes: [
      { tamanho_ml: 900, nome_tamanho: "900ml", preco_centavos: 1800 },
      { tamanho_ml: 700, nome_tamanho: "700ml", preco_centavos: 1400 },
    ],
    imagem_url: "/placeholder.svg?height=200&width=300",
  },
] */


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState("todos")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/produtos")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        // Fallback para dados mock em caso de erro
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "todos") return true
    if (activeFilter === "caldos") return product.nome.toLowerCase().includes("caldo")
    if (activeFilter === "acompanhamentos") return !product.nome.toLowerCase().includes("caldo")
    return true
  })

  return (
    <div className="min-h-screen bg-cynthia-cream">
      <FloatingLeaves />
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 bg-cynthia-green-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />

        {/* Padrão decorativo */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-cynthia-yellow-mustard">
          <div className="flex items-center justify-center h-full space-x-8 animate-slide-in-left">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="text-cynthia-green-dark text-2xl animate-float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                🍲
              </div>
            ))}
          </div>
        </div>

        <SoupBubbles className="absolute inset-0" />

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl animate-slide-in-left">
            <Badge className="mb-4 bg-cynthia-yellow-mustard text-cynthia-green-dark">✨ Artesanal & Natural</Badge>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Sabor que aquece
              <span className="block text-cynthia-yellow-mustard animate-pulse">sua alma</span>
            </h1>
            <p className="text-xl opacity-90 mb-8 text-cynthia-cream">
              Caldos artesanais feitos com amor e ingredientes frescos
            </p>
            <Button
              size="lg"
              className="bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80 text-white px-8 py-4 text-lg animate-pulse-soft hover:scale-105 transition-transform duration-300 font-semibold"
            >
              Experimente Agora! 🍲
            </Button>
          </div>
        </div>
      </section>

      {/* Alert de Promoção */}
      <section className="container mx-auto px-4 py-4">
        <Alert className="border-cynthia-yellow-mustard bg-cynthia-yellow-mustard/10">
          <Info className="h-4 w-4 text-cynthia-orange-pumpkin" />
          <AlertDescription className="text-cynthia-green-dark">
            <strong>Oferta especial:</strong> Frete grátis para pedidos acima de R$ 30,00! 🚚
          </AlertDescription>
        </Alert>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: "todos", label: "Todos", icon: "🍽️" },
            { key: "caldos", label: "Caldos", icon: "🍲" },
            { key: "acompanhamentos", label: "Acompanhamentos", icon: "🥖" },
          ].map((filter, index) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.key)}
              className={`
                whitespace-nowrap transition-all duration-300 hover:scale-105 animate-fade-in-up
                ${
                  activeFilter === filter.key
                    ? "bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white"
                    : "border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white"
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cynthia-green-dark"></div>
              <p className="mt-4 text-cynthia-green-dark">Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-cynthia-green-dark">Nenhum produto encontrado.</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        <Separator className="my-12 bg-cynthia-yellow-mustard/30" />

        {/* Why Choose Us Section */}
        <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-cynthia-yellow-mustard/30 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-8 text-center text-cynthia-green-dark">
            Por que escolher nossos caldos?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Heart className="w-8 h-8 text-cynthia-orange-pumpkin" />,
                title: "Feito com Amor",
                description: "Cada caldo é preparado com carinho e dedicação",
                delay: "0s",
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-cynthia-green-leaf" />,
                title: "Ingredientes Naturais",
                description: "Produtos frescos e selecionados",
                delay: "0.1s",
              },
              {
                icon: <Clock className="w-8 h-8 text-cynthia-orange-pumpkin" />,
                title: "Entrega Rápida",
                description: "Seu caldo quentinho em minutos",
                delay: "0.2s",
              },
              {
                icon: <Award className="w-8 h-8 text-cynthia-green-leaf" />,
                title: "Qualidade Premium",
                description: "Receitas tradicionais aperfeiçoadas",
                delay: "0.3s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border border-cynthia-yellow-mustard/20"
                style={{ animationDelay: item.delay }}
              >
                <div
                  className="bg-cynthia-yellow-mustard/20 p-4 rounded-full mb-4 animate-float border border-cynthia-yellow-mustard/30"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2 text-cynthia-green-dark">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-20 animate-fade-in-up">
          <div className="bg-cynthia-yellow-mustard rounded-2xl p-8 text-cynthia-green-dark shadow-xl border border-cynthia-orange-pumpkin/30">
            <Badge className="mb-4 bg-cynthia-orange-pumpkin text-white">🔥 Oferta Limitada</Badge>
            <h2 className="text-3xl font-bold mb-4">Pronto para se aquecer?</h2>
            <p className="text-xl mb-6 opacity-90">Experimente nossos caldos artesanais agora mesmo!</p>
            <Button
              size="lg"
              className="bg-cynthia-green-dark text-white hover:bg-cynthia-green-dark/80 px-8 py-4 text-lg font-semibold hover:scale-110 transition-all duration-300 animate-pulse-soft"
            >
              Peça agora mesmo! 🔥
            </Button>
          </div>
        </section>
      </section>

      <Footer />
      <MobileNavbar />
    </div>
  )
}
