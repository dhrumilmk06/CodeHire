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
          <div className="space-y-2">
            {output.output ? (
              <pre className='text-sm font-mono text-success whitespace-pre-wrap'>{output.output}</pre>
            ) : (
              <p className="text-sm font-mono text-base-content/50 italic">✓ Execution finished (no output)</p>
            )}
            {(output.stderr || output.error) && (
              <pre className='text-sm font-mono text-warning whitespace-pre-wrap border-t border-base-300 pt-2 mt-2'>
                {output.stderr || output.error}
              </pre>
            )}
          </div>
        ) : (
          <div>
            {(output.output || output.stdout) && (
              <pre className='text-sm font-mono text-base-content whitespace-pre-wrap mb-2 opacity-70'>
                {output.output || output.stdout}
              </pre>
            )}
            <pre className='text-sm font-mono text-error whitespace-pre-wrap font-bold'>
              {output.error || output.stderr || "Unknown Error"}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
