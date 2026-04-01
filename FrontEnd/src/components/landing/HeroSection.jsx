import { useEffect, useRef, useState } from 'react'
import { SignUpButton } from '@clerk/clerk-react'
import { gsap, animateCountUp } from '../../lib/animations'

// ─── Syntax token definitions for twoSum ─────────────────────────────────────
const CODE_LINES = [
  [
    { text: 'function ', color: '#c084fc' },
    { text: 'twoSum', color: '#fde047' },
    { text: '(', color: '#e2e8f0' },
    { text: 'nums', color: '#93c5fd' },
    { text: ', ', color: '#e2e8f0' },
    { text: 'target', color: '#93c5fd' },
    { text: ') {', color: '#e2e8f0' },
  ],
  [
    { text: '  const ', color: '#c084fc' },
    { text: 'map', color: '#93c5fd' },
    { text: ' = {};', color: '#e2e8f0' },
  ],
  [
    { text: '  for ', color: '#c084fc' },
    { text: '(', color: '#e2e8f0' },
    { text: 'let ', color: '#c084fc' },
    { text: 'i ', color: '#93c5fd' },
    { text: '= ', color: '#e2e8f0' },
    { text: '0', color: '#f97316' },
    { text: '; i < nums.length; i++) {', color: '#e2e8f0' },
  ],
  [
    { text: '    const ', color: '#c084fc' },
    { text: 'comp ', color: '#93c5fd' },
    { text: '= target - nums[i];', color: '#e2e8f0' },
  ],
  [
    { text: '    if ', color: '#c084fc' },
    { text: '(map[comp] ', color: '#e2e8f0' },
    { text: '!== ', color: '#c084fc' },
    { text: 'undefined', color: '#c084fc' },
    { text: ') {', color: '#e2e8f0' },
  ],
  [
    { text: '      return ', color: '#c084fc' },
    { text: '[map[comp], i];', color: '#e2e8f0' },
  ],
  [{ text: '    }', color: '#e2e8f0' }],
  [
    { text: '    map', color: '#93c5fd' },
    { text: '[nums[i]] = i;', color: '#e2e8f0' },
  ],
  [{ text: '  }', color: '#e2e8f0' }],
  [{ text: '}', color: '#e2e8f0' }],
]

// Pre-compute cumulative char offset for each line
const LINE_OFFSETS = (() => {
  let offset = 0
  return CODE_LINES.map(tokens => {
    const start = offset
    tokens.forEach(tok => { offset += tok.text.length })
    offset++ // newline
    return start
  })
})()

const LINE_LENGTHS = CODE_LINES.map(tokens =>
  tokens.reduce((sum, tok) => sum + tok.text.length, 0)
)

const TOTAL_CHARS = LINE_OFFSETS[LINE_OFFSETS.length - 1] + LINE_LENGTHS[LINE_LENGTHS.length - 1]

// ─── AnimatedCodeEditor ───────────────────────────────────────────────────────
function AnimatedCodeEditor({ onDone }) {
  const [charCount, setCharCount] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    // Small delay to let the GSAP slide-in finish first
    const startDelay = setTimeout(() => {
      let count = 0

      const tick = () => {
        if (count >= TOTAL_CHARS) {
          setIsDone(true)
          onDone?.()
          return
        }
        count++
        setCharCount(count)
        // Variable speed: newlines pause longer, normal chars ~28ms + jitter
        const jitter = Math.random() * 16 - 8
        timerRef.current = setTimeout(tick, 28 + jitter)
      }

      timerRef.current = setTimeout(tick, 0)
    }, 1200) // wait 1.2s for GSAP animation to finish

    return () => {
      clearTimeout(startDelay)
      clearTimeout(timerRef.current)
    }
  }, []) // runs once on mount

  // Determine active line (which line cursor is on)
  const activeLine = (() => {
    for (let i = CODE_LINES.length - 1; i >= 0; i--) {
      if (charCount >= LINE_OFFSETS[i]) return i
    }
    return 0
  })()

  return (
    <div className="p-5 font-mono text-[13px] leading-7 min-h-[310px] overflow-hidden">
      <style>{`
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        .type-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #22c55e;
          vertical-align: text-bottom;
          margin-left: 1px;
          animation: blink 1s step-end infinite;
        }
      `}</style>

      {CODE_LINES.map((tokens, lineIdx) => {
        const lineStart  = LINE_OFFSETS[lineIdx]
        const lineLength = LINE_LENGTHS[lineIdx]

        // Line not reached yet — don't render
        if (charCount < lineStart && !isDone) return null

        // How many chars of this line have been typed
        const typed = isDone
          ? lineLength
          : Math.min(lineLength, charCount - lineStart)

        const isActive = !isDone && activeLine === lineIdx

        let remaining = typed
        const renderedTokens = []
        for (const tok of tokens) {
          if (remaining <= 0) break
          const visible = tok.text.slice(0, remaining)
          renderedTokens.push({ text: visible, color: tok.color })
          remaining -= visible.length
        }

        return (
          <div
            key={lineIdx}
            className="whitespace-pre flex items-center"
            style={{
              background: isActive ? 'rgba(34,197,94,0.05)' : 'transparent',
              borderLeft: isActive ? '2px solid #22c55e' : '2px solid transparent',
              paddingLeft: '6px',
              transition: 'background 0.1s ease',
            }}
          >
            {/* Line number */}
            <span className="select-none mr-4 w-4 text-right shrink-0" style={{ color: '#3a3a3a', fontSize: '11px' }}>
              {lineIdx + 1}
            </span>

            {/* Code tokens */}
            <span>
              {renderedTokens.map((tok, ti) => (
                <span key={ti} style={{ color: tok.color }}>{tok.text}</span>
              ))}
              {/* Blinking cursor only while typing this line */}
              {isActive && typed < lineLength && (
                <span className="type-cursor" />
              )}
            </span>
          </div>
        )
      })}

      {/* Live users row — fades in after half the code is typed */}
      <div
        className="mt-4 p-3 bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-lg flex items-center gap-3"
        style={{
          opacity: charCount >= Math.floor(TOTAL_CHARS / 2) ? 1 : 0,
          transform: charCount >= Math.floor(TOTAL_CHARS / 2) ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          pointerEvents: charCount >= Math.floor(TOTAL_CHARS / 2) ? 'auto' : 'none',
        }}
      >
        <div className="flex -space-x-1">
          {[{ l: 'A', bg: '#22c55e' }, { l: 'B', bg: '#3b82f6' }].map(u => (
            <div
              key={u.l}
              className="w-6 h-6 rounded-full border-2 border-[#0d1117] flex items-center justify-center text-black text-[10px] font-black"
              style={{ background: u.bg }}
            >
              {u.l}
            </div>
          ))}
        </div>
        <span className="text-[#22c55e] text-xs font-mono">2 developers coding live</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
          <span className="text-[#555555] text-xs font-mono">synced</span>
        </div>
      </div>

    </div>
  )
}

// ─── HeroSection ──────────────────────────────────────────────────────────────
export default function HeroSection() {
  // Tracks typing completion to fade in the status bar
  const [editorDone, setEditorDone] = useState(false)
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const statsRef   = useRef(null)
  const pillsRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left: stagger slide-in from left
      gsap.fromTo(
        leftRef.current.querySelectorAll('.hero-item'),
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 95%', once: true } }
      )

      // Pills bounce
      gsap.fromTo(
        pillsRef.current.querySelectorAll('span'),
        { opacity: 0, y: 18, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08,
          ease: 'back.out(1.5)', delay: 0.55,
          scrollTrigger: { trigger: pillsRef.current, start: 'top 95%', once: true } }
      )

      // Editor slides in from right (typing starts after 1.2s regardless)
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: rightRef.current, start: 'top 95%', once: true } }
      )


      // Stats count-up
      const values = ['10K+', '50K+', '99.9%']
      statsRef.current.querySelectorAll('.stat-value').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, delay: i * 0.15,
            scrollTrigger: { trigger: statsRef.current, start: 'top 95%', once: true },
            onStart() { animateCountUp(el, values[i], 2) },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#0a0a0a] flex items-center pt-20 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#22c55e]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#22c55e]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left ── */}
          <div ref={leftRef}>
            <div className="hero-item inline-flex items-center gap-2 mb-6 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium px-4 py-2 rounded-full">
              <span>⚡</span><span>Real-time Collaboration</span>
            </div>
            <h1 className="hero-item text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Code Together,<br />
              <span className="text-[#22c55e]">Learn Together</span>
            </h1>
            <p className="hero-item text-[#888888] text-lg leading-relaxed mb-8 max-w-lg">
              The ultimate platform for collaborative coding interviews and pair programming.
              Connect face-to-face, code in real-time, and ace your technical interviews.
            </p>

            <div ref={pillsRef} className="flex flex-wrap gap-3 mb-8">
              {['✓ Live Video Chat', '✓ Code Editor', '✓ Multi-Language'].map(f => (
                <span key={f} className="text-[#888888] text-sm border border-[#2a2a2a] rounded-full px-4 py-1.5 hover:border-[#22c55e]/50 hover:text-[#22c55e] transition-colors duration-200">
                  {f}
                </span>
              ))}
            </div>

            <div className="hero-item flex flex-wrap gap-4 mb-12">
              <SignUpButton mode="modal">
                <button className="bg-[#22c55e] text-black font-bold px-8 py-3.5 rounded-xl text-base hover:bg-[#16a34a] hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(34,197,94,0.25)] cursor-pointer">
                  Start Coding Now →
                </button>
              </SignUpButton>
              <a href="#how-it-works" className="flex items-center gap-2 border border-[#2a2a2a] text-white font-medium px-8 py-3.5 rounded-xl hover:border-[#22c55e] hover:text-[#22c55e] hover:scale-105 transition-all duration-200">
                <span>▶</span><span>Watch Demo</span>
              </a>
            </div>

            <div ref={statsRef} className="flex gap-8 pt-4 border-t border-[#2a2a2a]">
              {[{ value: '10K+', label: 'Active Users' }, { value: '50K+', label: 'Sessions' }, { value: '99.9%', label: 'Uptime' }].map(s => (
                <div key={s.label}>
                  <div className="stat-value text-2xl font-black text-[#22c55e]">{s.value}</div>
                  <div className="text-[#888888] text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Editor ── */}
          {/* rightRef handles the GSAP slide-in; inner div handles CSS float */}
          <div ref={rightRef} className="hidden lg:block">
            <div className="editor-float">
            <div className="bg-[#0d1117] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(34,197,94,0.12),0_32px_64px_rgba(0,0,0,0.6)]">

              {/* Title bar */}
              <div className="bg-[#161b22] border-b border-[#2a2a2a] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[#8b949e] text-xs ml-3 font-mono">twoSum.js</span>
                <div className="w-px h-3 bg-[#30363d] mx-2" />
                <span className="text-[#8b949e] text-xs font-mono">CodeHire Session</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                  <span className="text-[#22c55e] text-xs font-mono font-semibold">LIVE</span>
                </div>
              </div>

              {/* Tab bar */}
              <div className="bg-[#161b22] border-b border-[#21262d] px-4 flex items-center gap-1 text-xs">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] border-b-2 border-[#22c55e] text-white font-mono">
                  <span className="text-yellow-400">JS</span>
                  <span>twoSum.js</span>
                </div>
              </div>

              {/* ← Typing animation */}
              <AnimatedCodeEditor onDone={() => setEditorDone(true)} />

              {/* Status bar — fades in when typing completes */}
              <div
                className="bg-[#22c55e] px-4 py-1 flex items-center gap-3 text-black text-xs font-mono"
                style={{
                  opacity: editorDone ? 1 : 0,
                  transform: editorDone ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.9s ease, transform 0.9s ease',
                }}
              >
                <span className="font-bold">● CodeHire</span>
                <span className="opacity-70">JavaScript</span>
                <span className="ml-auto opacity-70">UTF-8</span>
                <span className="opacity-70">Ln 10, Col 1</span>
              </div>
            </div>
            </div>{/* editor-float */}
          </div>

        </div>
      </div>
    </section>
  )
}
