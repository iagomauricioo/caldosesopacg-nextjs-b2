"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { PageLoadingSkeleton } from "@/components/loading-states"
import { ErrorBoundary, DefaultErrorFallback } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product } from "@/types/product"
import { CheckCircle, Clock, Heart, Award, Info, Zap } from "lucide-react"
import { Footer } from "@/components/footer"
import { MobileNavbar } from "@/components/mobile-navbar"
import { FloatingLeaves } from "@/components/animations/floating-leaves"
import { SoupBubbles } from "@/components/animations/soup-bubbles"

// Mock data baseado na sua API
const mockProducts: Product[] = [
  {
    id: 1,
    nome: "Caldo de Frango",
    descricao: "Caldo tradicional de frango com temperos especiais",
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
    descricao: "Caldo especial com frango, calabresa e bacon defumado",
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
    descricao: "Caldo saboroso de charque com temperos nordestinos",
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
    descricao: "Caldo tradicional de feijão com linguiça calabresa",
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
    descricao: "Caldo vegetariano nutritivo com legumes frescos",
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
    descricao: "Creme cremoso de abóbora com toque de gengibre",
    disponivel: true,
    ordem_exibicao: 6,
    variacoes: [
      { tamanho_ml: 500, nome_tamanho: "500ml", preco_centavos: 1900 },
      { tamanho_ml: 350, nome_tamanho: "350ml", preco_centavos: 1600 },
    ],
    imagem_url: "/images/caldos/creme-de-abobora.jpeg",
  },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const response = await fetch("https://api.caldosesopacg.com/api/v1/produtos")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const responseJson = await response.json();
        const produtos = responseJson.data || [];
        setProducts(produtos);
        setFilteredProducts(produtos);
      } catch (error) {
        console.error("Erro ao carregar produtos da API, usando dados mockados:", error)
        setError("Usando dados de exemplo - API indisponível")
        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <PageLoadingSkeleton />
  }

  return (
    <ErrorBoundary fallback={DefaultErrorFallback}>
      <div className="min-h-screen bg-cynthia-cream">
        <FloatingLeaves />
        <Header />
        {/* Hero Section Melhorado */}
        <section className="relative h-96 bg-gradient-to-br from-cynthia-green-dark via-cynthia-green-dark/90 to-cynthia-green-dark text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          {/* Padrão decorativo animado */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-cynthia-yellow-mustard via-cynthia-orange-pumpkin to-cynthia-yellow-mustard">
            <div className="flex items-center justify-center h-full space-x-8 animate-slide-in-left">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="text-cynthia-green-dark text-2xl animate-float hover:scale-125 transition-transform duration-300 cursor-pointer"
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
              <Badge className="mb-4 bg-cynthia-yellow-mustard text-cynthia-green-dark hover:scale-105 transition-transform duration-300">
                <Zap className="w-3 h-3 mr-1" />✨ Artesanal & Natural
              </Badge>
              <h1 className="text-5xl font-bold mb-6 text-white">
                Sabor que aquece
                <span className="block text-cynthia-yellow-mustard animate-pulse">sua alma</span>
              </h1>
              <p className="text-xl opacity-90 mb-8 text-cynthia-cream">
                Caldos artesanais feitos com amor e ingredientes frescos, entregues quentinhos na sua casa
              </p>
              <Button
                size="lg"
                className="bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/80 text-white px-8 py-4 text-lg animate-pulse-soft hover:scale-105 transition-all duration-300 font-semibold shadow-xl"
              >
                Experimente Agora! 🍲
              </Button>
            </div>
          </div>
        </section>
        {/* Alert de Promoção Melhorado */}
        <section className="container mx-auto px-4 py-4">
          <Alert className="border-cynthia-yellow-mustard bg-gradient-to-r from-cynthia-yellow-mustard/10 to-cynthia-orange-pumpkin/10 hover:scale-[1.02] transition-transform duration-300">
            <Info className="h-4 w-4 text-cynthia-orange-pumpkin animate-pulse" />
            <AlertDescription className="text-cynthia-green-dark font-medium">
              <strong>🎉 Oferta especial:</strong> Frete grátis para pedidos acima de R$ 30,00!
              <span className="ml-2 text-cynthia-orange-pumpkin font-bold">🚚 Aproveite!</span>
            </AlertDescription>
          </Alert>
        </section>
        {/* API Error Alert */}
        {error && (
          <section className="container mx-auto px-4 pb-4">
            <Alert className="border-yellow-400 bg-yellow-50">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">{error}</AlertDescription>
            </Alert>
          </section>
        )}
        {/* Products Grid */}
        <section className="container mx-auto px-4 pb-12" id="cardapio">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-cynthia-green-dark mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up hover:scale-[1.02] transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
          <Separator className="my-12 bg-cynthia-yellow-mustard/30" />
          {/* Why Choose Us Section Melhorado */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-xl border border-cynthia-yellow-mustard/30 animate-fade-in-up hover:shadow-2xl transition-shadow duration-500">
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
                  description: "Produtos frescos e selecionados diariamente",
                  delay: "0.1s",
                },
                {
                  icon: <Clock className="w-8 h-8 text-cynthia-orange-pumpkin" />,
                  title: "Entrega Rápida",
                  description: "Seu caldo quentinho em até 30 minutos",
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
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up border border-cynthia-yellow-mustard/20 group cursor-pointer"
                  style={{ animationDelay: item.delay }}
                >
                  <div
                    className="bg-cynthia-yellow-mustard/20 p-4 rounded-full mb-4 animate-float border border-cynthia-yellow-mustard/30 group-hover:bg-cynthia-yellow-mustard/30 transition-colors duration-300"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-cynthia-green-dark group-hover:text-cynthia-orange-pumpkin transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
          {/* CTA Section Melhorado */}
          <section className="text-center mb-20 animate-fade-in-up">
            <div className="bg-gradient-to-r from-cynthia-yellow-mustard to-cynthia-orange-pumpkin rounded-2xl p-8 text-cynthia-green-dark shadow-xl border border-cynthia-orange-pumpkin/30 hover:scale-[1.02] transition-transform duration-300">
              <Badge className="mb-4 bg-cynthia-orange-pumpkin text-white hover:scale-105 transition-transform duration-300">
                🔥 Oferta Limitada
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Pronto para se aquecer?</h2>
              <p className="text-xl mb-6 opacity-90">
                Experimente nossos caldos artesanais agora mesmo e sinta o carinho em cada colherada!
              </p>
              <Button
                size="lg"
                className="bg-cynthia-green-dark text-white hover:bg-cynthia-green-dark/80 px-8 py-4 text-lg font-semibold hover:scale-110 transition-all duration-300 animate-pulse-soft shadow-xl"
                onClick={() => {
                  document.querySelector(".grid")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }}
              >
                Peça agora mesmo! 🔥
              </Button>
            </div>
          </section>
        </section>
        <Footer />
        <MobileNavbar />
      </div>
    </ErrorBoundary>
  )
}
