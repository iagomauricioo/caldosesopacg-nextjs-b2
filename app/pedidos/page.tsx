"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Filter,
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  Smartphone,
  Banknote,
  Eye,
  Calendar,
  User,
  MapPin,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Cliente {
  nome: string
  telefone: string
  cpf: string
}

interface Endereco {
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cep: string
  ponto_referencia?: string
}

interface ItemPedido {
  id: number
  produto_id: number
  quantidade: number
  preco_unitario_centavos: number
  observacoes?: string
}

interface Pedido {
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

interface PedidosResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    pedidos: Pedido[]
  }
  timestamp: string
}

const statusConfig = {
  recebido: {
    label: "Recebido",
    color: "bg-cynthia-green-leaf text-white",
    icon: Package,
  },
  preparando: {
    label: "Preparando",
    color: "bg-cynthia-yellow-mustard text-cynthia-green-dark",
    icon: Clock,
  },
  saiu_entrega: {
    label: "Saiu para Entrega",
    color: "bg-cynthia-orange-pumpkin text-white",
    icon: Truck,
  },
  entregue: {
    label: "Entregue",
    color: "bg-cynthia-green-dark text-white",
    icon: CheckCircle,
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-500 text-white",
    icon: XCircle,
  },
}

const paymentConfig = {
  PIX: {
    label: "PIX",
    icon: Smartphone,
    color: "bg-cynthia-green-leaf/20 text-cynthia-green-dark border-cynthia-green-leaf/30",
  },
  CREDIT_CARD: {
    label: "Cartão",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  DINHEIRO: {
    label: "Dinheiro",
    icon: Banknote,
    color: "bg-cynthia-yellow-mustard/20 text-cynthia-green-dark border-cynthia-yellow-mustard/30",
  },
}

const paymentStatusConfig = {
  pendente: {
    label: "Pendente",
    color: "bg-cynthia-orange-pumpkin/20 text-cynthia-orange-pumpkin border-cynthia-orange-pumpkin/30",
  },
  aprovado: {
    label: "Aprovado",
    color: "bg-cynthia-green-leaf/20 text-cynthia-green-dark border-cynthia-green-leaf/30",
  },
  rejeitado: {
    label: "Rejeitado",
    color: "bg-red-200 text-red-800 border-red-300",
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-200",
  },
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [paymentFilter, setPaymentFilter] = useState<string>("todos")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("todos")
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const { toast } = useToast()

  const fetchPedidos = async () => {
    console.log("📦 Buscando pedidos...")
    try {
      setLoading(true)

      const response = await fetch("https://api.caldosesopacg.com/api/v1/pedidos")
      console.log("📡 Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data: PedidosResponse = await response.json()
      console.log("✅ Pedidos recebidos:", data)

      if (data.success && data.data.pedidos) {
        setPedidos(data.data.pedidos)
        setFilteredPedidos(data.data.pedidos)
        console.log(`📊 Total de pedidos: ${data.data.pedidos.length}`)
      } else {
        throw new Error(data.message || "Erro ao buscar pedidos")
      }
    } catch (error) {
      console.error("❌ Erro ao buscar pedidos:", error)
      toast({
        title: "Erro ao Carregar",
        description: "Não foi possível carregar os pedidos. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePedidoStatus = async (pedidoId: number, newStatus: Pedido["status"]) => {
    console.log(`🔄 Atualizando status do pedido ${pedidoId} para ${newStatus}`)
    try {
      const response = await fetch(`https://api.caldosesopacg.com/api/v1/pedidos/${pedidoId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Status atualizado:", result)

      // Atualizar a lista local
      setPedidos((prev) => prev.map((p) => (p.id === pedidoId ? { ...p, status: newStatus } : p)))

      setFilteredPedidos((prev) => prev.map((p) => (p.id === pedidoId ? { ...p, status: newStatus } : p)))

      toast({
        title: "Status Atualizado!",
        description: `Pedido #${pedidoId} agora está ${statusConfig[newStatus].label.toLowerCase()}.`,
      })
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error)
      toast({
        title: "Erro na Atualização",
        description: "Não foi possível atualizar o status. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchPedidos()
  }, [])

  useEffect(() => {
    let filtered = pedidos

    // Filtro por busca (ID do pedido, nome do cliente ou telefone)
    if (searchTerm) {
      filtered = filtered.filter(
        (pedido) =>
          pedido.id.toString().includes(searchTerm) ||
          pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pedido.cliente.telefone.includes(searchTerm.replace(/\D/g, "")) ||
          pedido.cliente_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por status do pedido
    if (statusFilter !== "todos") {
      filtered = filtered.filter((pedido) => pedido.status === statusFilter)
    }

    // Filtro por forma de pagamento
    if (paymentFilter !== "todos") {
      filtered = filtered.filter((pedido) => pedido.forma_pagamento === paymentFilter)
    }

    // Filtro por status de pagamento
    if (paymentStatusFilter !== "todos") {
      filtered = filtered.filter((pedido) => pedido.pagamento_status === paymentStatusFilter)
    }

    setFilteredPedidos(filtered)
  }, [pedidos, searchTerm, statusFilter, paymentFilter, paymentStatusFilter])

  const formatCurrency = (centavos: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(centavos / 100)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const formatCEP = (cep: string) => {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const getStatusBadge = (status: Pedido["status"]) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (payment: Pedido["forma_pagamento"]) => {
    const config = paymentConfig[payment]
    const Icon = config.icon
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: Pedido["pagamento_status"]) => {
    const config = paymentStatusConfig[status]
    if (!config) {
      return (
        <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-300">
          Desconhecido
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-cynthia-green-dark" />
          <span className="ml-2 text-cynthia-green-dark">Carregando pedidos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-cynthia-cream/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cynthia-green-dark">Gerenciar Pedidos</h1>
          <p className="text-cynthia-green-dark/70">
            {filteredPedidos.length} de {pedidos.length} pedidos
          </p>
        </div>
        <Button
          onClick={fetchPedidos}
          variant="outline"
          className="border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white bg-transparent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-cynthia-green-dark/20 shadow-lg">
        <CardHeader className="bg-cynthia-yellow-mustard/20">
          <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cynthia-green-dark">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cynthia-green-dark/50 w-4 h-4" />
                <Input
                  placeholder="ID, nome, telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-cynthia-green-dark/30 focus:border-cynthia-green-dark"
                />
              </div>
            </div>

            {/* Status do Pedido */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cynthia-green-dark">Status do Pedido</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-cynthia-green-dark/30 focus:border-cynthia-green-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cynthia-green-dark">Forma de Pagamento</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="border-cynthia-green-dark/30 focus:border-cynthia-green-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Formas</SelectItem>
                  {Object.entries(paymentConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status do Pagamento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cynthia-green-dark">Status do Pagamento</label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="border-cynthia-green-dark/30 focus:border-cynthia-green-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  {Object.entries(paymentStatusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      {filteredPedidos.length === 0 ? (
        <Alert className="border-cynthia-orange-pumpkin/30 bg-cynthia-orange-pumpkin/10">
          <Package className="h-4 w-4 text-cynthia-orange-pumpkin" />
          <AlertDescription className="text-cynthia-green-dark">
            Nenhum pedido encontrado com os filtros aplicados.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {filteredPedidos.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-lg transition-shadow border-cynthia-green-dark/20 bg-white">
              <CardHeader className="bg-cynthia-cream/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-cynthia-green-dark">
                      Pedido #{pedido.id}
                      {getStatusBadge(pedido.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1 text-cynthia-green-dark/70">
                      <Calendar className="w-4 h-4" />
                      {formatDate(pedido.data_pedido)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {getPaymentBadge(pedido.forma_pagamento)}
                    {getPaymentStatusBadge(pedido.pagamento_status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-white space-y-4">
                {/* Informações do Cliente */}
                <div className="bg-cynthia-green-leaf/5 p-4 rounded-lg border border-cynthia-green-leaf/20">
                  <h4 className="font-semibold text-cynthia-green-dark mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Cliente
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-cynthia-green-dark/70">Nome</p>
                      <p className="font-medium text-cynthia-green-dark">{pedido.cliente.nome}</p>
                    </div>
                    <div>
                      <p className="text-cynthia-green-dark/70">Telefone</p>
                      <p className="font-medium text-cynthia-green-dark">{formatPhone(pedido.cliente.telefone)}</p>
                    </div>
                    <div>
                      <p className="text-cynthia-green-dark/70">CPF</p>
                      <p className="font-medium text-cynthia-green-dark">{pedido.cliente.cpf || "Não informado"}</p>
                    </div>
                  </div>
                </div>

                {/* Endereço de Entrega */}
                <div className="bg-cynthia-yellow-mustard/5 p-4 rounded-lg border border-cynthia-yellow-mustard/20">
                  <h4 className="font-semibold text-cynthia-green-dark mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço de Entrega
                  </h4>
                  <div className="text-sm text-cynthia-green-dark">
                    <p>
                      {pedido.endereco.rua}, {pedido.endereco.numero}
                      {pedido.endereco.complemento && ` - ${pedido.endereco.complemento}`}
                    </p>
                    <p>
                      {pedido.endereco.bairro} - CEP: {formatCEP(pedido.endereco.cep)}
                    </p>
                    {pedido.endereco.ponto_referencia && (
                      <p className="text-cynthia-green-dark/70 mt-1">
                        <strong>Referência:</strong> {pedido.endereco.ponto_referencia}
                      </p>
                    )}
                  </div>
                </div>

                {/* Valores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-cynthia-green-dark/70">Subtotal</p>
                    <p className="font-semibold text-cynthia-green-dark">{formatCurrency(pedido.subtotal_centavos)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-cynthia-green-dark/70">Taxa Entrega</p>
                    <p className="font-semibold text-cynthia-green-dark">
                      {pedido.taxa_entrega_centavos > 0 ? (
                        formatCurrency(pedido.taxa_entrega_centavos)
                      ) : (
                        <span className="text-cynthia-green-leaf">Grátis</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-cynthia-green-dark/70">Total</p>
                    <p className="font-bold text-lg text-cynthia-green-dark">{formatCurrency(pedido.total_centavos)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-cynthia-green-dark/70">Itens</p>
                    <p className="font-semibold text-cynthia-green-dark">{pedido.itens.length} item(s)</p>
                  </div>
                </div>

                {pedido.forma_pagamento === "DINHEIRO" && pedido.troco_para_centavos && (
                  <div className="p-3 bg-cynthia-yellow-mustard/20 rounded-lg border border-cynthia-yellow-mustard/30">
                    <p className="text-sm text-cynthia-green-dark">
                      <strong>Troco para:</strong> {formatCurrency(pedido.troco_para_centavos)}
                      <span className="ml-2 text-cynthia-green-dark/70">
                        (Troco: {formatCurrency(pedido.troco_para_centavos - pedido.total_centavos)})
                      </span>
                    </p>
                  </div>
                )}

                {pedido.observacoes && (
                  <div className="p-3 bg-cynthia-green-leaf/10 rounded-lg border border-cynthia-green-leaf/30">
                    <p className="text-sm text-cynthia-green-dark flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Observações:</strong> {pedido.observacoes}
                      </span>
                    </p>
                  </div>
                )}

                <Separator className="border-cynthia-green-dark/20" />

                <div className="flex flex-wrap gap-2">
                  {pedido.status === "recebido" && (
                    <Button
                      size="sm"
                      onClick={() => updatePedidoStatus(pedido.id, "preparando")}
                      className="bg-cynthia-yellow-mustard hover:bg-cynthia-yellow-mustard/90 text-cynthia-green-dark"
                    >
                      Iniciar Preparo
                    </Button>
                  )}
                  {pedido.status === "preparando" && (
                    <Button
                      size="sm"
                      onClick={() => updatePedidoStatus(pedido.id, "saiu_entrega")}
                      className="bg-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin/90 text-white"
                    >
                      Saiu para Entrega
                    </Button>
                  )}
                  {pedido.status === "saiu_entrega" && (
                    <Button
                      size="sm"
                      onClick={() => updatePedidoStatus(pedido.id, "entregue")}
                      className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/90 text-white"
                    >
                      Marcar como Entregue
                    </Button>
                  )}
                  {pedido.status !== "cancelado" && pedido.status !== "entregue" && (
                    <Button size="sm" variant="destructive" onClick={() => updatePedidoStatus(pedido.id, "cancelado")}>
                      Cancelar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPedido(pedido)}
                    className="border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border-cynthia-green-dark/30 shadow-2xl">
            <CardHeader className="bg-cynthia-cream">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-cynthia-green-dark">Detalhes do Pedido #{selectedPedido.id}</CardTitle>
                  <CardDescription className="text-cynthia-green-dark/70">
                    {formatDate(selectedPedido.data_pedido)}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPedido(null)}
                  className="border-cynthia-green-dark text-cynthia-green-dark hover:bg-cynthia-green-dark hover:text-white"
                >
                  Fechar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 bg-white">
              {/* Status e Pagamento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-cynthia-green-dark/70">Status do Pedido</p>
                  {getStatusBadge(selectedPedido.status)}
                </div>
                <div>
                  <p className="text-sm text-cynthia-green-dark/70">Pagamento</p>
                  <div className="flex gap-2">
                    {getPaymentBadge(selectedPedido.forma_pagamento)}
                    {getPaymentStatusBadge(selectedPedido.pagamento_status)}
                  </div>
                </div>
              </div>

              <Separator className="border-cynthia-green-dark/20" />

              {/* Informações Completas do Cliente */}
              <div>
                <h4 className="font-semibold mb-3 text-cynthia-green-dark flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Cliente
                </h4>
                <div className="bg-cynthia-green-leaf/5 p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-cynthia-green-dark/70">Nome Completo</p>
                      <p className="font-medium text-cynthia-green-dark">{selectedPedido.cliente.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cynthia-green-dark/70">Telefone</p>
                      <p className="font-medium text-cynthia-green-dark">
                        {formatPhone(selectedPedido.cliente.telefone)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-cynthia-green-dark/70">CPF</p>
                    <p className="font-medium text-cynthia-green-dark">
                      {selectedPedido.cliente.cpf || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-cynthia-green-dark/70">ID do Cliente</p>
                    <p className="font-mono text-xs text-cynthia-green-dark">{selectedPedido.cliente_id}</p>
                  </div>
                </div>
              </div>

              <Separator className="border-cynthia-green-dark/20" />

              {/* Endereço Completo */}
              <div>
                <h4 className="font-semibold mb-3 text-cynthia-green-dark flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço de Entrega
                </h4>
                <div className="bg-cynthia-yellow-mustard/5 p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-cynthia-green-dark/70">Rua e Número</p>
                      <p className="font-medium text-cynthia-green-dark">
                        {selectedPedido.endereco.rua}, {selectedPedido.endereco.numero}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-cynthia-green-dark/70">Bairro</p>
                      <p className="font-medium text-cynthia-green-dark">{selectedPedido.endereco.bairro}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-cynthia-green-dark/70">CEP</p>
                      <p className="font-medium text-cynthia-green-dark">{formatCEP(selectedPedido.endereco.cep)}</p>
                    </div>
                    {selectedPedido.endereco.complemento && (
                      <div>
                        <p className="text-sm text-cynthia-green-dark/70">Complemento</p>
                        <p className="font-medium text-cynthia-green-dark">{selectedPedido.endereco.complemento}</p>
                      </div>
                    )}
                  </div>
                  {selectedPedido.endereco.ponto_referencia && (
                    <div>
                      <p className="text-sm text-cynthia-green-dark/70">Ponto de Referência</p>
                      <p className="font-medium text-cynthia-green-dark">{selectedPedido.endereco.ponto_referencia}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="border-cynthia-green-dark/20" />

              {/* Valores Detalhados */}
              <div>
                <h4 className="font-semibold mb-3 text-cynthia-green-dark">Valores</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-cynthia-green-dark">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedPedido.subtotal_centavos)}</span>
                  </div>
                  <div className="flex justify-between text-cynthia-green-dark">
                    <span>Taxa de Entrega:</span>
                    <span className="font-medium">{formatCurrency(selectedPedido.taxa_entrega_centavos)}</span>
                  </div>
                  <Separator className="border-cynthia-green-dark/20" />
                  <div className="flex justify-between font-bold text-lg text-cynthia-green-dark">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedPedido.total_centavos)}</span>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              {(selectedPedido.pagamento_id || selectedPedido.data_entrega || selectedPedido.observacoes) && (
                <>
                  <Separator className="border-cynthia-green-dark/20" />
                  <div className="space-y-4">
                    {selectedPedido.pagamento_id && (
                      <div>
                        <h4 className="font-semibold mb-2 text-cynthia-green-dark">ID do Pagamento</h4>
                        <p className="text-sm font-mono text-cynthia-green-dark bg-gray-50 p-2 rounded">
                          {selectedPedido.pagamento_id}
                        </p>
                      </div>
                    )}

                    {selectedPedido.data_entrega && (
                      <div>
                        <h4 className="font-semibold mb-2 text-cynthia-green-dark">Data de Entrega</h4>
                        <p className="text-sm text-cynthia-green-dark">{formatDate(selectedPedido.data_entrega)}</p>
                      </div>
                    )}

                    {selectedPedido.observacoes && (
                      <div>
                        <h4 className="font-semibold mb-2 text-cynthia-green-dark">Observações</h4>
                        <p className="text-sm text-cynthia-green-dark bg-cynthia-green-leaf/5 p-3 rounded">
                          {selectedPedido.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
//