"use client"

import { EnhancedToastProvider } from "@/components/enhanced-toast"

interface ClientEnhancedToastProviderProps {
  children: React.ReactNode
}

export function ClientEnhancedToastProvider({ children }: ClientEnhancedToastProviderProps) {
  return <EnhancedToastProvider>{children}</EnhancedToastProvider>
} 