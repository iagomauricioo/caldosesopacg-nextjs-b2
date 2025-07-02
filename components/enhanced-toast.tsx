"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle, X, AlertCircle, Info, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info" | "warning"
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

interface EnhancedToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void
  showProductAddedToast: (productName: string, size: string) => void
}

const EnhancedToastContext = createContext<EnhancedToastContextType | null>(null)

export function EnhancedToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const router = useRouter()

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, duration: 4000, ...toast }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, newToast.duration)
  }, [])

  const showProductAddedToast = useCallback(
    (productName: string, size: string) => {
      showToast({
        title: "Produto adicionado!",
        description: `${productName} (${size})`,
        type: "success",
        action: {
          label: "Ver Carrinho",
          onClick: () => router.push("/carrinho"),
        },
      })
    },
    [showToast, router],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <EnhancedToastContext.Provider value={{ showToast, showProductAddedToast }}>
      {children}

      {/* Enhanced Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 p-4 rounded-lg shadow-lg border
              transform transition-all duration-300 ease-in-out
              animate-slide-in-right
              ${getStyles(toast.type)}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              {toast.description && <p className="text-xs mt-1 opacity-90">{toast.description}</p>}

              {toast.action && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toast.action.onClick}
                  className="mt-2 h-7 text-xs border-current hover:bg-current hover:text-white bg-transparent"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  {toast.action.label}
                </Button>
              )}
            </div>

            <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </EnhancedToastContext.Provider>
  )
}

export function useEnhancedToast() {
  const context = useContext(EnhancedToastContext)
  if (!context) {
    throw new Error("useEnhancedToast must be used within an EnhancedToastProvider")
  }
  return context
}
