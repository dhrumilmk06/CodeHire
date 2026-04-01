import { useState, useEffect, useRef } from 'react'
import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import { gsap } from '../../lib/animations'

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar fade-in on mount
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 }
      )

      // Shrink + glow on scroll
      const onScroll = () => {
        const scrolled = window.scrollY > 40
        gsap.to(navRef.current, {
          paddingTop: scrolled ? '0.6rem' : '1rem',
          paddingBottom: scrolled ? '0.6rem' : '1rem',
          boxShadow: scrolled ? '0 0 30px rgba(34,197,94,0.06)' : 'none',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        })
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center text-black font-bold text-sm shrink-0">⚡</div>
          <div>
            <div className="text-white font-bold text-lg leading-none">CodeHire</div>
            <div className="text-[#888888] text-xs">Code Together</div>
          </div>
        </div>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features"      className="text-[#888888] hover:text-white text-sm transition-colors duration-200">Features</a>
          <a href="#how-it-works"  className="text-[#888888] hover:text-white text-sm transition-colors duration-200">How it Works</a>
          <a href="#testimonials"  className="text-[#888888] hover:text-white text-sm transition-colors duration-200">Testimonials</a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="hidden md:block text-[#888888] hover:text-white text-sm font-medium transition-colors duration-200">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-[#22c55e] text-black text-sm font-bold px-5 py-2 rounded-lg hover:bg-[#16a34a] hover:scale-105 transition-all duration-200 cursor-pointer">
              Get Started →
            </button>
          </SignUpButton>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#888888] hover:text-white transition-colors duration-200 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-[#111111] border border-[#2a2a2a] rounded-xl px-6 py-4 flex flex-col gap-4">
          <a href="#features"     onClick={() => setMenuOpen(false)} className="text-[#888888] hover:text-white text-sm transition-colors duration-200">Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-[#888888] hover:text-white text-sm transition-colors duration-200">How it Works</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)} className="text-[#888888] hover:text-white text-sm transition-colors duration-200">Testimonials</a>
          <SignInButton mode="modal">
            <button className="text-left text-[#888888] hover:text-white text-sm transition-colors duration-200">Sign In</button>
          </SignInButton>
        </div>
      )}
    </nav>
  )
}

