import LandingNavbar       from '../components/landing/LandingNavbar'
import HeroSection         from '../components/landing/HeroSection'
import TrustedBySection    from '../components/landing/TrustedBySection'
import FeaturesSection     from '../components/landing/FeaturesSection'
import HowItWorksSection   from '../components/landing/HowItWorksSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import CTASection          from '../components/landing/CTASection'
import LandingFooter       from '../components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <LandingNavbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </div>
  )
}
