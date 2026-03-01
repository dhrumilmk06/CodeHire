import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const AutoScorePanel = ({ results, score, isScoring }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!results && !isScoring) return null;

    const getScoreColor = (passed, total) => {
        const ratio = passed / total;
        if (ratio === 1) return 'text-success';
        if (ratio >= 0.6) return 'text-warning';
        if (ratio >= 0.2) return 'text-orange-500';
        return 'text-error';
    };

    const getScoreText = (passed, total) => {
        const ratio = passed / total;
        if (ratio === 1) return 'Perfect Score';
        if (ratio >= 0.6) return 'Good';
        if (ratio >= 0.2) return 'Needs Work';
        return 'Incorrect Solution';
    };

    return (
        <div className="mt-4 bg-base-300 rounded-xl overflow-hidden border border-base-100 shadow-xl transition-all duration-300">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-base-200/50 transition-colors"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-base-content/50">Auto Score Results</h3>
                    {isScoring ? (
                        <div className="flex items-center gap-2 text-primary animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Running hidden tests...</span>
                        </div>
                    ) : (
                        <div className={`flex items-center gap-2 ${getScoreColor(score.passed, score.total)}`}>
                            <span className="text-lg font-black">{score.passed} / {score.total}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-base-100 px-2 py-0.5 rounded-full border border-current/20">
                                {getScoreText(score.passed, score.total)}
                            </span>
                        </div>
                    )}
                </div>
                <button className="btn btn-ghost btn-xs btn-circle text-base-content/30">
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
            </div>

            {/* Content */}
            {!isCollapsed && results && (
                <div className="p-4 pt-0 border-t border-base-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        {results.map((test, index) => (
                            <div
                                key={test.id || index}
                                className={`flex items-center justify-between p-3 rounded-lg bg-base-100/30 border-l-4 transition-all hover:bg-base-100/50 ${test.passed ? 'border-success' : 'border-error'
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {test.passed ? (
                                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-error shrink-0" />
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-tighter">Test {test.id}</span>
                                        <span className="text-xs font-bold truncate text-base-content/80">{test.description}</span>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {test.passed ? (
                                        <span className="badge badge-success badge-xs font-black text-[9px] py-1.5 opacity-80">PASSED</span>
                                    ) : (
                                        <span className="badge badge-error badge-xs font-black text-[9px] py-1.5 opacity-80">FAILED</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
