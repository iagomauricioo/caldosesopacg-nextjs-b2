"use client"

import { CartProvider } from "@/contexts/cart-context"

interface ClientCartProviderProps {
  children: React.ReactNode
}

export function ClientCartProvider({ children }: ClientCartProviderProps) {
  return <CartProvider>{children}</CartProvider>
}
