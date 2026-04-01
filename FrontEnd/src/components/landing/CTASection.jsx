import { useEffect, useRef } from 'react'
import { SignUpButton } from '@clerk/clerk-react'
import { gsap } from '../../lib/animations'

export default function CTASection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
      })

      tl.fromTo('.cta-badge',
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      )
      .fromTo('.cta-heading',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2'
      )
      .fromTo('.cta-sub',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3'
      )
      .fromTo('.cta-buttons',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2'
      )
      .fromTo('.cta-trust span',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }, '-=0.1'
      )

      // Glow pulse on the background blob
      gsap.to('.cta-glow', {
        scale: 1.2, opacity: 0.8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', once: false }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#050505] py-24 border-t border-[#2a2a2a]">
      <div className="max-w-4xl mx-auto px-6 text-center relative">

        {/* Animated glow blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="cta-glow w-96 h-96 bg-[#22c55e]/6 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="cta-badge inline-flex items-center gap-2 mb-6 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium px-4 py-2 rounded-full">
            🚀 Get Started Today
          </div>

          <h2 className="cta-heading text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Ace Your<br />
            <span className="text-[#22c55e]">Next Interview?</span>
          </h2>

          <p className="cta-sub text-[#888888] text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers and companies using CodeHire for better technical interviews.
          </p>

          <div className="cta-buttons flex flex-wrap justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="bg-[#22c55e] text-black font-bold px-10 py-4 rounded-xl text-base hover:bg-[#16a34a] hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(34,197,94,0.3)] cursor-pointer">
                Get Started Free →
              </button>
            </SignUpButton>
            <a href="#how-it-works" className="border border-[#2a2a2a] text-white font-medium px-10 py-4 rounded-xl text-base hover:border-[#22c55e] hover:text-[#22c55e] hover:scale-105 transition-all duration-200">
              Learn More
            </a>
          </div>

          <div className="cta-trust flex flex-wrap justify-center gap-6 mt-10">
            {['✓ Free to start', '✓ No credit card required', '✓ 10K+ developers'].map(item => (
              <span key={item} className="text-[#555555] text-sm">{item}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
