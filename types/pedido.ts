export interface Pedido {
  id: number
  cliente_id: string
  endereco_id: number
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
  pagamento_status: "pendente" | "pago" | "cancelado"
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

export interface PedidoStatusResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    id: number
    status: Pedido["status"]
  }
  timestamp: string
}
