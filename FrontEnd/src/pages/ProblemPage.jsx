import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { fetchStandardProblemById, fetchStandardProblems } from '../api/standardProblems.js'

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ProblemDescription } from "../components/ProblemDescription.jsx"
import { CodeEditorPanel } from '../components/CodeEditorPanel.jsx'
import SolutionTab from '../components/problems/SolutionTab'
import { OutputPanel } from '../components/OutputPanel.jsx'
import { executeCode } from '../lib/piston.js'
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { Loader2Icon } from 'lucide-react';

export const ProblemPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [currentProblem, setCurrentProblem] = useState(null)
    const [allProblems, setAllProblems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("")
    const [output, setOutput] = useState(null)
    const [isRunning, setIsRunning] = useState(false)
    const [activeTab, setActiveTab] = useState('description')

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                // Fetch both the current problem and the lightweight list for the dropdown
                const [problemData, listData] = await Promise.all([
                    fetchStandardProblemById(id),
                    // Check if we already have the list to save a network call
                    allProblems.length > 0 ? Promise.resolve({ problems: allProblems }) : fetchStandardProblems({ limit: 500, offset: 0, lightweight: true })
                ]);
                
                setCurrentProblem(problemData)
                if (listData.problems.length > 0 && allProblems.length === 0) {
                    setAllProblems(listData.problems)
                }

                // Default language fallback
                const initialLang = selectedLanguage || 'javascript'
                if (problemData.starterCode && problemData.starterCode[initialLang]) {
                    setCode(problemData.starterCode[initialLang])
                }
                setOutput(null)

            } catch (err) {
                console.error(err)
                setError("Problem not found or failed to load.")
            } finally {
                setIsLoading(false)
            }
        }
        
        if (id) {
            loadData()
        }
    }, [id])

    const handelLanguageChange = (e) => {
        const newLang = e.target.value;
        setSelectedLanguage(newLang);
        if (currentProblem && currentProblem.starterCode) {
            setCode(currentProblem.starterCode[newLang] || "");
        }
        setOutput(null);
    }

    const handelProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`)

    const triggerConfetti = () => {
        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.2, y: 0.6 },
        });

        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.8, y: 0.6 },
        });
    }

    const normalizeOutput = (output) => {
        if (!output) return "";
        return output
            .trim()
            .split("\n")
            .map((line) =>
                line
                    .trim()
                    .replace(/\[\s+/g, "[")
                    .replace(/\s+\]/g, "]")
                    .replace(/\s*,\s*/g, ",")
            )
            .filter((line) => line.length > 0)
            .join("\n");
    };

    const checkIfTestsPassed = (actualOutput, expectedOutput) => {
        const normalizedActual = normalizeOutput(actualOutput)
        const normalizedExpected = normalizeOutput(expectedOutput)

        return normalizedActual == normalizedExpected
    }

    const handleRunCode = async () => {
        if (!currentProblem) return;
        setIsRunning(true);
        setOutput(null);

        const result = await executeCode(selectedLanguage, code);
        setOutput(result)
        setIsRunning(false);

        if (result.success) {
            const expectedOutput = currentProblem.expectedOutput ? currentProblem.expectedOutput[selectedLanguage] : "";
            const testPassed = checkIfTestsPassed(result.output, expectedOutput);

            if (testPassed) {
                triggerConfetti();
                toast.success("All tests passed! Great job!");
            } else {
                toast.error("Tests failed. Check your output!");
            }
        } else {
            toast.error("Code execution failed!");
        }
    }

    if (isLoading) {
        return (
            <div className='h-screen bg-base-100 flex items-center justify-center'>
                <Loader2Icon className="size-10 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !currentProblem) {
        return (
            <div className='h-screen bg-base-100 flex items-center justify-center'>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-error mb-4">{error || "Problem not found"}</h2>
                    <button onClick={() => navigate('/problems')} className="btn btn-primary">Back to Problems</button>
                </div>
            </div>
        )
    }

    return (
        <div className='h-screen bg-base-100 flex flex-col'>
            <div className='flex-1'>
                <PanelGroup direction='horizontal'>
                    {/* left panel- problem desc */}
                    <Panel defaultSize={40} minSize={30}>
                        <div className="flex border-b border-[#2a2a2a] mb-4 flex-shrink-0">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`
                                    px-4 py-3 text-sm font-semibold
                                    transition-all duration-200 cursor-pointer
                                    border-b-2
                                    ${activeTab === 'description'
                                        ? 'text-white border-[#22c55e]'
                                        : 'text-[#888888] border-transparent hover:text-white'
                                    }
                                `}
                            >
                                📄 Description
                            </button>

                            <button
                                onClick={() => setActiveTab('solution')}
                                className={`
                                    px-4 py-3 text-sm font-semibold
                                    transition-all duration-200 cursor-pointer
                                    border-b-2
                                    ${activeTab === 'solution'
                                        ? 'text-white border-[#22c55e]'
                                        : 'text-[#888888] border-transparent hover:text-white'
                                    }
                                `}
                            >
                                💡 Solution
                            </button>
                        </div>

                        {activeTab === 'description' && (
                            <ProblemDescription
                                problem={currentProblem}
                                currentProblemId={id}
                                onProblemChange={handelProblemChange}
                                allProblems={allProblems}
                            />
                        )}

                        {activeTab === 'solution' && (
                            <SolutionTab problem={currentProblem} />
                        )}
                    </Panel>

                    <PanelResizeHandle className='w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize' />

                    {/* right panel- problem desc */}
                    <Panel defaultSize={60} minSize={30}>
                        <PanelGroup direction='vertical'>
                            {/* Top panel - Code editor */}
                            <Panel defaultSize={70} minSize={30}>
                                <CodeEditorPanel
                                    selectedLanguage={selectedLanguage}
                                    code={code}
                                    isRunning={isRunning}
                                    onLanguageChange={handelLanguageChange}
                                    onCodeChange={setCode}
                                    onRunCode={handleRunCode}
                                />
                            </Panel>

                            <PanelResizeHandle className='h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize' />

                            {/* bottom panel - output Panel */}
                            <Panel defaultSize={30} minSize={30}>
                                <OutputPanel output={output} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    )
}
