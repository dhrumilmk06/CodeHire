import React from 'react'

export const OutputPanel = ({ output, isRunning }) => {
  return (
    <div className='flex-1 bg-base-100 flex flex-col min-h-0'>
      <div className='px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm flex items-center justify-between'>
        <span>Output</span>
        {isRunning && <span className="loading loading-spinner loading-xs text-primary"></span>}
      </div>
      <div className='flex-1 overflow-auto p-4'>
        {output === null ? (
          <p className='text-base-content/50 text-sm'>Click "Run Code" to see the output here..</p>
        ) : output.success ? (
          <pre className='text-sm font-mono text-success whitespace-pre-wrap'>{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className='text-sm font-mono text-base-content whitespace-pre-wrap mb-2'>
                {output.output}
              </pre>
            )}
            <pre className='text-sm font-mono text-error whitespace-pre-wrap'>{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
