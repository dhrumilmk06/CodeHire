import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/animations'

export default function TrustedBySection() {
  const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Stripe']
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label fades in
      gsap.fromTo('.trusted-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true } }
      )
      // Logos stagger in with a subtle scale bounce
      gsap.fromTo('.trusted-logo',
        { opacity: 0, y: 24, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55, stagger: 0.07, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
          delay: 0.2,
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-16 border-y border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="trusted-label text-center text-[#555555] text-sm mb-10 uppercase tracking-widest font-medium">
          Trusted by developers at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {companies.map(company => (
            <span
              key={company}
              className="trusted-logo text-[#333333] text-xl font-black cursor-default select-none hover:text-[#22c55e] transition-colors duration-300"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
