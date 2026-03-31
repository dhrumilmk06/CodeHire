export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account as a host or candidate in under a minute'
    },
    {
      number: '02',
      title: 'Create Session',
      description: 'Host creates an interview session and shares the invite code'
    },
    {
      number: '03',
      title: 'Code Together',
      description: 'Collaborate in real-time with live video, code editor and AI hints'
    },
    {
      number: '04',
      title: 'Get Report',
      description: 'Receive an AI-powered report card with scores and feedback'
    }
  ]

  return (
    <section id="how-it-works" className="bg-[#050505] py-24 border-y border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">

          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-transparent via-[#22c55e]/30 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              {/* Step number circle */}
              <div className="w-16 h-16 rounded-full mb-6 bg-[#22c55e] text-black flex items-center justify-center text-xl font-black shadow-[0_0_20px_rgba(34,197,94,0.3)] relative z-10 hover:scale-110 transition-transform duration-200">
                {step.number}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-[#888888] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  )
}
