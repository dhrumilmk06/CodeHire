export default function FeaturesSection() {
  const features = [
    {
      icon: '📹',
      title: 'HD Video Call',
      description: 'Crystal clear video and audio for seamless communication during interviews'
    },
    {
      icon: '💻',
      title: 'Live Code Editor',
      description: 'Collaborate in real-time with syntax highlighting and multiple language support'
    },
    {
      icon: '👥',
      title: 'Easy Collaboration',
      description: 'Share your screen, discuss solutions, and learn from each other in real-time'
    },
    {
      icon: '🤖',
      title: 'AI Code Hints',
      description: 'Get intelligent hints powered by AI to guide candidates without giving away answers'
    },
    {
      icon: '📊',
      title: 'Auto Scoring',
      description: 'Automatically evaluate solutions against hidden test cases for objective assessment'
    },
    {
      icon: '📄',
      title: 'Report Card',
      description: 'Generate beautiful PDF reports with AI code review and interview summary'
    }
  ]

  return (
    <section id="features" className="bg-[#0a0a0a] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
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

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 hover:-translate-y-1 hover:scale-[1.02] hover:border-[#22c55e] hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all duration-300 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl mb-4 bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-2xl group-hover:bg-[#22c55e]/20 transition-colors duration-300">
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
