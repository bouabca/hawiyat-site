import HeroSection from "@/components/HomePage/HeroSection"
import StatsSection from "@/components/HomePage/StatsSection"

import UnifiedSupportFeatures from "@/components/HomePage/SuportFeaturesSection"
export default function HomePage() {
  return (
    <main className="bg-black">
      <HeroSection />
      <StatsSection />
      <UnifiedSupportFeatures />
      {/* Add other sections here as needed */}
    </main>
  )
}
