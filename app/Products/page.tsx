"use client"
import { useState, useMemo } from "react"
import { Filter, X, Search, CircleCheck, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as React from "react"
import { cn } from "@/lib/utils"
import { offersData } from "./offers"



// Type definitions
interface Offer {
  title: string
  description: string
  price: string
  features: string[]
  provider: string
}

interface FilterOption {
  value: string
  label: string
}

interface FilterCategory {
  name: string
  key: string
  options: FilterOption[]
}

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

function OfferCard({ offer }: { offer: Offer }) {
  const handleGetStarted = () => {
    window.location.href = '/waitlist'
  }

  return (
    <Card className=" bg-neutral-900 shadow-lg h-full flex flex-col p-6 rounded-3xl bg-gradient-to-tr from-[rgba(43,255,255,0.1)] via-[rgba(43,255,255,0.02)] to-[rgba(43,255,255,0.06)] text-white border border-[rgba(43,255,255,0.2)]">



      <CardHeader className="p-0 text-center flex-shrink-0">
        <CardTitle className="font-semibold text-xl leading-tight mb-3 min-h-[3rem] flex items-center justify-center">
          <span className="line-clamp-2">{offer.title}</span>
        </CardTitle>
        <CardDescription className="text-sm font-normal text-gray-400 mb-4 min-h-[2.5rem] flex items-center justify-center">
          <span className="line-clamp-2">{offer.description}</span>
        </CardDescription>
        <div className="text-4xl font-bold mb-2 text-cyan-300 whitespace-nowrap overflow-hidden text-ellipsis">
          {offer.price}
        </div>
      </CardHeader>

      <hr className="border-[rgba(255,255,255,0.2)] flex-shrink-0" />

      <CardContent className="p-0 flex-grow flex flex-col">
        <h2 className="text-white text-lg font-semibold mb-4 flex-shrink-0">What you will get</h2>

        <div className="flex-grow">
          <ul className="space-y-3">
            {offer.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
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
          bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0)] 
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
  )
}

const locations: FilterOption[] = [
  { name: "Algeria", code: "dz" },
  { name: "Germany", code: "de" },
  { name: "France", code: "fr" },
  { name: "Saudi Arabia", code: "sa" },
].map(loc => ({ value: loc.code, label: loc.name }))

const useCases: FilterOption[] = [
  { value: "comp", label: "Computation" },
  { value: "backup", label: "Backing up" },
  { value: "proxy", label: "Proxying" },
  { value: "tun", label: "VPN Tunneling" },
]

const providers: FilterOption[] = [
  { value: "adex", label: "ADEX Cloud" },
  { value: "issal", label: "ISSAL Net" },
  { value: "ayrade", label: "Ayrade" },
  { value: "icosnet", label: "Icosnet" },
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

const providerMap: Record<string, string> = {
  'adex': 'ADEX Cloud',
  'issal': 'ISSAL Net',
  'ayrade': 'Ayrade',
  'icosnet': 'Icosnet'
}

export default function Page() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

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
    return offersData.filter((offer: Offer) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const searchMatch = searchTerm === "" ||
        offer.title.toLowerCase().includes(searchLower) ||
        offer.description.toLowerCase().includes(searchLower) ||
        offer.provider.toLowerCase().includes(searchLower) ||
        offer.features.some(feature => feature.toLowerCase().includes(searchLower))

      // Provider filter
      const providerFilters = selectedFilters.provider || []
      const providerMatch = providerFilters.length === 0 ||
        providerFilters.some(pf => offer.provider === providerMap[pf])

      return searchMatch && providerMatch
    })
  }, [searchTerm, selectedFilters])

  const hasActiveFilters = searchTerm || getActiveFilterCount() > 0

  return (
    <>
      <div className="min-h-screen bg-black pt-20 pb-6 text-foreground">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 px-4 sm:px-6 lg:px-8">
            {/* Mobile overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
            )}

            {/* Mobile Header with Search and Filter Toggle */}
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
                    {filteredOffers.length} of {offersData.length} offers
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

            {/* Desktop Sidebar / Mobile Slide-out Filters */}
            <aside className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-full bg-black lg:bg-transparent border-r lg:border-r-0 border-[#333] transform transition-transform duration-300 ease-in-out z-50 lg:z-auto flex flex-col p-6 lg:pr-0 lg:pl-0 overflow-y-auto ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden absolute top-4 right-4 p-2 hover:bg-[#1c1c1c] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full px-2 flex flex-col gap-4 mt-8 lg:mt-0">
                {/* Desktop Search */}
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
                  {/* Fixed height container to prevent layout shift */}
                  <div className="h-5 flex items-center mt-2">
                    <p className={`text-xs text-white/50 transition-opacity duration-200 ${hasActiveFilters ? 'opacity-100' : 'opacity-0'}`}>
                      Found {filteredOffers.length} results
                    </p>
                  </div>
                </div>

                {/* Mobile Filter Header */}
                <div className="mb-1 lg:hidden">
                  <p className="font-bold text-lg mb-4">Filters</p>
                  {hasActiveFilters && (
                    <div className="text-xs text-white/50 mb-4">
                      Found {filteredOffers.length} results
                    </div>
                  )}
                </div>

                <hr className="border-[#333]" />

                {/* Filter Categories with Dropdowns */}
                <div className="flex flex-col gap-3">
                  {filterCategories.map((category, index) => {
                    const isExpanded = expandedCategories[category.key]
                    const selectedCount = getCategorySelectedCount(category.key)

                    return (
                      <div key={index} className="flex flex-col">
                        {/* Category Header */}
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

                        {/* Dropdown Content with smooth animation */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-[#0a0a0a] border border-[#333] rounded-lg overflow-hidden">
                            <div>
                              {category.options.map((option, optIndex) => {
                                const isSelected = selectedFilters[category.key]?.includes(option.value) || false
                                return (
                                  <div
                                    key={optIndex}
                                    className={`flex items-center px-4 py-2 hover:bg-[#1a1a1a] cursor-pointer border-b border-[#333] last:border-b-0 transition-colors ${isSelected ? "bg-cyan-900/20" : ""}`}
                                    onClick={() => handleFilterChange(category.key, option.value, !isSelected)}
                                  >
                                    <input
                                      type="checkbox"
                                      id={`${category.key}-${optIndex}`}
                                      className="accent-cyan-500 w-4 h-4 mr-3"
                                      checked={isSelected}
                                      onChange={(e) => handleFilterChange(category.key, option.value, e.target.checked)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <label
                                      htmlFor={`${category.key}-${optIndex}`}
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
              {/* Desktop Results Count */}
              <div className="mb-4 hidden lg:block">
                <div className="text-sm text-gray-400">
                  Showing {filteredOffers.length} of {offersData.length} VPS offers
                </div>
              </div>

              {/* Grid with smooth transitions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 transition-all duration-300">
                {filteredOffers.map((offer: Offer, index: number) => (
                  <div key={`${offer.title}-${index}`} className="animate-in fade-in duration-300">
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
    </>
  )

}