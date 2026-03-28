import { useState } from 'react'
import axiosInstance from '../../lib/axios'

export default function SolutionTab({ problem }) {
  const [state, setState]               = useState('locked')
  const [solution, setSolution]         = useState(null)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState('')
  const [selectedLang, setSelectedLang] = useState('javascript')
  const [copied, setCopied]             = useState(false)

  const languages = ['javascript', 'python', 'java', 'cpp']

  const langLabels = {
    javascript: 'JS',
    python:     'PY',
    java:       'Java',
    cpp:        'C++'
  }

  const handleShowSolution = async () => {
    setIsLoading(true)
    setError('')
    setState('loading')

    try {
      const { data } = await axiosInstance.post('ai/solution', {
        problemTitle:       problem.title,
        problemDescription: typeof problem.description === 'object'
          ? problem.description.text
          : problem.description,
        difficulty: problem.difficulty,
        language:   'javascript'
      })

      setSolution(data.solution)
      setState('revealed')

    } catch (err) {
      console.error('Solution Error:', err)
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
      setState('locked')
    } finally {
      setIsLoading(false)
    }
  }



  const handleCopy = () => {
    const code = solution?.solutions?.[selectedLang] || ''
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── State 1 — Locked ──────────────────────────────────────
  if (state === 'locked') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">

        <div className="
          w-16 h-16 rounded-full mb-5
          bg-[#1a1a1a] border border-[#2a2a2a]
          flex items-center justify-center text-3xl
        ">
          🔒
        </div>

        <h3 className="text-white font-bold text-lg mb-2">
          Try solving it yourself first!
        </h3>

        <p className="text-[#888888] text-sm mb-6 max-w-xs leading-relaxed">
          Attempting the problem on your own is the best way
          to learn and grow as a developer.
        </p>

        {error && (
          <div className="
            w-full mb-4
            bg-red-500/10 border border-red-500/30
            rounded-lg px-4 py-2
          ">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}

        <button
          onClick={handleShowSolution}
          className="
            flex items-center gap-2 mb-4
            bg-[#111111] border border-[#22c55e]
            text-[#22c55e] text-sm font-semibold
            px-6 py-2.5 rounded-xl cursor-pointer
            hover:bg-[#22c55e] hover:text-black
            transition-all duration-300
          "
        >
          <span>💡</span>
          <span>Show Solution</span>
        </button>

        <p className="text-[#555555] text-xs max-w-xs">
          ⚠️ Viewing the solution will mark this problem
          as "Viewed Solution"
        </p>

      </div>
    )
  }

  // ── State 2 — Loading ─────────────────────────────────────
  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="text-[#22c55e] text-4xl animate-spin">
          ⟳
        </div>
        <p className="text-[#888888] text-sm">
          ✨ Generating solution...
        </p>
      </div>
    )
  }

  // ── State 3 — Revealed ────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Approach */}
      <div className="
        bg-[#0a0a0a] border border-[#2a2a2a]
        rounded-xl p-4
      ">
        <h4 className="text-[#22c55e] text-sm font-semibold mb-2">
          📖 Approach
        </h4>
        <p className="text-white text-sm leading-relaxed">
          {solution?.approach}
        </p>

        {solution?.keyInsights?.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {solution.keyInsights.map((insight, i) => (
              <li key={i} className="text-[#888888] text-sm flex gap-2">
                <span className="text-[#22c55e] flex-shrink-0">→</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="
          bg-[#0a0a0a] border border-[#2a2a2a]
          rounded-xl p-3
        ">
          <p className="text-[#888888] text-xs mb-1">
            Time Complexity
          </p>
          <p className="text-white text-sm font-semibold font-mono">
            {solution?.timeComplexity}
          </p>
        </div>
        <div className="
          bg-[#0a0a0a] border border-[#2a2a2a]
          rounded-xl p-3
        ">
          <p className="text-[#888888] text-xs mb-1">
            Space Complexity
          </p>
          <p className="text-white text-sm font-semibold font-mono">
            {solution?.spaceComplexity}
          </p>
        </div>
      </div>

      {/* Code Solution */}
      <div className="
        bg-[#0a0a0a] border border-[#2a2a2a]
        rounded-xl overflow-hidden
      ">

        {/* Code header */}
        <div className="
          flex items-center justify-between
          px-4 py-2 border-b border-[#2a2a2a]
        ">
          <h4 className="text-[#22c55e] text-sm font-semibold">
            💻 Solution Code
          </h4>
          <div className="flex gap-1">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`
                  px-2 py-1 rounded text-xs font-medium
                  transition-all duration-200 cursor-pointer
                  ${selectedLang === lang
                    ? 'bg-[#22c55e] text-black'
                    : 'text-[#888888] hover:text-white'
                  }
                `}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Code block */}
        <pre className="
          p-4 text-xs font-mono
          text-[#e6edf3] bg-[#0d1117]
          overflow-x-auto whitespace-pre-wrap
          max-h-80 overflow-y-auto
          leading-relaxed
        ">
          {solution?.solutions?.[selectedLang]
            || '// No solution available for this language'}
        </pre>

      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="
          w-full flex items-center justify-center gap-2
          bg-[#111111] border border-[#2a2a2a]
          text-[#888888] text-sm font-medium
          py-2.5 rounded-xl cursor-pointer
          hover:border-[#22c55e] hover:text-white
          transition-all duration-200
        "
      >
        {copied ? '✅ Copied!' : '📋 Copy Solution'}
      </button>

    </div>
  )
}
