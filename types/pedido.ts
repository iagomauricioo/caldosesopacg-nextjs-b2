export interface Cliente {
  nome: string
  telefone: string
  cpf: string
}

export interface Endereco {
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  ponto_referencia?: string
}

export interface ItemPedido {
  id: number
  produto_id: number
  quantidade: number
  preco_unitario_centavos: number
  observacoes?: string
}

export interface Pedido {
  id: number
  cliente_id: string
  endereco_id: number
  cliente: Cliente
  endereco: Endereco
  itens: ItemPedido[]
  subtotal_centavos: number
  taxa_entrega_centavos: number
  total_centavos: number
  forma_pagamento: "PIX" | "CREDIT_CARD" | "DINHEIRO"
  troco_para_centavos: number | null
  status: "recebido" | "preparando" | "saiu_entrega" | "entregue" | "cancelado"
  observacoes: string | null
  data_pedido: string
  data_entrega: string | null
  pagamento_id: string | null
  pagamento_status: "pendente" | "aprovado" | "rejeitado" | "cancelado"
}

export interface PedidosResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    pedidos: Pedido[]
  }
  timestamp: string
}

export interface PedidoStatusUpdate {
  status: Pedido["status"]
}

export interface LoginResponse {
  success: boolean
  statusCode: number
  message: string
  data?: {
    token: string
    user: {
      id: string
      email: string
      nome: string
      role: string
    }
  }
  timestamp: string
}
