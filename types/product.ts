export interface ProductVariation {
  tamanho_ml: number
  nome_tamanho: string
  preco_centavos: number
}

export interface Product {
  id: number
  nome: string
  descricao: string
  disponivel: boolean
  ordem_exibicao: number
  variacoes: ProductVariation[]
  imagem_url: string
}

export interface CartItem {
  product: Product
  variation: ProductVariation
  quantity: number
}

export interface DeliveryAddress {
  cep: string
  bairro: string
  rua: string
  numero: string
  complemento: string
}

export type PaymentMethod = "cartao" | "pix" | "dinheiro"
