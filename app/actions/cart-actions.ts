"use server"

import { revalidatePath } from "next/cache"

export interface CartItem {
  productId: number
  variationSize: number
  quantity: number
  productName: string
  variationName: string
  priceInCents: number
  imageUrl?: string
}

export interface ClientData {
  nome: string
  telefone: string
  cpf?: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cep: string
    complemento?: string
    pontoReferencia?: string
  }
}

export interface OrderData {
  cliente: {
    nome: string
    telefone: string
    cpf?: string
  }
  endereco: ClientData["endereco"]
  itens: Array<{
    produto_id: number
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
}

export async function searchClientByPhone(telefone: string) {
  try {
    const cleanPhone = telefone.replace(/\D/g, "")
    const response = await fetch(`https://api.caldosesopacg.com/api/v1/clientes/${cleanPhone}`)

    if (response.ok) {
      const data = await response.json()
      return { success: true, data: data.data }
    } else {
      return { success: false, data: null }
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    return { success: false, data: null, error: "Erro ao buscar cliente" }
  }
}

export async function searchClientAddress(telefone: string) {
  try {
    const cleanPhone = telefone.replace(/\D/g, "")
    const response = await fetch(`https://api.caldosesopacg.com/api/v1/clientes/${cleanPhone}/endereco`)

    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    } else {
      return { success: false, data: null }
    }
  } catch (error) {
    console.error("Erro ao buscar endereço:", error)
    return { success: false, data: null, error: "Erro ao buscar endereço" }
  }
}

export async function createClient(clientData: ClientData) {
  try {
    const payload = {
      nome: clientData.nome,
      cpf: clientData.cpf?.replace(/\D/g, "") || null,
      telefone: clientData.telefone.replace(/\D/g, ""),
      endereco: {
        rua: clientData.endereco.rua,
        complemento: clientData.endereco.complemento || "",
        numero: clientData.endereco.numero,
        bairro: clientData.endereco.bairro,
        pontoReferencia: clientData.endereco.pontoReferencia || "",
        cep: clientData.endereco.cep.replace(/\D/g, ""),
      },
    }

    const response = await fetch("https://api.caldosesopacg.com/api/v1/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Erro ao cadastrar cliente")
    }

    const data = await response.json()
    return { success: true, data: data.data }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return { success: false, error: "Erro ao cadastrar cliente" }
  }
}

export async function generatePixPayment(value: number, externalReference: string) {
  try {
    const pixPayload = {
      description: "Pedido Caldos da Cynthia",
      value: Math.round(value),
      expirationSeconds: 300, // 5 minutos
      externalReference,
    }

    const response = await fetch("https://api.caldosesopacg.com/api/v1/cobranca/pix/qrCode/estatico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pixPayload),
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      return { success: true, data: result.data }
    } else {
      throw new Error(result.message || "Erro ao gerar PIX")
    }
  } catch (error) {
    console.error("Erro ao gerar PIX:", error)
    return { success: false, error: "Erro ao gerar PIX" }
  }
}

export async function submitOrder(orderData: OrderData) {
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

    // Revalidar páginas relacionadas
    revalidatePath("/pedidos")
    revalidatePath("/carrinho")

    return { success: true, data: result }
  } catch (error) {
    console.error("Erro ao enviar pedido:", error)
    return { success: false, error: "Erro ao enviar pedido" }
  }
}
