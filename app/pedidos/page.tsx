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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Pedido {
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
  recebido: { label: "Recebido", color: "bg-blue-500", icon: Package },
  preparando: { label: "Preparando", color: "bg-yellow-500", icon: Clock },
  saiu_entrega: { label: "Saiu para Entrega", color: "bg-purple-500", icon: Truck },
  entregue: { label: "Entregue", color: "bg-green-500", icon: CheckCircle },
  cancelado: { label: "Cancelado", color: "bg-red-500", icon: XCircle },
}

const paymentConfig = {
  PIX: { label: "PIX", icon: Smartphone, color: "bg-green-100 text-green-800" },
  CREDIT_CARD: { label: "Cartão", icon: CreditCard, color: "bg-blue-100 text-blue-800" },
  DINHEIRO: { label: "Dinheiro", icon: Banknote, color: "bg-yellow-100 text-yellow-800" },
}

const paymentStatusConfig = {
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  pago: { label: "Pago", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [paymentFilter, setPaymentFilter] = useState<string>("todos")
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

    // Filtro por busca (ID do pedido)
    if (searchTerm) {
      filtered = filtered.filter(
        (pedido) =>
          pedido.id.toString().includes(searchTerm) ||
          pedido.cliente_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter((pedido) => pedido.status === statusFilter)
    }

    // Filtro por forma de pagamento
    if (paymentFilter !== "todos") {
      filtered = filtered.filter((pedido) => pedido.forma_pagamento === paymentFilter)
    }

    setFilteredPedidos(filtered)
  }, [pedidos, searchTerm, statusFilter, paymentFilter])

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

  const getStatusBadge = (status: Pedido["status"]) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={`${config.color} text-white`}>
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
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando pedidos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Pedidos</h1>
          <p className="text-muted-foreground">
            {filteredPedidos.length} de {pedidos.length} pedidos
          </p>
        </div>
        <Button onClick={fetchPedidos} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ID do pedido ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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

            {/* Pagamento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pagamento</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      {filteredPedidos.length === 0 ? (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>Nenhum pedido encontrado com os filtros aplicados.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {filteredPedidos.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Pedido #{pedido.id}
                      {getStatusBadge(pedido.status)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
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
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente ID</p>
                    <p className="font-mono text-xs">{pedido.cliente_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="font-semibold">{formatCurrency(pedido.subtotal_centavos)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Entrega</p>
                    <p className="font-semibold">
                      {pedido.taxa_entrega_centavos > 0 ? formatCurrency(pedido.taxa_entrega_centavos) : "Grátis"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-lg">{formatCurrency(pedido.total_centavos)}</p>
                  </div>
                </div>

                {pedido.forma_pagamento === "DINHEIRO" && pedido.troco_para_centavos && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Troco para:</strong> {formatCurrency(pedido.troco_para_centavos)}
                      <span className="ml-2 text-muted-foreground">
                        (Troco: {formatCurrency(pedido.troco_para_centavos - pedido.total_centavos)})
                      </span>
                    </p>
                  </div>
                )}

                {pedido.observacoes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Observações:</strong> {pedido.observacoes}
                    </p>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2">
                  {pedido.status === "recebido" && (
                    <Button size="sm" onClick={() => updatePedidoStatus(pedido.id, "preparando")}>
                      Iniciar Preparo
                    </Button>
                  )}
                  {pedido.status === "preparando" && (
                    <Button size="sm" onClick={() => updatePedidoStatus(pedido.id, "saiu_entrega")}>
                      Saiu para Entrega
                    </Button>
                  )}
                  {pedido.status === "saiu_entrega" && (
                    <Button size="sm" onClick={() => updatePedidoStatus(pedido.id, "entregue")}>
                      Marcar como Entregue
                    </Button>
                  )}
                  {pedido.status !== "cancelado" && pedido.status !== "entregue" && (
                    <Button size="sm" variant="destructive" onClick={() => updatePedidoStatus(pedido.id, "cancelado")}>
                      Cancelar
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setSelectedPedido(pedido)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes (simplificado) */}
      {selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Detalhes do Pedido #{selectedPedido.id}</CardTitle>
                  <CardDescription>{formatDate(selectedPedido.data_pedido)}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedPedido(null)}>
                  Fechar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedPedido.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pagamento</p>
                  <div className="flex gap-2">
                    {getPaymentBadge(selectedPedido.forma_pagamento)}
                    {getPaymentStatusBadge(selectedPedido.pagamento_status)}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Informações do Cliente</h4>
                <p className="text-sm font-mono">{selectedPedido.cliente_id}</p>
                <p className="text-sm text-muted-foreground">Endereço ID: {selectedPedido.endereco_id}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Valores</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedPedido.subtotal_centavos)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Entrega:</span>
                    <span>{formatCurrency(selectedPedido.taxa_entrega_centavos)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedPedido.total_centavos)}</span>
                  </div>
                </div>
              </div>

              {selectedPedido.pagamento_id && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Pagamento</h4>
                    <p className="text-sm font-mono">{selectedPedido.pagamento_id}</p>
                  </div>
                </>
              )}

              {selectedPedido.data_entrega && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Data de Entrega</h4>
                    <p className="text-sm">{formatDate(selectedPedido.data_entrega)}</p>
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
