import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/animations'

export default function HowItWorksSection() {
  const steps = [
    { number: '01', title: 'Sign Up',        description: 'Create your account as a host or candidate in under a minute' },
    { number: '02', title: 'Create Session', description: 'Host creates an interview session and shares the invite code' },
    { number: '03', title: 'Code Together',  description: 'Collaborate in real-time with live video, code editor and AI hints' },
    { number: '04', title: 'Get Report',     description: 'Receive an AI-powered report card with scores and feedback' },
  ]

  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.hiw-header',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.hiw-header', start: 'top 85%', once: true } }
      )

      // Connector line draws in
      gsap.fromTo('.hiw-line',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.2, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.hiw-steps', start: 'top 80%', once: true } }
      )

      // Step circles pop in first, then text fades up
      gsap.fromTo('.step-circle',
        { opacity: 0, scale: 0.4, y: 20 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.6, stagger: 0.15, ease: 'back.out(2)',
          scrollTrigger: { trigger: '.hiw-steps', start: 'top 80%', once: true },
        }
      )
      gsap.fromTo('.step-text',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.15, ease: 'power2.out',
          delay: 0.4,
          scrollTrigger: { trigger: '.hiw-steps', start: 'top 80%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-[#050505] py-24 border-y border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="hiw-header text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium px-4 py-2 rounded-full">
            🔄 How It Works
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Get Started in{' '}
            <span className="text-[#22c55e]">4 Simple Steps</span>
          </h2>
          <p className="text-[#888888] text-lg max-w-xl mx-auto">
            From signup to your first interview in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="hiw-steps grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">

          {/* Animated connector line */}
          <div className="hiw-line hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-transparent via-[#22c55e]/40 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="step-circle w-16 h-16 rounded-full mb-6 bg-[#22c55e] text-black flex items-center justify-center text-xl font-black shadow-[0_0_20px_rgba(34,197,94,0.35)] relative z-10 hover:scale-110 hover:shadow-[0_0_40px_rgba(34,197,94,0.55)] transition-all duration-300 cursor-default">
                {step.number}
              </div>
              <div className="step-text">
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-[#888888] text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
