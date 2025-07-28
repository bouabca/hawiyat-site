import HeroSection from "@/components/HomePage/HeroSection"
import StatsSection from "@/components/HomePage/StatsSection"
import HawiyatCompatibility from "@/components/HomePage/hawiyatCompatibilty"
import UnifiedSupportFeatures from "@/components/HomePage/SuportFeaturesSection"
import CustomerFeedback from "@/components/HomePage/CutomersFeedBack"
export default function HomePage() {
  return (
    <main className="bg-black">
      <HeroSection />
      <StatsSection />
      <UnifiedSupportFeatures />
      <HawiyatCompatibility />
      <CustomerFeedback />
      {/* Add other sections here as needed */}
    </main>
  )
}
