"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  resetError: () => void
}

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-white to-cynthia-yellow-light/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-cynthia-yellow-mustard/30 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-cynthia-orange-pumpkin/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-cynthia-orange-pumpkin" />
          </div>
          <CardTitle className="text-2xl font-bold text-cynthia-green-dark">Ops! Algo deu errado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4 animate-bounce">🍲</div>
          <p className="text-gray-600 mb-6">
            Nossos caldos estão quentinhos, mas nosso sistema esfriou um pouco. Não se preocupe, vamos resolver isso
            rapidinho!
          </p>

          {error && (
            <details className="text-left bg-gray-50 p-3 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">Detalhes técnicos</summary>
              <code className="text-red-600 break-all">{error.message}</code>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={resetError}
              className="flex-1 bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 border-cynthia-orange-pumpkin text-cynthia-orange-pumpkin hover:bg-cynthia-orange-pumpkin hover:text-white bg-transparent"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Ir para Início
              </Link>
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">Se o problema persistir, entre em contato conosco pelo WhatsApp</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para usar em componentes funcionais
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo)
    // Aqui você pode enviar o erro para um serviço de monitoramento
  }
}

// Componente de erro para páginas específicas
export function PageError({
  title = "Página não encontrada",
  description = "A página que você está procurando não existe ou foi movida.",
  showHomeButton = true,
}: {
  title?: string
  description?: string
  showHomeButton?: boolean
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cynthia-cream via-white to-cynthia-yellow-light/20 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-bounce">🔍</div>
        <h1 className="text-3xl font-bold text-cynthia-green-dark mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>

        {showHomeButton && (
          <Button asChild className="bg-cynthia-green-dark hover:bg-cynthia-green-dark/80 text-white">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
