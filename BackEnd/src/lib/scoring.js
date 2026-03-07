import { prisma } from './db.js';
import { getFileExecution } from './utils.js';
import { emitToRoom } from './socket.js';

export const runAutoScore = async (data) => {
    const { code, language, sessionId, problemId } = data;
    console.log(`[Scoring] Starting background score for session: ${sessionId}`);

    try {
        const problem = await prisma.customProblem.findFirst({
            where: { title: problemId }
        });

        if (!problem || !problem.hiddenTestCases || !Array.isArray(problem.hiddenTestCases) || problem.hiddenTestCases.length === 0) {
            console.log(`[Scoring] No hidden test cases for ${problemId}`);
            const session = await prisma.session.findUnique({ where: { id: sessionId } });
            if (session?.callId) {
                emitToRoom(session.callId, "autoScoreResults", {
                    sessionId,
                    problemId,
                    score: null,
                    results: [],
                    message: "No hidden test cases found for this problem."
                });
            }
            return;
        }

        const languageVersions = {
            javascript: { language: "javascript", version: "18.15.0" },
            python: { language: "python", version: "3.10.0" },
            java: { language: "java", version: "15.0.2" },
            cpp: { language: "cpp", version: "10.2.0" },
        };
        const config = languageVersions[language] || languageVersions.javascript;

        const results = await Promise.all(
            problem.hiddenTestCases.map(async (test) => {
                try {
                    const langKey = (language === "javascript" || language === "python" || language === "java" || language === "cpp") ? language : "javascript";
                    const testInputCode = test.inputCode?.[langKey];

                    if (!testInputCode) return null;

                    const filename = language === "java" ? "Main.java" : `main${getFileExecution(language)}`;
                    const sanitizedCode = language === "java" ? code.replace(/public\s+class/g, "class") : code;

                    let combinedContent;
                    if (language === "java") {
                        const importRegex = /^\s*import\s+.*;/gm;
                        const imports = sanitizedCode.match(importRegex) || [];
                        const codeWithoutImports = sanitizedCode.replace(importRegex, "");

                        // Always include java.util.* for convenience
                        if (!imports.some(i => i.includes("java.util.*"))) {
                            imports.push("import java.util.*;");
                        }

                        // We name our test class 'Main' and ensure it matches the filename
                        // We also make sure testInputCode uses the 'Solution' class name
                        combinedContent = imports.join("\n") + "\n\n" + codeWithoutImports + "\n\n" + testInputCode;
                    } else {
                        combinedContent = (language === "cpp" ? "#define HIDDEN_TEST\n" : "") + sanitizedCode + "\n" + testInputCode;
                    }

                    const executeBody = {
                        language: config.language,
                        version: config.version,
                        files: [{ name: filename, content: combinedContent }]
                    };

                    const testResponse = await fetch('http://localhost:2000/api/v2/execute', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(executeBody)
                    });
                    const testResult = await testResponse.json();
                    const fullOutput = (testResult.run?.stdout || "").trim();

                    const lines = fullOutput.split('\n').filter(line => line.trim() !== "");
                    const actualOutput = lines.length > 0 ? lines[lines.length - 1].trim() : "";

                    const normalize = (str) => str.replace(/\s+/g, "");
                    const passed = normalize(actualOutput) === normalize(test.expectedOutput);

                    return { id: test.id, description: test.description, passed };
                } catch (err) {
                    console.error(`[Scoring] Test case ${test.id} failed:`, err.message);
                    return { id: test.id, description: test.description, passed: false };
                }
            })
        );

        const finalResults = results.filter(r => r !== null);
        const passedCount = finalResults.filter(r => r.passed).length;
        const totalCount = finalResults.length;

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { host: true }
        });

        if (session?.callId) {
            emitToRoom(session.callId, "autoScoreResults", {
                sessionId,
                problemId,
                score: { passed: passedCount, total: totalCount },
                results: finalResults
            });
            console.log(`[Scoring] Results emitted for session: ${sessionId}`);
        }

    } catch (error) {
        console.error("[Scoring] Global scoring error:", error);
    }
};
