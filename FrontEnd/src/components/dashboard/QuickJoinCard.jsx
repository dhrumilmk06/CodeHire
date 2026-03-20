import { useState } from 'react'
import { useNavigate } from 'react-router'
import axiosInstance from '../../lib/axios'

export default function QuickJoinCard() {
  const navigate = useNavigate()

  const [urlInput, setUrlInput]       = useState('')
  const [codeInput, setCodeInput]     = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState('')

  const handleJoin = async (type) => {
    setIsLoading(true)
    setError('')

    const body = type === 'url'
      ? { link: urlInput.trim() }
      : { code: codeInput.trim().toUpperCase() }

    // Validate input before sending
    if (type === 'url' && !urlInput.trim()) {
      setError('Please paste a session link')
      setIsLoading(false)
      return
    }

    if (type === 'code' && !codeInput.trim()) {
      setError('Please enter a session code')
      setIsLoading(false)
      return
    }

    try {
      const response = await axiosInstance.post('/sessions/join', body)
      const data = response.data

      if (data.success) {
        // Success — redirect to session
        navigate(data.redirectUrl)
      } else {
        setError(data.error || 'Could not join session')
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="
      bg-base-200 border-2 border-base-300
      rounded-xl p-6 mb-6
      transition-all duration-300
      hover:border-primary/50
    ">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-primary text-lg">⚡</span>
        <h2 className="text-base-content font-bold text-lg">Quick Join</h2>
      </div>

      {/* Info hint */}
      <p className="text-base-content/60 text-sm mb-5">
        Ask your host to share the session link or code
      </p>

      {/* URL Input Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value)
            setError('')
          }}
          placeholder="Paste session link here..."
          className="
            input input-bordered flex-1
            text-sm placeholder-base-content/30
            focus:border-primary
            transition-colors duration-200
          "
        />
        <button
          onClick={() => handleJoin('url')}
          disabled={isLoading || !urlInput.trim()}
          className="
            btn btn-primary px-5
            disabled:opacity-50 disabled:cursor-not-allowed
            whitespace-nowrap
          "
        >
          {isLoading ? 'Joining...' : 'Join'}
        </button>
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-base-300" />
        <span className="text-base-content/40 text-xs font-medium">OR</span>
        <div className="flex-1 h-px bg-base-300" />
      </div>

      {/* Code Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={codeInput}
          onChange={(e) => {
            setCodeInput(e.target.value.toUpperCase())
            setError('')
          }}
          placeholder="Enter code e.g. ABC-XYZ"
          maxLength={10}
          className="
            input input-bordered flex-1
            text-success font-mono font-bold text-sm
            placeholder-base-content/30 tracking-widest
            focus:border-primary
            transition-colors duration-200
          "
        />
        <button
          onClick={() => handleJoin('code')}
          disabled={isLoading || !codeInput.trim()}
          className="
            btn btn-outline btn-success px-5
            disabled:opacity-50 disabled:cursor-not-allowed
            whitespace-nowrap
          "
        >
          {isLoading ? 'Joining...' : 'Join with Code'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="
          mt-3 bg-error/10 border border-error/30
          rounded-lg px-4 py-2
        ">
          <p className="text-error text-sm">❌ {error}</p>
        </div>
      )}

    </div>
  )
}
