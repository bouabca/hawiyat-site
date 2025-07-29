"use client"
import { Filter as FilterIcon, X, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface FilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedFilters: { [key: string]: string[] }
  setSelectedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>
  filteredTemplatesCount: number
  showFilters: boolean
  setShowFilters: (show: boolean) => void
}

const filterCategories = [
  {
    name: "Use Case",
    options: [
      "AI", "Starter", "Ecommerce", "Blog", "Edge Functions", "Edge Middleware",
      "Edge Config", "Portfolio", "SaaS", "CMS", "Cron", "Multi-tenant apps",
      "Realtime Apps", "Documentation", "Virtual Event", "Monorepos", "Web3",
    ],
  },
  { name: "Framework", options: ["Next.js", "React", "Vue", "Angular", "Svelte"] },
  { name: "CSS", options: ["Tailwind CSS", "CSS Modules", "Emotion", "Styled Components"] },
  { name: "Database", options: ["PostgreSQL", "MongoDB", "Redis", "PlanetScale", "Supabase", "MySQL"] },
  { name: "CMS", options: ["Contentful", "Sanity", "Strapi", "DatoCMS"] },
  { name: "Authentication", options: ["NextAuth.js", "Clerk", "Auth0", "Supabase Auth"] },
  { name: "Analytics", options: ["Hawiyat Analytics", "Google Analytics", "Plausible"] },
  { name: "Infrastructure", options: ["Self-hosted", "Cloud", "Database", "Storage", "Automation"] },
]

export default function Filter({
  searchQuery,
  setSearchQuery,
  selectedFilters,
  setSelectedFilters,
  filteredTemplatesCount,
  showFilters,
  setShowFilters
}: FilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({})

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedFilters({})
  }

  const getActiveFilterCount = () => Object.values(selectedFilters).flat().length

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

  const getCategorySelectedCount = (categoryName: string) => {
    return selectedFilters[categoryName]?.length || 0
  }

  return (
    <>
      {/* Mobile search and filter button */}
      <div className="lg:hidden px-4 sm:px-6 mb-6">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-[#111] border border-[#333] rounded-lg p-3 flex items-center gap-2 text-sm font-medium hover:bg-[#1c1c1c] transition-colors relative shrink-0"
          >
            <FilterIcon className="w-4 h-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
      )}

      {/* Filters sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-full bg-gray-950 lg:bg-transparent border-r lg:border-r-0 border-[#333] transform transition-transform duration-300 ease-in-out z-50 lg:z-auto ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col px-6 lg:pr-0 lg:pl-8 overflow-y-auto`}>
        <button
          onClick={() => setShowFilters(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-[#1c1c1c] rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-full lg:max-w-sm flex flex-col gap-4 px-2 mt-8 lg:mt-0">
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-lg sm:text-xl">Filter Templates</p>
              {(getActiveFilterCount() > 0 || searchQuery) && (
                <button onClick={clearAllFilters} className="text-xs text-cyan-400 hover:text-cyan-300">
                  Clear all
                </button>
              )}
            </div>
            
            {/* Desktop search */}
            <div className="w-full hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-white/50 mt-2 min-h-[1.25rem]">
                {(searchQuery || getActiveFilterCount() > 0) && `Found ${filteredTemplatesCount} results`}
              </p>
            </div>
          </div>
          
          <hr className="border-[#333]" />
          
          {/* Filter Categories with Dropdowns */}
          <div className="flex flex-col gap-3">
            {filterCategories.map((category, index) => {
              const isExpanded = expandedCategories[category.name]
              const selectedCount = getCategorySelectedCount(category.name)
              
              return (
                <div key={index} className="flex flex-col">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
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
                  
                  {/* Dropdown Content */}
                  {isExpanded && (
                    <div className="mt-2 bg-[#0a0a0a] border border-[#333] rounded-lg overflow-hidden">
                      <div className="">
                        {category.options.map((option, optIndex) => {
                          const isSelected = selectedFilters[category.name]?.includes(option) || false
                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center px-4 py-2 hover:bg-[#1a1a1a] cursor-pointer border-b border-[#333] last:border-b-0 ${isSelected ? "bg-cyan-900/20" : ""}`}
                              onClick={() => handleFilterChange(category.name, option, !isSelected)}
                            >
                              <input
                                type="checkbox"
                                id={`${category.name}-${optIndex}`}
                                className="accent-cyan-500 w-4 h-4 mr-3"
                                checked={isSelected}
                                onChange={(e) => handleFilterChange(category.name, option, e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <label
                                htmlFor={`${category.name}-${optIndex}`}
                                className={`cursor-pointer text-sm flex-1 select-none ${isSelected ? "font-medium text-cyan-300" : "text-white/80"}`}
                              >
                                {option}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}