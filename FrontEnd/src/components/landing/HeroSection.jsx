import { SignUpButton } from '@clerk/clerk-react'

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-[#0a0a0a] flex items-center pt-20 relative overflow-hidden">

      {/* Background green glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#22c55e]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium px-4 py-2 rounded-full">
              <span>⚡</span>
              <span>Real-time Collaboration</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Code Together,
              <br />
              <span className="text-[#22c55e]">Learn Together</span>
            </h1>

            {/* Subtext */}
            <p className="text-[#888888] text-lg leading-relaxed mb-8 max-w-lg">
              The ultimate platform for collaborative coding interviews and pair programming.
              Connect face-to-face, code in real-time, and ace your technical interviews.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['✓ Live Video Chat', '✓ Code Editor', '✓ Multi-Language'].map(f => (
                <span key={f} className="text-[#888888] text-sm border border-[#2a2a2a] rounded-full px-4 py-1.5">
                  {f}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <SignUpButton mode="modal">
                <button className="bg-[#22c55e] text-black font-bold px-8 py-3.5 rounded-xl text-base hover:bg-[#16a34a] transition-colors duration-200 shadow-[0_0_30px_rgba(34,197,94,0.2)] cursor-pointer">
                  Start Coding Now →
                </button>
              </SignUpButton>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 border border-[#2a2a2a] text-white font-medium px-8 py-3.5 rounded-xl text-base hover:border-[#22c55e] hover:text-[#22c55e] transition-all duration-200"
              >
                <span>▶</span>
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-[#2a2a2a]">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '50K+', label: 'Sessions' },
                { value: '99.9%', label: 'Uptime' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-[#22c55e]">{stat.value}</div>
                  <div className="text-[#888888] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Code Editor Mockup */}
          <div className="hidden lg:block">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.1)]">
              {/* Editor header */}
              <div className="bg-[#0a0a0a] border-b border-[#2a2a2a] px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="text-[#888888] text-xs ml-4 font-mono">twoSum.js — CodeHire Session</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
                  <span className="text-[#22c55e] text-xs font-mono">LIVE</span>
                </div>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div>
                  <span className="text-purple-400">function </span>
                  <span className="text-yellow-300">twoSum</span>
                  <span className="text-white">(nums, target) {'{'}</span>
                </div>
                <div className="pl-6">
                  <span className="text-purple-400">const </span>
                  <span className="text-blue-300">map</span>
                  <span className="text-white"> = {'{'}{'}'};</span>
                </div>
                <div className="pl-6">
                  <span className="text-purple-400">for </span>
                  <span className="text-white">(</span>
                  <span className="text-purple-400">let </span>
                  <span className="text-blue-300">i</span>
                  <span className="text-white"> = 0; i {'<'} nums.length; i++) {'{'}</span>
                </div>
                <div className="pl-12">
                  <span className="text-purple-400">const </span>
                  <span className="text-blue-300">comp</span>
                  <span className="text-white"> = target - nums[i];</span>
                </div>
                <div className="pl-12">
                  <span className="text-purple-400">if </span>
                  <span className="text-white">(map[comp] !== </span>
                  <span className="text-purple-400">undefined</span>
                  <span className="text-white">) {'{'}</span>
                </div>
                <div className="pl-16">
                  <span className="text-purple-400">return </span>
                  <span className="text-white">[map[comp], i];</span>
                </div>
                <div className="pl-12 text-white">{'}'}</div>
                <div className="pl-12">
                  <span className="text-white">map[nums[i]] = i;</span>
                </div>
                <div className="pl-6 text-white">{'}'}</div>
                <div className="text-white">{'}'}</div>

                {/* Live indicator */}
                <div className="mt-6 p-3 bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-lg flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {['A', 'B'].map(u => (
                      <div key={u} className="w-6 h-6 rounded-full bg-[#22c55e] border-2 border-[#111111] flex items-center justify-center text-black text-[10px] font-black">{u}</div>
                    ))}
                  </div>
                  <span className="text-[#22c55e] text-xs">2 developers coding live</span>
                </div>
              </div>

              {/* Output panel */}
              <div className="border-t border-[#2a2a2a] px-6 py-4 bg-[#0a0a0a]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#555555] text-xs font-mono uppercase tracking-widest">Output</span>
                  <span className="ml-auto text-[#22c55e] text-xs font-mono">✓ All tests passed</span>
                </div>
                <div className="font-mono text-xs text-[#22c55e]">[0, 1]</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
