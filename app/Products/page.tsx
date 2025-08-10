'use client'

import { useState, useMemo, useEffect } from "react"
import { Filter, X, Search, CircleCheck, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { offersData, Offer } from "@/context/offers"

// Import the PricingTier type from cart context to ensure compatibility
import type { PricingTier } from "@/context/cart-context"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

function InputWithIcon({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search..."
        className="pl-9 bg-[#111] border border-[#333] focus-visible:ring-2 focus-visible:ring-cyan-500 text-white placeholder-white/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function PlanSelector({
  isOpen,
  onClose,
  offer,
  onAddToCart
}: {
  isOpen: boolean
  onClose: () => void
  offer: Offer | null
  onAddToCart: (offer: Offer, selectedPricingTier: PricingTier, quantity: number, serverName: string) => void
}) {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'MONTHLY' | 'SEMI_ANNUAL' | 'ANNUAL'>('MONTHLY')
  const [quantity, setQuantity] = useState(1)
  const [serverName, setServerName] = useState('')

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    } else {
      document.removeEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleAddToCart = () => {
    if (offer && serverName.trim()) {
      const selectedTier = offer.pricingTiers.find(tier => tier.billingCycle === selectedBillingCycle)
      if (selectedTier) {
        onAddToCart(offer, selectedTier, quantity, serverName.trim())
        onClose()
        setQuantity(1)
        setServerName('')
      }
    }
  }

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10))
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1))

  if (!isOpen || !offer) return null

  const selectedTier = offer.pricingTiers.find(tier => tier.billingCycle === selectedBillingCycle)
  const totalPrice = selectedTier ? selectedTier.price * quantity : 0

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-dialog-title"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0" />
      <div
        className="relative bg-[#111] border border-[#333] text-white max-w-lg w-full rounded-lg shadow-lg p-6 animate-in zoom-in-95 slide-in-from-bottom-2 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-[#333] mb-4">
          <h2 id="plan-dialog-title" className="text-xl font-semibold text-cyan-300">
            Configure Your VPS
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-[#1a1a1a] h-8 w-8"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Plan Overview */}
          <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#333]">
            <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{offer.description}</p>
            <div className="text-sm text-gray-300">
              <span className="inline-block mr-4">{offer.cpu} vCPU</span>
              <span className="inline-block mr-4">{offer.ram}GB RAM</span>
              <span className="inline-block">{offer.storage}GB SSD</span>
            </div>
          </div>

          {/* Server Name */}
          <div className="space-y-2">
            <label htmlFor="server-name" className="text-sm font-medium text-gray-300">
              Server Name <span className="text-red-400">*</span>
            </label>
            <Input
              id="server-name"
              placeholder="e.g., my-web-server"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="bg-[#0a0a0a] border-[#333] focus-visible:ring-2 focus-visible:ring-cyan-500 text-white"
              maxLength={50}
            />
            <p className="text-xs text-gray-400">
              Choose a name to identify your server (2-50 characters)
            </p>
          </div>

          {/* Billing Cycle Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
              Billing Cycle
            </label>
            <div className="grid grid-cols-1 gap-2">
              {offer.pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedBillingCycle === tier.billingCycle
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-[#333] bg-[#0a0a0a] hover:bg-[#1a1a1a]'
                  }`}
                  onClick={() => setSelectedBillingCycle(tier.billingCycle)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="billing-cycle"
                        checked={selectedBillingCycle === tier.billingCycle}
                        onChange={() => setSelectedBillingCycle(tier.billingCycle)}
                        className="accent-cyan-500"
                      />
                      <div>
                        <div className="font-medium text-white">
                          {tier.billingCycle.charAt(0) + tier.billingCycle.slice(1).toLowerCase().replace('_', ' ')}
                        </div>
                        {tier.discountPercent && (
                          <div className="text-xs text-green-400">
                            Save {tier.discountPercent}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-cyan-300">
                        {tier.displayPrice}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label htmlFor="quantity-input" className="text-sm font-medium text-gray-300">
              Quantity
            </label>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10 border-[#333] bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center w-16 h-10 bg-[#0a0a0a] border border-[#333] rounded-md">
                <span id="quantity-input" className="text-lg font-semibold">{quantity}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= 10}
                className="h-10 w-10 border-[#333] bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center text-sm text-gray-400">
              Maximum 10 instances per order
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-[#333]">
            <span className="text-sm text-gray-300">Total:</span>
            <div className="text-right">
              <span className="text-lg font-semibold text-cyan-300">
                {totalPrice.toLocaleString()} {selectedTier?.currency}
              </span>
              <div className="text-xs text-gray-400">
                {quantity}x {selectedTier?.displayPrice}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#333] bg-transparent hover:bg-[#1a1a1a] text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!serverName.trim()}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function OfferCard({ offer }: { offer: Offer }) {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const { addToCart } = useCart()

  const handleGetStarted = () => {
    setIsPlanModalOpen(true)
  }

  const handleAddToCart = (offer: Offer, selectedPricingTier: PricingTier, quantity: number, serverName: string) => {
    // Create cart item matching the cart context interface
    const cartItem = {
      id: `${offer.id}-${selectedPricingTier.billingCycle}-${serverName}`,
      offer: offer,
      selectedTier: selectedPricingTier,
      quantity: quantity
    }
    
    addToCart(cartItem.offer, cartItem.selectedTier, cartItem.quantity)
    
    const button = document.activeElement as HTMLElement
    if (button) {
      button.style.transform = 'scale(0.95)'
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 150)
    }
  }

  // Get the monthly price for display
  const monthlyTier = offer.pricingTiers.find(tier => tier.billingCycle === 'MONTHLY')
  const displayPrice = monthlyTier?.displayPrice || offer.pricingTiers[0]?.displayPrice

  return (
    <>
      <Card className="bg-neutral-900 shadow-lg h-full flex flex-col p-6 rounded-3xl bg-gradient-to-tr from-[rgba(43,255,255,0.1)] via-[rgba(43,255,255,0.02)] to-[rgba(43,255,255,0.06)] text-white border border-[rgba(43,255,255,0.2)]">
        <CardHeader className="p-0 text-center flex-shrink-0">
          <CardTitle className="font-semibold text-xl leading-tight mb-3 min-h-[3rem] flex items-center justify-center">
            <span className="line-clamp-2">{offer.title}</span>
          </CardTitle>
          <CardDescription className="text-sm font-normal text-gray-400 mb-4 min-h-[2.5rem] flex items-center justify-center">
            <span className="line-clamp-2">{offer.description}</span>
          </CardDescription>
          <div className="text-4xl font-bold mb-2 text-cyan-300 whitespace-nowrap overflow-hidden text-ellipsis">
            {displayPrice}
          </div>
        </CardHeader>
        <hr className="border-[rgba(255,255,255,0.2)] flex-shrink-0" />
        <CardContent className="p-0 flex-grow flex flex-col">
          <h2 className="text-white text-lg font-semibold mb-4 flex-shrink-0">What you will get</h2>
          <div className="flex-grow">
            <ul className="space-y-3">
              {offer.features.map((feature: string, featureIndex: number) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <CircleCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed flex-1">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <div className="flex-shrink-0">
          <Button
            onClick={handleGetStarted}
            className="relative group overflow-hidden w-full py-3
              hover:cursor-pointer text-foreground
              border border-white/15 hover:bg-[rgba(255,255,255,0.08)]
              bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.0)]
              rounded-2xl transition-all duration-200 font-medium"
          >
            <div className="absolute w-[250%] h-16 bg-gradient-to-r from-white/75 to-white/15 rotate-45
                          left-[-150%] bottom-[-100%] opacity-0
                          transition-all duration-400 ease-in-out
                          group-hover:opacity-100 group-hover:left-0 group-hover:bottom-[100%] pointer-events-none z-0">
            </div>
            Get Started
          </Button>
        </div>
      </Card>
      <PlanSelector
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        offer={offer}
        onAddToCart={handleAddToCart}
      />
    </>
  )
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterCategory {
  name: string;
  key: string;
  options: FilterOption[];
}

const locations: FilterOption[] = [
  { value: "Algeria", label: "Algeria" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
]

const useCases: FilterOption[] = [
  { value: "Personal Projects", label: "Personal Projects" },
  { value: "Small Business", label: "Small Business" },
  { value: "Web Applications", label: "Web Applications" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "Small Websites", label: "Small Websites" },
  { value: "Development", label: "Development" },
  { value: "Portfolio Sites", label: "Portfolio Sites" },
  { value: "Small Databases", label: "Small Databases" },
]

const providers: FilterOption[] = [
  { value: "not available yet", label: "Not Available Yet" },
  { value: "ADEX Cloud", label: "ADEX Cloud" },
  { value: "ISSAL Net", label: "ISSAL Net" },
  { value: "Ayrade", label: "Ayrade" },
  { value: "Icosnet", label: "Icosnet" },
]

const filterCategories: FilterCategory[] = [
  {
    name: "Use Case",
    key: "useCase",
    options: useCases
  },
  {
    name: "Provider", 
    key: "provider",
    options: providers
  },
  {
    name: "Locations",
    key: "location",
    options: locations
  }
]

export default function VPSOffersPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Use the offers data directly since it now matches our interface
  const Offers: Offer[] = offersData

  const handleFilterChange = (category: string, option: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const categoryFilters = prev[category] || []
      return checked
        ? { ...prev, [category]: [...categoryFilters, option] }
        : { ...prev, [category]: categoryFilters.filter(item => item !== option) }
    })
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  const getCategorySelectedCount = (categoryKey: string) => {
    return selectedFilters[categoryKey]?.length || 0
  }

  const getActiveFilterCount = () => Object.values(selectedFilters).flat().length

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedFilters({})
  }

  const filteredOffers = useMemo(() => {
    return Offers.filter((offer) => {
      const searchLower = searchTerm.toLowerCase()
      const searchMatch = searchTerm === "" ||
        offer.title.toLowerCase().includes(searchLower) ||
        offer.description.toLowerCase().includes(searchLower) ||
        offer.provider.toLowerCase().includes(searchLower) ||
        offer.features.some(feature => feature.toLowerCase().includes(searchLower))

      const providerFilters = selectedFilters.provider || []
      const providerMatch = providerFilters.length === 0 ||
        providerFilters.includes(offer.provider)

      const locationFilters = selectedFilters.location || []
      const locationMatch = locationFilters.length === 0 ||
        locationFilters.includes(offer.location)

      const useCaseFilters = selectedFilters.useCase || []
      const useCaseMatch = useCaseFilters.length === 0 ||
        useCaseFilters.some(ucf => offer.useCase.includes(ucf))

      return searchMatch && providerMatch && locationMatch && useCaseMatch
    })
  }, [searchTerm, selectedFilters, Offers])

  const hasActiveFilters = searchTerm || getActiveFilterCount() > 0

  return (
    <div className="min-h-screen bg-black pt-20 pb-6 text-foreground">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 px-4 sm:px-6 lg:px-8">
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
          )}

          <div className="lg:hidden mb-6">
            <div className="flex flex-col gap-3">
              <InputWithIcon value={searchTerm} onChange={setSearchTerm} />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-sm font-medium hover:bg-[#1c1c1c] transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>
                <div className="text-sm text-gray-400">
                  {filteredOffers.length} of {Offers.length} offers
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="self-start text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          <aside className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-full bg-black lg:bg-transparent border-r lg:border-r-0 border-[#333] transform transition-transform duration-300 ease-in-out z-50 lg:z-auto flex flex-col p-6 lg:pr-0 lg:pl-0 overflow-y-auto ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden absolute top-4 right-4 p-2 hover:bg-[#1c1c1c] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full px-2 flex flex-col gap-4 mt-8 lg:mt-0">
              <div className="mb-1 hidden lg:block">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-lg">Filter VPS</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <InputWithIcon value={searchTerm} onChange={setSearchTerm} />
                <div className="h-5 flex items-center mt-2">
                  <p className={`text-xs text-white/50 transition-opacity duration-200 ${hasActiveFilters ? 'opacity-100' : 'opacity-0'}`}>
                    Found {filteredOffers.length} results
                  </p>
                </div>
              </div>

              <div className="mb-1 lg:hidden">
                <p className="font-bold text-lg mb-4">Filters</p>
                {hasActiveFilters && (
                  <div className="text-xs text-white/50 mb-4">
                    Found {filteredOffers.length} results
                  </div>
                )}
              </div>

              <hr className="border-[#333]" />

              <div className="flex flex-col gap-3">
                {filterCategories.map((category, categoryIndex) => {
                  const isExpanded = expandedCategories[category.key]
                  const selectedCount = getCategorySelectedCount(category.key)
                  return (
                    <div key={categoryIndex} className="flex flex-col">
                      <button
                        onClick={() => toggleCategory(category.key)}
                        className="flex items-center justify-between p-3 bg-[#111] hover:bg-[#1a1a1a] rounded-lg border border-[#333] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{category.name}</span>
                          {selectedCount > 0 && (
                            <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {selectedCount}
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-white/50" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/50" />
                        )}
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-[#0a0a0a] border border-[#333] rounded-lg overflow-hidden">
                          <div>
                            {category.options.map((option: FilterOption, optionIndex: number) => {
                              const isSelected = selectedFilters[category.key]?.includes(option.value) || false
                              return (
                                <div
                                  key={optionIndex}
                                  className={`flex items-center px-4 py-2 hover:bg-[#1a1a1a] cursor-pointer border-b border-[#333] last:border-b-0 transition-colors ${isSelected ? "bg-cyan-900/20" : ""}`}
                                  onClick={() => handleFilterChange(category.key, option.value, !isSelected)}
                                >
                                  <input
                                    type="checkbox"
                                    id={`${category.key}-${optionIndex}`}
                                    className="accent-cyan-500 w-4 h-4 mr-3"
                                    checked={isSelected}
                                    onChange={(e) => handleFilterChange(category.key, option.value, e.target.checked)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <label
                                    htmlFor={`${category.key}-${optionIndex}`}
                                    className={`cursor-pointer text-sm flex-1 select-none transition-colors ${isSelected ? "font-medium text-cyan-300" : "text-white/80"}`}
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-medium transition-colors mt-6"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <main className="pb-6">
            <div className="mb-4 hidden lg:block">
              <div className="text-sm text-gray-400">
                Showing {filteredOffers.length} of {Offers.length} VPS offers
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 transition-all duration-300">
              {filteredOffers.map((offer) => (
                <div key={offer.id} className="animate-in fade-in duration-300">
                  <OfferCard offer={offer} />
                </div>
              ))}
            </div>

            {filteredOffers.length === 0 && (
              <div className="text-center py-12 text-gray-400 animate-in fade-in duration-300">
                <p className="text-lg mb-2">No VPS offers found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}