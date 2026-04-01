import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/animations'

export default function FeaturesSection() {
  const features = [
    { icon: '📹', title: 'HD Video Call',      description: 'Crystal clear video and audio for seamless communication during interviews' },
    { icon: '💻', title: 'Live Code Editor',   description: 'Collaborate in real-time with syntax highlighting and multiple language support' },
    { icon: '👥', title: 'Easy Collaboration', description: 'Share your screen, discuss solutions, and learn from each other in real-time' },
    { icon: '🤖', title: 'AI Code Hints',      description: 'Get intelligent hints powered by AI to guide candidates without giving away answers' },
    { icon: '📊', title: 'Auto Scoring',       description: 'Automatically evaluate solutions against hidden test cases for objective assessment' },
    { icon: '📄', title: 'Report Card',        description: 'Generate beautiful PDF reports with AI code review and interview summary' },
  ]

  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fades up
      gsap.fromTo('.features-header',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.features-header', start: 'top 85%', once: true } }
      )

      // Cards: staggered scale-in with slight y offset
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.65, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.features-grid', start: 'top 80%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="bg-[#0a0a0a] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="features-header text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium px-4 py-2 rounded-full">
            ✨ Features
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Everything You Need to{' '}
            <span className="text-[#22c55e]">Succeed</span>
          </h2>
          <p className="text-[#888888] text-lg max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* Cards */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 group cursor-default hover:-translate-y-2 hover:border-[#22c55e] hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl mb-4 bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-2xl group-hover:bg-[#22c55e]/20 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#22c55e] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-[#888888] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
