// Piston API is a service for code execution
// Self-hosted via Docker: docker run -d --privileged --name piston -p 2000:2000 --tmpfs /piston/jobs ghcr.io/engineer-man/piston
// Make sure Docker Desktop is running before starting the app

// SELF-HOSTED (Docker) - proxied through Vite to avoid CORS
// Vite proxy routes /piston/* → http://localhost:2000/api/v2/*
const PISTON_API = "/piston"

// PUBLIC API (no longer free as of Feb 2026, returns 401)
// const PISTON_API = "https://emkc.org/api/v2/piston"

const LANGUAGE_VERSIONS = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
    cpp: { language: "cpp", version: "10.2.0" },
}

const JUDGE0_LANGUAGE_IDS = {
    javascript: 63,
    python:     71,
    java:       62,
    cpp:        54,
    c:          50,
    typescript: 74,
};

/**
 * @param {string} language - programming language
 * @param {string} code  - source code to executed
 * @returns {Promise<{success : boolean, output? : string, error?: string }>} 
 */


// this function run the execution code btn
export async function executeCode(language, code) {
    // Feature flag switch for Judge0 Experiment
    if (import.meta.env.VITE_CODE_EXECUTOR === 'judge0') {
        return await executeOnJudge0(language, code);
    }

    try {
        const languageConfig = LANGUAGE_VERSIONS[language];

        if (!languageConfig) {
            return {
                success: false,
                error: `Unsupported language: ${language}`
            }
        }

        // Piston's Java runtime ALWAYS runs `java Main` after compiling.
        // So we must rename the user's class (e.g. Solution) to Main before sending.
        const pistonCode = language === 'java' ? normalizeJavaCode(code) : code;

        // Add a 60 second timeout so it never hangs indefinitely
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
                language: languageConfig.language,
                version: languageConfig.version,
                files: [
                    {
                        name: language === 'java' ? 'Main.java' : getFileExecution(language, code),
                        content: pistonCode,
                    },
                ],
                compile_timeout: 30000,
                run_timeout: 30000,
                compile_memory_limit: -1,
                run_memory_limit: -1,
            }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP error! status: ${response.status}`
            };
        }

        const data = await response.json();

        const output = data.run.output || "";
        const stderr = data.run.stderr || "";

        if (stderr) {
            return {
                success: false,
                output: output,
                error: stderr,
            };
        }

        return {
            success: true,
            output: output || "No output",
        };

    } catch (error) {
        if (error.name === "AbortError") {
            return {
                success: false,
                error: "Code execution timed out. Please try again.",
            };
        }
        return {
            success: false,
            error: `Failed to execute code: ${error.message}`,
        };
    }
}

/**
 * Returns the correct filename for Piston.
 * For Java, Piston REQUIRES the filename to match the public class name
 * (e.g. `class Solution` → `Solution.java`), otherwise it throws
 * "Could not find or load main class X".
 * We extract the class name dynamically from the source code.
 */
function getFileExecution(language, code = "") {
    if (language === "java") {
        // Match `public class Foo` or `class Foo` (first occurrence)
        const match = code.match(/(?:public\s+)?class\s+(\w+)/);
        const className = match ? match[1] : "Main";
        return `${className}.java`;
    }

    const fileNames = {
        javascript: "main.js",
        python: "main.py",
        cpp: "main.cpp"
    };

    return fileNames[language] || "main.txt"
}

// ---------------------------------------------------------------------------
// Java code normalizer — Piston ALWAYS runs `java Main`
// ---------------------------------------------------------------------------
/**
 * Renames the top-level class in Java code to `Main` so that Piston can
 * compile it as Main.java and execute it with `java Main`.
 * Works regardless of whether the user wrote `class Solution`, `class MyClass`, etc.
 */
function normalizeJavaCode(code) {
    // Find the first class declaration (public or package-private)
    const match = code.match(/(?:public\s+)?class\s+(\w+)/);
    if (!match || match[1] === 'Main') return code; // already Main, nothing to do

    const originalName = match[1];
    // Replace all occurrences of the class name as a whole word
    return code.replace(new RegExp(`\\b${originalName}\\b`, 'g'), 'Main');
}

// ---------------------------------------------------------------------------
// Judge0 Experiment Helper
// ---------------------------------------------------------------------------
async function executeOnJudge0(language, code) {
    const languageId = JUDGE0_LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) {
        return { success: false, error: `Unsupported Judge0 language: ${language}` };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Judge0 is fast but rate-limited

        const response = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                language_id: languageId,
                source_code: code,
                stdin: ""
            }),
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        const status = data.status || {};

        const output = (data.stdout || "").replace(/\n$/, ""); // Trim Judge0's trailing newline
        const stderr = data.stderr || data.compile_output || "";

        if (status.id === 3) {
            return { success: true, output: output || "No output" };
        } else if (status.id === 6) {
            return { success: false, error: `Compilation Error: ${stderr || status.description}` };
        } else if (status.id >= 7) {
            return { success: false, output: output, error: `${status.description}: ${stderr || ''}`.trim() };
        }

        return { success: false, error: `Unexpected Judge0 status: ${status.description}` };

    } catch (error) {
        if (error.name === "AbortError") {
            return { success: false, error: "Code execution timed out. Please try again." };
        }
        return { success: false, error: `Judge0 failed to execute code: ${error.message}` };
    }
}