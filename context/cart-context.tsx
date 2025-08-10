'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface PricingTier {
  id: string
  billingCycle: 'MONTHLY' | 'SEMI_ANNUAL' | 'ANNUAL'
  price: number
  currency: string
  discountPercent?: number
  displayPrice: string
}

export interface Offer {
  id: string
  title: string
  description: string
  features: string[]
  provider: string
  location: string
  useCase: string[]
  cpu: number
  ram: number
  storage: number
  bandwidth: number
  pricingTiers: PricingTier[]
}

export interface CartItem {
  id: string
  offer: Offer
  selectedTier: PricingTier
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  addToCart: (offer: Offer, selectedTier: PricingTier, quantity: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems')
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error('Failed to parse stored cart items:', error)
        localStorage.removeItem('cartItems')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  // Calculate total items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.selectedTier.price * item.quantity)
  }, 0)

  const addToCart = useCallback((offer: Offer, selectedTier: PricingTier, quantity: number) => {
    setCartItems(prevItems => {
      // Create unique ID combining offer ID and billing cycle
      const uniqueId = `${offer.id}-${selectedTier.billingCycle}`
      const existingItem = prevItems.find(item => item.id === uniqueId)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === uniqueId
            ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
            : item
        )
      } else {
        return [...prevItems, { 
          id: uniqueId, 
          offer, 
          selectedTier, 
          quantity: Math.min(quantity, 10) 
        }]
      }
    })
    setIsCartOpen(true) // Open cart sidebar when item is added
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    setIsCartOpen(false)
  }, [])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}