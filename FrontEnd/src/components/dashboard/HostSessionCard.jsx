import { useState } from 'react'
import { LinkIcon, Link as RedirectIcon } from 'lucide-react'

export default function HostSessionCard({ session }) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const copyCode = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(session.session_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/session/${session.id || session._id}`
    navigator.clipboard.writeText(url)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  return (
    <div className="
      flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3
      bg-black/20 border border-white/5
      rounded-xl px-3 py-2.5 w-full
    ">
      {/* Code Section */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-success font-mono font-black text-sm tracking-widest truncate">
          {session.session_code}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={copyCode}
          className={`
            text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg
            transition-all duration-200
            ${copied ? 'bg-success/20 text-success' : 'text-base-content/40 hover:text-success hover:bg-success/10'}
          `}
        >
          {copied ? '✅ Copied' : '📋 Copy'}
        </button>

        <button
          onClick={shareLink}
          className={`
            flex items-center gap-1.5
            text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg
            transition-all duration-200
            ${shared ? 'bg-success/20 text-success' : 'text-base-content/40 hover:text-primary hover:bg-primary/10'}
          `}
        >
          {shared ? '✅ Ready' : <><LinkIcon className="size-3" /> Share</>}
        </button>
      </div>
    </div>
  )
}
