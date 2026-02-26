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
}

/**
 * @param {string} language - programming language
 * @param {string} code  - source code to executed
 * @returns {Promise<{success : boolean, output? : string, error?: string }>} 
 */


// this function run the execution code btn
export async function executeCode(language, code) {
    try {
        const languageConfig = LANGUAGE_VERSIONS[language];

        if (!languageConfig) {
            return {
                success: false,
                error: `Unsupported language: ${language}`
            }
        }

        // Add a 10 second timeout so it never hangs indefinitely
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

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
                        name: `main${getFileExecution(language)}`,
                        content: code,
                    },
                ],
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

function getFileExecution(language) {
    const extentions = {
        javascript: "js",
        python: "py",
        java: "java"
    };

    return extentions[language] || "txt"
}