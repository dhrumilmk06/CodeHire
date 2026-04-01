import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/animations'

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "CodeHire completely changed how we conduct technical interviews. The real-time collaboration and AI hints make the process so much more effective.",
      name: "Sarah Chen", role: "Engineering Manager", company: "Google", initial: "S"
    },
    {
      quote: "I landed my dream job after practicing on CodeHire. The solution tab and AI feedback helped me improve my problem-solving approach significantly.",
      name: "Marcus Johnson", role: "Software Engineer", company: "Meta", initial: "M"
    },
    {
      quote: "The auto-scoring and report cards save us hours every week. We can evaluate 10x more candidates with better objectivity than before.",
      name: "Priya Patel", role: "Tech Lead", company: "Amazon", initial: "P"
    },
  ]

  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonials-header',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-header', start: 'top 85%', once: true } }
      )

      // Cards slide up with different y values for a wave effect
      gsap.fromTo('.testimonial-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 0.75, stagger: { amount: 0.4, from: 'start' }, ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="bg-[#0a0a0a] py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="testimonials-header text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium px-4 py-2 rounded-full">
            ⭐ Testimonials
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Loved by <span className="text-[#22c55e]">Developers</span>
          </h2>
          <p className="text-[#888888] text-lg max-w-xl mx-auto">
            Join thousands of developers who trust CodeHire
          </p>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col hover:border-[#22c55e]/50 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)] transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <span key={j} className="text-[#22c55e] text-sm">★</span>)}
              </div>
              <p className="text-[#888888] text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#2a2a2a]">
                <div className="w-10 h-10 rounded-full bg-[#22c55e] text-black flex items-center justify-center font-bold text-sm shrink-0">
                  {t.initial}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-[#555555] text-xs">{t.role} at {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
