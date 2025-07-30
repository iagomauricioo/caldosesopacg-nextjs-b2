import type { Product } from "@/types/product"

// Dados mock dos produtos
const mockProducts: Product[] = [
  {
    id: 1,
    nome: "Caldo de Galinha",
    descricao: "Caldo tradicional de galinha caipira com temperos especiais",
    categoria: "Caldos Tradicionais",
    imagem_url: "/images/caldos/caldo-de-galinha.png",
    disponivel: true,
    variacoes: [
      {
        id: 1,
        produto_id: 1,
        tamanho_ml: 300,
        nome_tamanho: "Pequeno",
        preco_centavos: 1200,
        disponivel: true,
      },
      {
        id: 2,
        produto_id: 1,
        tamanho_ml: 500,
        nome_tamanho: "Médio",
        preco_centavos: 1800,
        disponivel: true,
      },
    ],
  },
  {
    id: 2,
    nome: "Caldo de Kenga",
    descricao: "Caldo especial com kenga e temperos regionais",
    categoria: "Caldos Especiais",
    imagem_url: "/images/caldos/caldo-de-kenga.png",
    disponivel: true,
    variacoes: [
      {
        id: 3,
        produto_id: 2,
        tamanho_ml: 300,
        nome_tamanho: "Pequeno",
        preco_centavos: 1400,
        disponivel: true,
      },
      {
        id: 4,
        produto_id: 2,
        tamanho_ml: 500,
        nome_tamanho: "Médio",
        preco_centavos: 2000,
        disponivel: true,
      },
    ],
  },
]

export async function getProducts(): Promise<Product[]> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockProducts
}

export async function getProductById(id: number): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 50))

  return mockProducts.find((product) => product.id === id) || null
}

export async function searchProducts(query: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!query.trim()) {
    return mockProducts
  }

  return mockProducts.filter(
    (product) =>
      product.nome.toLowerCase().includes(query.toLowerCase()) ||
      product.descricao.toLowerCase().includes(query.toLowerCase()) ||
      product.categoria.toLowerCase().includes(query.toLowerCase()),
  )
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!category || category === "all") {
    return mockProducts
  }

  return mockProducts.filter((product) => product.categoria.toLowerCase() === category.toLowerCase())
}
