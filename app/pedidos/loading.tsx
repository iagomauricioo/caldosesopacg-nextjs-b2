import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 bg-cynthia-cream/30 min-h-screen">
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-cynthia-green-dark" />
        <span className="ml-2 text-cynthia-green-dark">Carregando pedidos...</span>
      </div>
    </div>
  )
}
