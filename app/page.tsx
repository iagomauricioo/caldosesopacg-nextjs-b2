import { Suspense } from "react"
import { ClientHeader } from "@/components/client-header"
import { PageLoadingSkeleton } from "@/components/loading-states"
import type { Product } from "@/types/product"
import { Footer } from "@/components/footer"
import { ClientMobileNavbar } from "@/components/client-mobile-navbar"
import { ClientFloatingLeaves } from "@/components/client-floating-leaves"
import { HeroSection } from "@/components/home/hero-section"
import { PromotionAlert } from "@/components/home/promotion-alert"
import { ClientProductsSection } from "@/components/client-products-section"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"
import { ClientCTASection } from "@/components/client-cta-section"
import { getProducts } from "@/lib/products-api"

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

export default async function HomePage() {
  const { products, error } = await getProducts()

  return (
    <div className="min-h-screen bg-cynthia-cream">
      <ClientFloatingLeaves />
      <ClientHeader />

      <HeroSection />
      <PromotionAlert />

      {error && (
        <section className="container mx-auto px-4 pb-4">
          <div className="border-yellow-400 bg-yellow-50 border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 text-yellow-600">ℹ️</div>
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        </section>
      )}

      <Suspense fallback={<PageLoadingSkeleton />}>
        <ClientProductsSection products={products} />
      </Suspense>

      <WhyChooseUsSection />
      <ClientCTASection />

      <Footer />
      <ClientMobileNavbar />
    </div>
  )
}
