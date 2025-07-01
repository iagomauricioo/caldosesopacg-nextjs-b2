"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { CartItem, Product, ProductVariation, DeliveryAddress, PaymentMethod } from "@/types/product"

interface CartState {
  items: CartItem[]
  deliveryAddress: DeliveryAddress
  paymentMethod: PaymentMethod | null
  deliveryFee: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; variation: ProductVariation } }
  | { type: "REMOVE_ITEM"; payload: { productId: number; variationSize: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; variationSize: number; quantity: number } }
  | { type: "SET_DELIVERY_ADDRESS"; payload: DeliveryAddress }
  | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_FROM_STORAGE"; payload: CartState }

const initialState: CartState = {
  items: [],
  deliveryAddress: {
    cep: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  },
  paymentMethod: null,
  deliveryFee: 500, // R$ 5,00 em centavos
}

// Chaves para localStorage
const STORAGE_KEYS = {
  CART_ITEMS: "cynthia-cart-items",
  DELIVERY_ADDRESS: "cynthia-delivery-address",
  PAYMENT_METHOD: "cynthia-payment-method",
}

// Funções para localStorage
const saveToStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error)
    }
  }
}

const loadFromStorage = (key: string) => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Erro ao carregar do localStorage:", error)
      return null
    }
  }
  return null
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState

  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return action.payload

    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.variation.tamanho_ml === action.payload.variation.tamanho_ml,
      )

      if (existingItemIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += 1
        newState = { ...state, items: newItems }
      } else {
        newState = {
          ...state,
          items: [
            ...state.items,
            {
              product: action.payload.product,
              variation: action.payload.variation,
              quantity: 1,
            },
          ],
        }
      }
      saveToStorage(STORAGE_KEYS.CART_ITEMS, newState.items)
      return newState
    }

    case "REMOVE_ITEM": {
      newState = {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product.id === action.payload.productId && item.variation.tamanho_ml === action.payload.variationSize
            ),
        ),
      }
      saveToStorage(STORAGE_KEYS.CART_ITEMS, newState.items)
      return newState
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        newState = {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === action.payload.productId &&
                item.variation.tamanho_ml === action.payload.variationSize
              ),
          ),
        }
      } else {
        newState = {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.productId && item.variation.tamanho_ml === action.payload.variationSize
              ? { ...item, quantity: action.payload.quantity }
              : item,
          ),
        }
      }
      saveToStorage(STORAGE_KEYS.CART_ITEMS, newState.items)
      return newState
    }

    case "SET_DELIVERY_ADDRESS":
      newState = { ...state, deliveryAddress: action.payload }
      saveToStorage(STORAGE_KEYS.DELIVERY_ADDRESS, newState.deliveryAddress)
      return newState

    case "SET_PAYMENT_METHOD":
      newState = { ...state, paymentMethod: action.payload }
      saveToStorage(STORAGE_KEYS.PAYMENT_METHOD, newState.paymentMethod)
      return newState

    case "CLEAR_CART":
      // Limpar localStorage
      Object.values(STORAGE_KEYS).forEach((key) => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(key)
        }
      })
      return initialState

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedItems = loadFromStorage(STORAGE_KEYS.CART_ITEMS) || []
    const savedAddress = loadFromStorage(STORAGE_KEYS.DELIVERY_ADDRESS) || initialState.deliveryAddress
    const savedPaymentMethod = loadFromStorage(STORAGE_KEYS.PAYMENT_METHOD)

    const savedState: CartState = {
      items: savedItems,
      deliveryAddress: savedAddress,
      paymentMethod: savedPaymentMethod,
      deliveryFee: initialState.deliveryFee,
    }

    dispatch({ type: "LOAD_FROM_STORAGE", payload: savedState })
  }, [])

  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      return total + item.variation.preco_centavos * item.quantity
    }, 0)
  }

  const getTotal = () => {
    return getSubtotal() + state.deliveryFee
  }

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ state, dispatch, getSubtotal, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
