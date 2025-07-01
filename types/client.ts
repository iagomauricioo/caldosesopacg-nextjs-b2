export interface ClientAddress {
  rua: string
  complemento?: string
  numero: string
  bairro: string
  pontoReferencia?: string
  cep: string
}

export interface Client {
  nome: string
  cpf: string
  telefone: string
  endereco: ClientAddress
}

export interface ClientResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    clienteId: string
    nome: string
    telefone: string
    cpf: string
  }
  timestamp: string
}

export interface ClientFormData {
  nome: string
  cpf: string
  telefone: string
  endereco: ClientAddress
}
