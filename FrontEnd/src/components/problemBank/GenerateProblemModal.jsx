import { useState } from 'react'
import axiosInstance from '../../lib/axios'

export default function GenerateProblemModal({ onClose, onSaved }) {
  const [step, setStep]                     = useState('configure')
  const [difficulty, setDifficulty]         = useState('')
  const [topic, setTopic]                   = useState('')
  const [companyStyle, setCompanyStyle]     = useState('General')
  const [isGenerating, setIsGenerating]     = useState(false)
  const [isSaving, setIsSaving]             = useState(false)
  const [generatedProblem, setGeneratedProblem] = useState(null)
  const [error, setError]                   = useState('')

  const difficulties = ['Easy', 'Medium', 'Hard']

  const topics = [
    'Arrays', 'Strings', 'Hash Table', 'Two Pointers',
    'Sliding Window', 'Binary Search', 'Linked List',
    'Trees', 'Dynamic Programming', 'Graphs',
    'Stack', 'Queue', 'Recursion', 'Sorting', 'Math'
  ]

  const companies = [
    'General', 'Google', 'Amazon', 'Microsoft',
    'Meta', 'Apple', 'Netflix', 'Uber'
  ]

  const difficultyColor = {
    Easy:   'bg-green-500 text-black',
    Medium: 'bg-yellow-500 text-black',
    Hard:   'bg-red-500 text-white'
  }

  const handleGenerate = async () => {
    if (!difficulty || !topic) {
      setError('Please select difficulty and topic')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const { data } = await axiosInstance.post('/ai/generate-problem', {
        difficulty,
        topic,
        companyStyle
      })

      if (!data.success) {
        setError(String(data.error || 'Failed to generate problem'))
        return
      }

      setGeneratedProblem(data.problem)
      setStep('preview')

    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Something went wrong. Please try again.'
      setError(typeof msg === 'object' ? JSON.stringify(msg) : String(msg))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedProblem) return
    setIsSaving(true)
    setError('')

    try {
      const { data } = await axiosInstance.post('/problems', {
        ...generatedProblem
      })

      setStep('saved')

      // Auto close after 3 seconds
      setTimeout(() => {
        onSaved()
      }, 3000)

    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Could not save problem. Please try again.'
      setError(typeof msg === 'object' ? JSON.stringify(msg) : String(msg))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="
      fixed inset-0 z-50
      bg-black/60
      flex items-center justify-center
      p-4
    ">
      <div className="
        bg-[#111111] border border-[#2a2a2a]
        rounded-2xl w-full max-w-2xl
        max-h-[85vh] flex flex-col
        overflow-hidden
      ">

        {/* Modal Header */}
        <div className="
          flex items-center justify-between
          p-6 border-b border-[#2a2a2a]
          shrink-0
        ">
          <div>
            <h2 className="text-white font-bold text-xl">
              ✨ Generate Problem with AI
            </h2>
            <p className="text-[#888888] text-sm mt-1">
              Let AI create a unique coding problem for your interviews
            </p>
          </div>
          <button
            onClick={onClose}
            className="
              text-[#888888] hover:text-white
              text-xl transition-colors duration-200
              w-8 h-8 flex items-center justify-center
              rounded-lg hover:bg-[#2a2a2a]
            "
          >
            ✕
          </button>
        </div>

        {/* Modal Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ─── STEP 1 — CONFIGURE ─── */}
          {step === 'configure' && (
            <div className="space-y-6">

              {/* Difficulty selector */}
              <div>
                <label className="
                  text-white text-sm font-semibold
                  block mb-3
                ">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {difficulties.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`
                        flex-1 py-2.5 rounded-lg text-sm font-semibold
                        border transition-all duration-200
                        ${difficulty === d
                          ? difficultyColor[d] + ' border-transparent'
                          : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#888888] hover:border-[#22c55e] hover:text-white'
                        }
                      `}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic selector */}
              <div>
                <label className="
                  text-white text-sm font-semibold
                  block mb-3
                ">
                  Topic <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {topics.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-semibold
                        border transition-all duration-200
                        ${topic === t
                          ? 'bg-[#22c55e] text-black border-transparent'
                          : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#888888] hover:border-[#22c55e] hover:text-white'
                        }
                      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Style selector */}
              <div>
                <label className="
                  text-white text-sm font-semibold
                  block mb-3
                ">
                  Company Style
                  <span className="text-[#888888] font-normal ml-2">
                    (optional)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {companies.map(c => (
                    <button
                      key={c}
                      onClick={() => setCompanyStyle(c)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-semibold
                        border transition-all duration-200
                        ${companyStyle === c
                          ? 'bg-[#22c55e] text-black border-transparent'
                          : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#888888] hover:border-[#22c55e] hover:text-white'
                        }
                      `}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="
                  bg-red-500/10 border border-red-500/30
                  rounded-lg px-4 py-3
                ">
                  <p className="text-red-400 text-sm">❌ {error}</p>
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !difficulty || !topic}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-[#22c55e] text-black font-bold
                  py-3 rounded-xl text-sm
                  hover:bg-[#16a34a] transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin inline-block">⟳</span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate Problem</span>
                  </>
                )}
              </button>

            </div>
          )}

          {/* ─── STEP 2 — PREVIEW ─── */}
          {step === 'preview' && generatedProblem && (
            <div className="space-y-4">

              {/* Problem header */}
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-white font-bold text-lg">
                  {generatedProblem.title}
                </h3>
                <span className={`
                  text-xs font-bold px-3 py-1 rounded-full
                  ${difficultyColor[generatedProblem.difficulty] || 'bg-green-500 text-black'}
                `}>
                  {generatedProblem.difficulty}
                </span>
              </div>
              {generatedProblem.category && (
                <p className="text-[#888888] text-sm">
                  {generatedProblem.category}
                </p>
              )}

              {/* Description */}
              <div className="
                bg-[#0a0a0a] border border-[#2a2a2a]
                rounded-xl p-4
              ">
                <h4 className="text-[#22c55e] text-sm font-semibold mb-2">
                  Description
                </h4>
                <p className="text-white text-sm leading-relaxed">
                  {typeof generatedProblem.description === 'string' 
                    ? generatedProblem.description 
                    : generatedProblem.description?.text || JSON.stringify(generatedProblem.description)}
                </p>
                {generatedProblem.description?.notes?.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {generatedProblem.description.notes.map((note, i) => (
                      <li key={i} className="text-[#888888] text-sm">
                        • {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Constraints */}
              {generatedProblem.constraints?.length > 0 && (
                <div className="
                  bg-[#0a0a0a] border border-[#2a2a2a]
                  rounded-xl p-4
                ">
                  <h4 className="text-[#22c55e] text-sm font-semibold mb-2">
                    Constraints
                  </h4>
                  <ul className="space-y-1">
                    {generatedProblem.constraints.map((c, i) => (
                      <li key={i} className="text-[#888888] text-sm font-mono">
                        • {typeof c === 'string' ? c : JSON.stringify(c)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {generatedProblem.examples?.length > 0 && (
                <div className="
                  bg-[#0a0a0a] border border-[#2a2a2a]
                  rounded-xl p-4
                ">
                  <h4 className="text-[#22c55e] text-sm font-semibold mb-3">
                    Examples
                  </h4>
                  {generatedProblem.examples.map((ex, i) => (
                    <div key={i} className="
                      mb-3 pb-3 border-b border-[#2a2a2a] last:border-0 last:mb-0 last:pb-0
                    ">
                      <p className="text-[#888888] text-xs mb-1">
                        Example {i + 1}
                      </p>
                      <p className="text-white text-sm">
                        <span className="text-[#22c55e]">Input: </span>
                        {typeof ex.input === 'string' ? ex.input : JSON.stringify(ex.input)}
                      </p>
                      <p className="text-white text-sm">
                        <span className="text-[#22c55e]">Output: </span>
                        {typeof ex.output === 'string' ? ex.output : JSON.stringify(ex.output)}
                      </p>
                      {ex.explanation && (
                        <p className="text-[#888888] text-sm mt-1">
                          {typeof ex.explanation === 'string' ? ex.explanation : JSON.stringify(ex.explanation)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Starter Code Preview */}
              {generatedProblem.starterCode?.javascript && (
                <div className="
                  bg-[#0a0a0a] border border-[#2a2a2a]
                  rounded-xl p-4
                ">
                  <h4 className="text-[#22c55e] text-sm font-semibold mb-2">
                    Starter Code (JavaScript)
                  </h4>
                  <pre className="
                    text-[#e6edf3] text-xs font-mono
                    bg-[#0d1117] rounded-lg p-3
                    overflow-x-auto whitespace-pre-wrap
                  ">
                    {generatedProblem.starterCode.javascript}
                  </pre>
                </div>
              )}

              {/* Hidden test cases count */}
              {generatedProblem.hiddenTestCases?.length > 0 && (
                <div className="
                  bg-[#0a0a0a] border border-[#2a2a2a]
                  rounded-xl p-4
                ">
                  <h4 className="text-[#22c55e] text-sm font-semibold mb-2">
                    Hidden Test Cases ({generatedProblem.hiddenTestCases.length})
                  </h4>
                  <ul className="space-y-1">
                    {generatedProblem.hiddenTestCases.map((tc, i) => (
                      <li key={i} className="text-[#888888] text-sm">
                        {i + 1}. {typeof tc.description === 'string' ? tc.description : JSON.stringify(tc.description)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="
                  bg-red-500/10 border border-red-500/30
                  rounded-lg px-4 py-3
                ">
                  <p className="text-red-400 text-sm">❌ {error}</p>
                </div>
              )}

            </div>
          )}

          {/* ─── STEP 3 — SAVED ─── */}
          {step === 'saved' && (
            <div className="
              flex flex-col items-center justify-center
              py-12 text-center
            ">
              <div className="
                w-20 h-20 rounded-full
                bg-green-500/20 border-2 border-[#22c55e]
                flex items-center justify-center
                text-4xl mb-6
              ">
                ✅
              </div>
              <h3 className="text-white font-bold text-xl mb-2">
                Problem Saved!
              </h3>
              <p className="text-[#888888] text-sm mb-1">
                {generatedProblem?.title} is now in your Problem Bank
              </p>
              <p className="text-[#555555] text-xs">
                Closing automatically...
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer — Preview step action buttons */}
        {step === 'preview' && (
          <div className="
            flex gap-3 p-6
            border-t border-[#2a2a2a]
            shrink-0
          ">
            <button
              onClick={() => {
                setStep('configure')
                setGeneratedProblem(null)
                setError('')
              }}
              className="
                flex-1 py-2.5 rounded-xl text-sm font-semibold
                bg-[#0a0a0a] border border-[#2a2a2a]
                text-[#888888] hover:text-white hover:border-[#22c55e]
                transition-all duration-200
              "
            >
              ↩ Regenerate
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="
                flex-1 flex items-center justify-center gap-2
                py-2.5 rounded-xl text-sm font-bold
                bg-[#22c55e] text-black
                hover:bg-[#16a34a] transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSaving ? (
                <>
                  <span className="animate-spin inline-block">⟳</span>
                  <span>Saving...</span>
                </>
              ) : (
                '✅ Save to Problem Bank'
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
