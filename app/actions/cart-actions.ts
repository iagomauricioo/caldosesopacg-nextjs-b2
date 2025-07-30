"use server"

import { revalidatePath } from "next/cache"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  observations?: string
  image?: string
}

export interface ClientData {
  nome: string
  telefone: string
  cpf?: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    cep: string
    complemento?: string
  }
}

export async function validateCEP(cep: string) {
  try {
    const cleanCEP = cep.replace(/\D/g, "")
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)

    if (!response.ok) {
      throw new Error("CEP não encontrado")
    }

    const data = await response.json()

    if (data.erro) {
      throw new Error("CEP inválido")
    }

    return {
      success: true,
      data: {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao validar CEP",
    }
  }
}

export async function calculateDeliveryFee(cep: string) {
  // Simular cálculo de taxa de entrega
  const cleanCEP = cep.replace(/\D/g, "")

  // CEPs de São Miguel dos Campos - entrega grátis
  const freeCEPs = ["57240", "57241", "57242"]
  const isFree = freeCEPs.some((prefix) => cleanCEP.startsWith(prefix))

  return {
    fee: isFree ? 0 : 500, // R$ 5,00 em centavos
    isFree,
  }
}

export async function createPixPayment(orderData: {
  value: number
  description: string
  externalReference: string
}) {
  try {
    const response = await fetch("https://api.caldosesopacg.com/api/v1/cobranca/pix/qrCode/estatico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: orderData.description,
        value: orderData.value,
        expirationSeconds: 300,
        externalReference: orderData.externalReference,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || "Erro ao gerar PIX")
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao gerar PIX",
    }
  }
}

export async function submitOrder(orderData: {
  cliente: {
    nome: string
    telefone: string
    cpf?: string
  }
  endereco: ClientData["endereco"]
  itens: Array<{
    produto_id: string
    quantidade: number
    preco_unitario_centavos: number
    observacoes?: string
  }>
  subtotal_centavos: number
  taxa_entrega_centavos: number
  total_centavos: number
  forma_pagamento: "PIX" | "CREDIT_CARD" | "DINHEIRO"
  troco_para_centavos?: number
  observacoes?: string
  pagamento_id?: string
}) {
  try {
    const response = await fetch("https://api.caldosesopacg.com/api/v1/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    const result = await response.json()

    revalidatePath("/pedidos")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao enviar pedido",
    }
  }
}
