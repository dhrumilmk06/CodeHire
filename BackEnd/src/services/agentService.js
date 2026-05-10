/**
 * agentService.js
 *
 * Interview Orchestration Agent — CodeHire
 * =========================================
 * Manages per-session background monitoring loops using Node.js setInterval.
 * No external queue libraries used.
 *
 * Key schema notes:
 *  - session.problem        → String (CustomProblem ID), NOT a relation
 *  - session.problemCodes   → Json { "javascript": "...", "python": "..." }
 *  - session.language       → String (active language)
 *  - session.testCasesPassed→ String "X/Y"
 *  - session.createdAt      → used as session start time (no startTime field)
 *  - session.timings        → Json (may contain duration info)
 *  - Agent columns added via Phase 0 SQL:
 *      agentActive, lastCodeSnapshot, stuckDetectedAt, hintsGenerated,
 *      autoTestsRun, agentSummary, lastAgentCheckAt, timeWarningAt
 */

import { prisma } from '../lib/db.js';
import { generateAIResponse } from '../lib/gemini.js';
import { executeCode } from './codeExecutionService.js';

// ---------------------------------------------------------------------------
// Agent Registry — In-memory map: sessionId → intervalId
// ---------------------------------------------------------------------------
const activeAgents = new Map();

// Interval between monitoring cycles: 1 minute for more responsive feedback
const AGENT_INTERVAL_MS = 1 * 60 * 1000;

// Default session duration in minutes if not set
const DEFAULT_DURATION_MINUTES = 60;

// ---------------------------------------------------------------------------
// Helper: emit to host room + general session room
// ---------------------------------------------------------------------------

/**
 * Emits a socket event to both the private host channel and the general
 * session channel.
 *
 * @param {import('socket.io').Server} io
 * @param {string} sessionId
 * @param {string} event
 * @param {object} data
 */
function emitToHostRoom(io, sessionId, event, data) {
  io.to(`host:${sessionId}`).emit(event, data);
  io.to(`session:${sessionId}`).emit(event, data);
}

// ---------------------------------------------------------------------------
// Helper: resolve current candidate code from a session
// ---------------------------------------------------------------------------

/**
 * Returns the candidate's active code from session.problemCodes.
 * Falls back through: active language → first available language → empty string.
 *
 * @param {object} session  - Prisma Session record
 * @returns {string}
 */
function resolveCurrentCode(session) {
  const codes = session.problemCodes ?? {};

  // Primary: problemCodes is keyed by problem TITLE (e.g. { "Two Sum": "...code..." })
  // This matches how sessionController.saveProblemCode stores code
  const problemTitle = session.problem;
  if (problemTitle && codes[problemTitle] && typeof codes[problemTitle] === 'string') {
    return codes[problemTitle];
  }

  // Fallback 1: keyed by language (older sessions or custom code saves)
  const lang = session.language || 'javascript';
  if (codes[lang] && typeof codes[lang] === 'string') {
    return codes[lang];
  }

  // Fallback 2: first non-empty value found in the map
  const firstAvailable = Object.values(codes).find(
    (c) => typeof c === 'string' && c.trim().length > 0
  );
  return firstAvailable ?? '';
}

// ---------------------------------------------------------------------------
// Helper: count non-empty lines in a code string
// ---------------------------------------------------------------------------

function countNonEmptyLines(code) {
  if (!code || typeof code !== 'string') return 0;
  return code.split('\n').filter((line) => line.trim().length > 0).length;
}

// ---------------------------------------------------------------------------
// Helper: calculate remaining seconds
// ---------------------------------------------------------------------------

/**
 * Determines how many seconds remain in the session.
 * Uses session.createdAt as start time and session.timings.duration (minutes)
 * if available, otherwise defaults to DEFAULT_DURATION_MINUTES.
 *
 * @param {object} session
 * @returns {number} remaining seconds (can be negative if session over-ran)
 */
function getRemainingSeconds(session) {
  const startTime = new Date(session.createdAt).getTime();

  // Try to read duration from session.timings JSON, then fall back to default
  let durationMinutes = DEFAULT_DURATION_MINUTES;
  try {
    const timings = session.timings ?? {};
    if (typeof timings.duration === 'number' && timings.duration > 0) {
      durationMinutes = timings.duration;
    }
  } catch {
    // timings may be null or malformed — use default
  }

  const totalMs = durationMinutes * 60 * 1000;
  const elapsedMs = Date.now() - startTime;
  return (totalMs - elapsedMs) / 1000;
}

// ---------------------------------------------------------------------------
// generateHintForHost
// ---------------------------------------------------------------------------

/**
 * Calls Gemini to generate a non-revealing hint and emits it to the host.
 *
 * @param {object} session      - Prisma Session record (with problemTitle resolved)
 * @param {object} customProblem- Prisma CustomProblem record
 * @param {string} currentCode  - Candidate's current code
 * @param {import('socket.io').Server} io
 */
async function generateHintForHost(session, customProblem, currentCode, io) {
  try {
    const problemTitle = customProblem?.title ?? 'the current problem';
    const descriptionText =
      typeof customProblem?.description === 'object'
        ? (customProblem.description?.text ?? JSON.stringify(customProblem.description))
        : (customProblem?.description ?? '');

    const prompt = `You are an interview assistant. The candidate has been stuck for a while on this problem:

Problem: ${problemTitle}
Description: ${descriptionText}
Candidate's current code:
${currentCode}

Generate ONE concise, non-giving hint (max 2 sentences) that nudges them in the right direction without revealing the solution. Return only the hint text.`;

    const hint = await generateAIResponse(prompt);
    const hintText = hint?.trim() ?? '';

    if (!hintText) {
      console.warn(`[Agent] Gemini returned empty hint for session ${session.id}`);
      return;
    }

    // Increment hintsGenerated in DB
    await prisma.session.update({
      where: { id: session.id },
      data: {
        hintsGenerated: { increment: 1 },
      },
    });

    // Emit to host room
    emitToHostRoom(io, session.id, 'agent:hint-suggestion', {
      hint: hintText,
      problemTitle,
      sessionId: session.id,
    });

    console.log(`[Agent] Hint generated for session ${session.id}`);
  } catch (err) {
    console.error(`[Agent] Failed to generate hint for session ${session.id}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// runAutoTests
// ---------------------------------------------------------------------------

/**
 * Runs the candidate's code against hidden test cases via the local Piston API
 * (through the existing executeCode service), updates DB scores, and emits
 * a score-update event to the host.
 *
 * @param {object} session      - Prisma Session record
 * @param {object} customProblem- Prisma CustomProblem record
 * @param {string} currentCode  - Candidate's current code
 * @param {import('socket.io').Server} io
 */
async function runAutoTests(session, customProblem, currentCode, io) {
  try {
    const testCases = Array.isArray(customProblem?.hiddenTestCases)
      ? customProblem.hiddenTestCases
      : [];

    if (testCases.length === 0) {
      console.log(`[Agent] No hidden test cases for session ${session.id} — skipping auto-test`);
      return;
    }

    const language = session.language || 'javascript';
    console.log(`[Agent] Running auto-tests for ${session.id} using language: ${language}`);

    const languageVersions = {
      javascript: { language: "javascript", version: "18.15.0" },
      python: { language: "python", version: "3.10.0" },
      java: { language: "java", version: "15.0.2" },
      cpp: { language: "cpp", version: "10.2.0" },
    };
    const config = languageVersions[language] || languageVersions.javascript;

    // Run tests in parallel like scoring.js
    const results = await Promise.all(
      testCases.map(async (test) => {
        try {
          const langKey = (language === "javascript" || language === "python" || language === "java" || language === "cpp") ? language : "javascript";
          const testInputCode = test.inputCode?.[langKey];

          if (!testInputCode) return null;

          // Prepare file name and sanitize for Piston
          const extMap = { javascript: '.js', python: '.py', java: '.java', cpp: '.cpp' };
          const ext = extMap[language] || '.js';
          const filename = language === "java" ? "Main.java" : `main${ext}`;
          const sanitizedCode = language === "java" ? currentCode.replace(/public\s+class/g, "class") : currentCode;

          let combinedContent;
          if (language === "java") {
            const importRegex = /^\s*import\s+.*;/gm;
            const imports = sanitizedCode.match(importRegex) || [];
            const codeWithoutImports = sanitizedCode.replace(importRegex, "");
            if (!imports.some(i => i.includes("java.util.*"))) imports.push("import java.util.*;");
            combinedContent = imports.join("\n") + "\n\n" + codeWithoutImports + "\n\n" + testInputCode;
          } else {
            combinedContent = (language === "cpp" ? "#define HIDDEN_TEST\n" : "") + sanitizedCode + "\n" + testInputCode;
          }

          const response = await fetch('http://localhost:2000/api/v2/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language: config.language,
              version: config.version,
              files: [{ name: filename, content: combinedContent }]
            })
          });

          const data = await response.json();
          const fullOutput = (data.run?.stdout || "").trim();
          const lines = fullOutput.split('\n').filter(line => line.trim() !== "");
          const actualOutput = lines.length > 0 ? lines[lines.length - 1].trim() : "";

          const normalize = (str) => str.replace(/\s+/g, "");
          const passed = normalize(actualOutput) === normalize(test.expectedOutput);

          return { passed };
        } catch (err) {
          return { passed: false };
        }
      })
    );

    const validResults = results.filter(r => r !== null);
    const passed = validResults.filter(r => r.passed).length;
    const total = validResults.length;
    const scoreString = `${passed}/${total}`;

    // Calculate rating
    const scorePercent = total > 0 ? (passed / total) * 100 : 0;
    let rating = 1;
    if (scorePercent >= 90) rating = 5;
    else if (scorePercent >= 70) rating = 4;
    else if (scorePercent >= 50) rating = 3;
    else if (scorePercent >= 30) rating = 2;

    // Update DB
    await prisma.session.update({
      where: { id: session.id },
      data: {
        testCasesPassed: scoreString,
        autoTestsRun: { increment: 1 },
        rating,
      },
    });

    // Emit score update to host room
    emitToHostRoom(io, session.id, 'agent:score-update', {
      testCasesPassed: passed,
      total,
      scoreString,
      rating,
      sessionId: session.id,
    });

    console.log(`[Agent] Auto-test complete for session ${session.id}: ${scoreString} passed`);
  } catch (err) {
    console.error(`[Agent] Auto-test failed for session ${session.id}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// generateSessionSummary
// ---------------------------------------------------------------------------

/**
 * Generates a professional AI summary of the completed interview session
 * and saves it to the DB.
 *
 * @param {string} sessionId
 * @param {import('socket.io').Server} io
 */
async function generateSessionSummary(sessionId, io) {
  try {
    // Fetch final session state
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      console.warn(`[Agent] generateSessionSummary: session ${sessionId} not found`);
      return;
    }

    // Fetch the associated problem by TITLE (session.problem is a title string, not an ID)
    const customProblem = session.problem
      ? await prisma.customProblem.findFirst({ where: { title: session.problem } })
      : null;

    const problemTitle = customProblem?.title ?? 'Unknown Problem';
    const currentCode = resolveCurrentCode(session);

    // Parse test case counts
    const testCasesStr = session.testCasesPassed ?? '0/0';
    const [passedStr, totalStr] = testCasesStr.split('/');
    const passed = parseInt(passedStr, 10) || 0;
    const total  = parseInt(totalStr,  10) || 0;

    const prompt = `
Generate a structured technical interview review for this session:

Candidate Code:
${currentCode || '(no code submitted)'}

Problem: ${problemTitle}
Test Cases Passed: ${passed}/${total}
Hints Used: ${session.hintsGenerated ?? 0}
Duration: ${session.timeTaken ?? 0} seconds

Return ONLY a valid JSON object with NO extra text:
{
  "summary": "3-4 sentence professional summary covering code quality, approach, and performance.",
  "timeComplexity": "O(?) with brief explanation",
  "spaceComplexity": "O(?) with brief explanation",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "codeQuality": "Excellent/Good/Average/Poor",
  "correctness": "brief comment on test pass rate",
  "problemSolvingApproach": "brief description of their approach",
  "overallRating": 8,
  "recommendation": "Strong Hire/Hire/Maybe/No Hire",
  "recommendationReason": "one sentence reason"
}
`;

    const aiResponse = await generateAIResponse(prompt);
    
    // Parse JSON response from Gemini
    let review;
    try {
      const cleaned = aiResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      review = JSON.parse(cleaned);
    } catch (err) {
      console.warn(`[Agent] Failed to parse AI review JSON for session ${sessionId}, falling back to text`);
      review = {
        summary: aiResponse,
        overallRating: passed >= total ? 8 : 5,
        recommendation: passed >= total ? 'Hire' : 'Maybe'
      };
    }

    // Save to DB (both agentSummary for compatibility and ai_review for Report Card)
    await prisma.session.update({
      where: { id: sessionId },
      data: { 
        agentSummary: review.summary,
        ai_review: review
      },
    });

    // Emit to host room
    emitToHostRoom(io, sessionId, 'agent:summary-ready', {
      summary: review.summary,
      sessionId,
    });

    console.log(`[Agent] Summary generated for session ${sessionId}`);
  } catch (err) {
    console.error(`[Agent] Failed to generate summary for session ${sessionId}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// monitorSession — the main brain (runs every 2 minutes)
// ---------------------------------------------------------------------------

/**
 * Core monitoring loop. Checks for:
 *  A) Session still active
 *  B) Candidate stuck detection
 *  C) Time warning (14–16 min remaining)
 *  D) Auto test execution threshold
 *
 * @param {string} sessionId
 * @param {import('socket.io').Server} io
 */
async function monitorSession(sessionId, io) {
  try {
    console.log(`[Agent] monitorSession running for session ${sessionId}`);

    // ── Step A: Fetch current session ────────────────────────────────────────
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    // Stop agent if session is gone or ended
    if (!session || session.status === 'ENDED' || session.status === 'ended' || session.status === 'completed') {
      console.log(`[Agent] Session ${sessionId} ended — stopping agent`);
      stopAgent(sessionId, io);
      return;
    }

    // Fetch associated CustomProblem by TITLE (session.problem is a title string, not an ID)
    let customProblem = null;
    if (session.problem) {
      customProblem = await prisma.customProblem.findFirst({
        where: { title: session.problem },
      });
      console.log(`[Agent] Problem lookup for "${session.problem}": ${customProblem ? 'found' : 'NOT FOUND (built-in or missing)'}`);
    }

    // Resolve the candidate's current code
    const currentCode = resolveCurrentCode(session);
    const lastSnapshot = session.lastCodeSnapshot ?? '';
    const codeNonEmpty = currentCode.trim().length > 0;

    console.log(`[Agent] Code length: ${currentCode.length} chars, snapshot length: ${lastSnapshot.length} chars, autoTestsRun: ${session.autoTestsRun ?? 0}`);

    // Prepare accumulated DB update (reduce round-trips)
    const dbUpdates = {
      lastAgentCheckAt: new Date(),
    };

    // ── Step B: Stuck Detection ──────────────────────────────────────────────
    if (!codeNonEmpty) {
      // No code yet — nothing to compare
      console.log(`[Agent] No code yet — skipping stuck detection`);
    } else if (lastSnapshot === '') {
      // First cycle — take initial snapshot, no stuck flag yet
      dbUpdates.lastCodeSnapshot = currentCode;
      dbUpdates.stuckDetectedAt  = null;
      console.log(`[Agent] First snapshot taken for session ${sessionId}`);
    } else if (currentCode === lastSnapshot) {
      // Code unchanged since last check
      if (!session.stuckDetectedAt) {
        // Mark stuck and generate a hint for the host
        dbUpdates.stuckDetectedAt = new Date();
        console.log(`[Agent] Candidate stuck detected for session ${sessionId} — generating hint`);

        // Apply DB update before async Gemini call
        await prisma.session.update({ where: { id: sessionId }, data: dbUpdates });
        Object.keys(dbUpdates).forEach((k) => delete dbUpdates[k]);
        dbUpdates.lastAgentCheckAt = new Date();

        generateHintForHost(session, customProblem, currentCode, io).catch((e) =>
          console.error('[Agent] generateHintForHost error:', e.message)
        );
      } else {
        console.log(`[Agent] Still stuck (stuckDetectedAt already set) — waiting next cycle`);
      }
    } else {
      // Code changed — update snapshot, clear stuck state
      dbUpdates.lastCodeSnapshot = currentCode;
      dbUpdates.stuckDetectedAt  = null;
      console.log(`[Agent] Code progressed — snapshot updated`);
    }

    // ── Step C: Time Warning ─────────────────────────────────────────────────
    const remainingSeconds = getRemainingSeconds(session);
    console.log(`[Agent] Time remaining: ${Math.round(remainingSeconds)}s`);

    if (remainingSeconds >= 840 && remainingSeconds <= 960) {
      // 14–16 minute window
      if (!session.timeWarningAt) {
        dbUpdates.timeWarningAt = new Date();

        emitToHostRoom(io, sessionId, 'agent:time-warning', {
          remainingSeconds: Math.round(remainingSeconds),
          message: '~15 minutes remaining in this interview session',
          sessionId,
        });

        console.log(`[Agent] Time warning emitted for session ${sessionId} (${Math.round(remainingSeconds)}s remaining)`);
      }
    }

    // ── Step D: Auto Test Execution ──────────────────────────────────────────
    const nonEmptyLines = countNonEmptyLines(currentCode);
    const autoTestsRun  = session.autoTestsRun ?? 0;

    console.log(`[Agent] Non-empty lines: ${nonEmptyLines}, autoTestsRun: ${autoTestsRun}`);

    if (nonEmptyLines >= 10 && autoTestsRun < 3 && customProblem) {
      // Flush current DB updates first, then run async tests
      if (Object.keys(dbUpdates).length > 0) {
        await prisma.session.update({ where: { id: sessionId }, data: dbUpdates });
        Object.keys(dbUpdates).forEach((k) => delete dbUpdates[k]);
      }

      console.log(`[Agent] Triggering auto-test for session ${sessionId}`);
      runAutoTests(session, customProblem, currentCode, io).catch((e) =>
        console.error('[Agent] runAutoTests error:', e.message)
      );
    } else if (nonEmptyLines >= 10 && autoTestsRun < 3 && !customProblem) {
      console.log(`[Agent] Skipping auto-test — no CustomProblem found (may be a built-in problem)`);
    }

    // ── Flush remaining DB updates ───────────────────────────────────────────
    if (Object.keys(dbUpdates).length > 0) {
      await prisma.session.update({ where: { id: sessionId }, data: dbUpdates });
    }
  } catch (err) {
    console.error(`[Agent] monitorSession error for session ${sessionId}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// startAgent
// ---------------------------------------------------------------------------

/**
 * Starts the background monitoring agent for a session.
 * Prevents duplicate agents using the activeAgents registry.
 *
 * @param {string} sessionId
 * @param {import('socket.io').Server} io
 */
async function startAgent(sessionId, io) {
  // Prevent duplicate agents
  if (activeAgents.has(sessionId)) {
    console.log(`[Agent] Already running for session ${sessionId} — skipping`);
    return;
  }

  try {
    // Mark session as agent-active in DB
    await prisma.session.update({
      where: { id: sessionId },
      data: { agentActive: true },
    });

    // Run an immediate first check
    await monitorSession(sessionId, io);

    // Schedule recurring checks every 2 minutes
    const intervalId = setInterval(async () => {
      await monitorSession(sessionId, io);
    }, AGENT_INTERVAL_MS);

    // Register in the agent map
    activeAgents.set(sessionId, intervalId);

    console.log(`[Agent] Started for session ${sessionId}`);
  } catch (err) {
    console.error(`[Agent] Failed to start for session ${sessionId}:`, err.message);
    // Clean up if partially initialized
    activeAgents.delete(sessionId);
  }
}

// ---------------------------------------------------------------------------
// stopAgent
// ---------------------------------------------------------------------------

/**
 * Stops the monitoring agent for a session, clears the interval,
 * updates DB, and triggers final summary generation.
 *
 * @param {string} sessionId
 * @param {import('socket.io').Server} io
 */
async function stopAgent(sessionId, io) {
  // Clear the interval if it exists
  if (activeAgents.has(sessionId)) {
    clearInterval(activeAgents.get(sessionId));
    activeAgents.delete(sessionId);
  }

  try {
    // Mark session as agent-inactive in DB
    await prisma.session.update({
      where: { id: sessionId },
      data: { agentActive: false },
    });
  } catch (err) {
    // Session may already be deleted — non-fatal
    console.warn(`[Agent] Could not update agentActive=false for session ${sessionId}:`, err.message);
  }

  console.log(`[Agent] Stopped for session ${sessionId}`);

  // Generate session summary asynchronously (non-blocking)
  generateSessionSummary(sessionId, io).catch((err) =>
    console.error(`[Agent] generateSessionSummary error for session ${sessionId}:`, err.message)
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { startAgent, stopAgent, activeAgents };
