"use client"

import { ErrorBoundary, DefaultErrorFallback } from "@/components/error-boundary"

interface ClientErrorBoundaryProps {
  children: React.ReactNode
}

export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={DefaultErrorFallback}>
      {children}
    </ErrorBoundary>
  )
}
