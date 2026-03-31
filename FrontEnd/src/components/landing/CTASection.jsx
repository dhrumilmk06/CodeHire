import { SignUpButton } from '@clerk/clerk-react'

export default function CTASection() {
  return (
    <section className="bg-[#050505] py-24 border-t border-[#2a2a2a]">
      <div className="max-w-4xl mx-auto px-6 text-center relative">

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-[#22c55e]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium px-4 py-2 rounded-full">
            🚀 Get Started Today
          </div>

          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Ace Your
            <br />
            <span className="text-[#22c55e]">Next Interview?</span>
          </h2>

          <p className="text-[#888888] text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers and companies using CodeHire for better technical interviews.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="bg-[#22c55e] text-black font-bold px-10 py-4 rounded-xl text-base hover:bg-[#16a34a] transition-colors duration-200 shadow-[0_0_30px_rgba(34,197,94,0.3)] cursor-pointer">
                Get Started Free →
              </button>
            </SignUpButton>
            <a
              href="#how-it-works"
              className="border border-[#2a2a2a] text-white font-medium px-10 py-4 rounded-xl text-base hover:border-[#22c55e] hover:text-[#22c55e] transition-all duration-200"
            >
              Learn More
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {['✓ Free to start', '✓ No credit card required', '✓ 10K+ developers'].map(item => (
              <span key={item} className="text-[#555555] text-sm">{item}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
