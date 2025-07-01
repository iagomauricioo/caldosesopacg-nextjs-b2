export interface CepResponse {
  cep: string
  estado: string
  cidade: string
  bairro: string
  rua: string
  service: string
  location: {
    type: string
    coordinates: {
      longitude: string
      latitude: string
    }
  }
}

export interface CepError {
  error: string
  message: string
}
