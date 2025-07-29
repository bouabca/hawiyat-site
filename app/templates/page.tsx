"use client"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import TemplateCard from "./Card"
import TemplateCardSkeleton from "./template-card-skeleton"
import Filter from "./Filter"

interface Template {
  id: string
  name: string
  version: string
  description: string
  links: { github?: string; website?: string; docs?: string }
  logo: string
  tags: string[]
}

const INITIAL_LOAD = 12
const BATCH_SIZE = 8

export default function Page() {
  const [showFilters, setShowFilters] = useState(false)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({})
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD)
  const [, setScrollY] = useState(0); // if you still use setScrollY
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Optimized filtering with useMemo
  const filteredTemplates = useMemo(() => {
    let filtered = allTemplates

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    const allSelectedTags = Object.values(selectedFilters).flat()
    if (allSelectedTags.length > 0) {
      filtered = filtered.filter(t =>
        allSelectedTags.some(tag =>
          t.tags.some(tTag => tTag.toLowerCase() === tag.toLowerCase())
        )
      )
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [allTemplates, searchQuery, selectedFilters])

  const displayedTemplates = useMemo(() => 
    filteredTemplates.slice(0, visibleCount),
    [filteredTemplates, visibleCount]
  )

  // Smooth scroll handler for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const throttledScroll = throttle(handleScroll, 16) // 60fps
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  // Fast infinite scroll with intersection observer
  const loadMore = useCallback(async () => {
    if (isLoadingMore || visibleCount >= filteredTemplates.length) return
    
    setIsLoadingMore(true)
    // Simulate network delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 100))
    setVisibleCount(prev => Math.min(prev + BATCH_SIZE, filteredTemplates.length))
    setIsLoadingMore(false)
  }, [isLoadingMore, visibleCount, filteredTemplates.length])

  const lastCardRef = useCallback((node: HTMLDivElement) => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore()
    }, { threshold: 0.5, rootMargin: '200px' })
    if (node) observerRef.current.observe(node)
  }, [loadMore])

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/templates')
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setAllTemplates(Array.isArray(data) ? data : data.templates || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD)
  }, [searchQuery, selectedFilters])

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedFilters({})
  }

  const getActiveFilterCount = () => Object.values(selectedFilters).flat().length

  const transformTemplateForCard = (template: Template) => ({
    id: template.id,
    image: template.logo.startsWith("http") ? template.logo : `/templates/${template.logo}`,
    title: template.name,
    description: template.description,
    author: "Hawiyat",
    link: template.links.website || template.links.github || "#",
    version: template.version,
    tags: template.tags,
    links: template.links,
  })

  return (
    <div className="min-h-screen bg-[#000] text-white relative overflow-hidden">
      {/* Parallax Background */}
      <div className=" inset-0 pointer-events-none z-0">
        <Image
          src="/grid-mesh.svg"
          alt="Grid mesh background"
          width={2000}
          height={2000}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          priority
        />
        <Image
          src="/ell.svg"
          alt="Ellipse background glow"
          width={5000}
          height={4000}
          className="absolute  w-[5000px] h-auto opacity-50"
          style={{ 
            filter: "drop-shadow(0 0 100px rgba(6,182,212,0.4))",
     
          }}
          priority
        />

        <Image
          src="/ell.svg"
          alt="Ellipse background glow"
          width={5000}
          height={4000}
          className="absolute top-[3000px]  w-[5000px] h-auto opacity-50"
          style={{ 
            filter: "drop-shadow(0 0 100px rgba(6,182,212,0.4))",
     
          }}
          priority
        />
     
        <Image
          src="/ell.svg"
          alt="Ellipse background glow"
          width={5000}
          height={4000}
          className="absolute top-[6000px]  w-[5000px] h-auto opacity-50"
          style={{ 
            filter: "drop-shadow(0 0 100px rgba(6,182,212,0.4))",
     
          }}
          priority
        />
      </div>

      <div className="relative z-10 pt-16 lg:pt-10" ref={containerRef}>
        {/* Header with parallax effect */}
        <header 
          className="text-center my-12  px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Find your Template in
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">Hawiyat</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Jumpstart your app development process with pre-built solutions from Hawiyat and our community.
          </p>
          <p className="text-sm text-white/60 mt-4">
            {loading ? "Loading templates..." : `${displayedTemplates.length} of ${filteredTemplates.length} templates`}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 lg:gap-10">
          {/* Filter Component */}
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filteredTemplatesCount={filteredTemplates.length}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Main content */}
          <main className="px-4 sm:px-6 lg:px-8 pb-6 relative min-h-[400px]">
            {error ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-red-400 mb-2">Error loading templates</p>
                  <p className="text-white/70 text-sm">{error}</p>
                </div>
              </div>
            ) : displayedTemplates.length === 0 && !loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-white/70 mb-2">No templates found</p>
                  <p className="text-white/50 text-sm">
                    {searchQuery || getActiveFilterCount() > 0 ? "Try adjusting your search or filters" : "No templates available"}
                  </p>
                  {(searchQuery || getActiveFilterCount() > 0) && (
                    <button onClick={clearAllFilters} className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm">
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {loading
                    ? Array.from({ length: INITIAL_LOAD }).map((_, i) => <TemplateCardSkeleton key={i} />)
                    : displayedTemplates.map((template, index) => (
                        <div
                          key={template.id}
                          ref={index === displayedTemplates.length - 1 ? lastCardRef : null}
                          className="transform transition-all duration-300 hover:scale-105"
                          style={{
                            animationDelay: `${(index % BATCH_SIZE) * 50}ms`,
                            animation: index >= visibleCount - BATCH_SIZE ? 'fadeInUp 0.5s ease-out forwards' : undefined
                          }}
                        >
                          <TemplateCard {...transformTemplateForCard(template)} />
                        </div>
                      ))}
                </div>

                {/* Loading indicator */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="ml-2 text-white/70">Loading more templates...</span>
                  </div>
                )}

                {/* End indicator */}
                {!isLoadingMore && visibleCount >= filteredTemplates.length && filteredTemplates.length > INITIAL_LOAD && (
                  <div className="text-center py-8">
                    <div className="text-white/50 text-sm">
                      ✨ All {filteredTemplates.length} templates loaded
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// Throttle function for smooth scroll performance
function throttle(func: Function, limit: number) {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}