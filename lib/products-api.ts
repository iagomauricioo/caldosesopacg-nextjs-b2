import type { Product } from "@/types/product"

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

export async function getProducts(): Promise<{ products: Product[]; error?: string }> {
  try {
    // Simular delay da API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = await fetch("https://api.caldosesopacg.com/api/v1/produtos", {
      next: { revalidate: 300 }, // Cache por 5 minutos
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseJson = await response.json()
    const products = responseJson.data || []

    return { products }
  } catch (error) {
    console.error("Erro ao carregar produtos da API:", error)
    return {
      products: mockProducts,
      error: "Usando dados de exemplo - API indisponível",
    }
  }
}
