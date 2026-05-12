import puppeteer from 'puppeteer';
import { prisma } from '../lib/db.js';
import path from 'path';
import fs from 'fs';

/**
 * GET /api/reports/:sessionId/generate
 * Only host can access this endpoint
 */
export const generateReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check if user is logged in (clerkId comes from protectRoute middleware)
    const clerkId = req.user?.clerkId;
    console.log("[ReportGen] Auth User Clerk ID:", clerkId);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    // Fetch complete session from database including host details
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        host: {
          select: { name: true, profileImage: true, email: true, clerkId: true }
        },
        participant: {
          select: { name: true, profileImage: true, email: true, clerkId: true }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    console.log("[ReportGen] Session Host ID:", session.hostId, "Comparison:", session.hostId === clerkId);
    // Security: Only the host can access this endpoint
    if (session.hostId !== clerkId) {
      return res.status(403).json({ message: "Forbidden - Only the host can generate this report" });
    }

    // For system-design sessions, fetch the most recent whiteboard snapshot
    let latestSnapshot = null;
    if (session.sessionType === 'system-design') {
      latestSnapshot = await prisma.whiteboardSnapshot.findFirst({
        where: { sessionId },
        orderBy: { createdAt: 'desc' }
      });
    }

    // Build HTML template with all session data
    const htmlContent = generateHTMLTemplate(session, latestSnapshot);

    // Use Puppeteer to convert HTML to PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm', bottom: '20mm',
        left: '15mm', right: '15mm'
      }
    });

    await browser.close();

    // Save PDF to BackEnd/reports/ folder
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `report-${sessionId}-${timestamp}.pdf`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    // Update session report_generated = true and report_url
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        report_generated: true,
        report_url: `/reports/${fileName}`
      }
    });

    // Send PDF as downloadable file in response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CodeHire-Report-${sessionId}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return res.status(500).json({
      message: 'Failed to generate PDF report',
      error: error.message
    });
  }
};

/**
 * Builds the HTML template for the report
 */
function generateHTMLTemplate(session, latestSnapshot = null) {
  const {
    host,
    participant,
    problem,
    difficulty,
    createdAt,
    testCasesPassed,
    rating,
    decision,
    problemCodes,
    ai_review,
    notes,
    hints,
    tags,
    timings,
    timeTaken,
    sessionType
  } = session;

  const isSystemDesign = sessionType === 'system-design';

  const candidateName = participant?.name || 'Candidate';
  const interviewerName = host?.name || 'Interviewer';
  const dateStr = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  // Calculate total duration from timings or use timeTaken
  let duration = timeTaken || 0;
  if (!duration && timings && Array.isArray(timings)) {
    duration = Math.round(timings.reduce((acc, t) => acc + (t.duration || 0), 0) / 60);
  }

  // Decision badge styling
  const decisionMap = {
    'move_forward': { label: 'Move Forward', color: '#22c55e', bg: '#f0fdf4' },
    'rejected': { label: 'Rejected', color: '#ef4444', bg: '#fef2f2' },
    'on_hold': { label: 'On Hold', color: '#eab308', bg: '#fefce8' }
  };
  const decisionData = decisionMap[decision] || { label: 'Pending', color: '#888888', bg: '#f9fafb' };

  // AI Review Recommendation badge
  const recMap = {
    'Strong Hire': { color: '#22c55e' },
    'Hire': { color: '#22c55e' },
    'Maybe': { color: '#eab308' },
    'No Hire': { color: '#ef4444' }
  };
  const recColor = (ai_review && recMap[ai_review.recommendation]?.color) || '#888888';

  // Get final code for current problem (only used for coding sessions)
  const finalCode = (problemCodes && problemCodes[problem]) || '// No code submitted for this problem';

  // Whiteboard snapshot data (system-design sessions)
  const snapshotImageSrc = latestSnapshot?.imageData || null;
  const snapshotLabel = latestSnapshot?.label || 'Final Design';
  const snapshotDate = latestSnapshot?.createdAt ? new Date(latestSnapshot.createdAt).toLocaleString() : '';
  const aiDesignScore = latestSnapshot?.aiScore ?? null;
  const aiDesignFeedback = latestSnapshot?.aiFeedback || null;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #ffffff;
            color: #1a1a1a;
            line-height: 1.5;
            padding: 0;
        }

        /* Header */
        header {
            background-color: #0a0a0a;
            color: white;
            padding: 40px;
            border-bottom: 4px solid #22c55e;
        }

        .header-content {
            max-width: 100%;
        }

        .logo {
            font-size: 24px;
            font-weight: 800;
            color: #22c55e;
            margin-bottom: 4px;
        }

        .subtitle {
            font-size: 14px;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 30px;
        }

        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
        }

        .meta-label {
            font-size: 11px;
            color: #888888;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .meta-value {
            font-size: 14px;
            font-weight: 600;
        }

        /* Section containers */
        section {
            padding: 30px 40px;
            border-bottom: 1px solid #e5e7eb;
        }

        .section-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        /* Performance Score */
        .score-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .score-card {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }

        .score-val {
            font-size: 24px;
            font-weight: 800;
            color: #22c55e;
            display: block;
        }

        .score-lbl {
            font-size: 11px;
            color: #888888;
            text-transform: uppercase;
        }

        .decision-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 20px;
            border: 1px solid;
        }

        /* Code Block */
        .code-container {
            background-color: #0d1117;
            padding: 20px;
            border-radius: 8px;
            position: relative;
        }

        pre {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            color: #e6edf3;
            white-space: pre-wrap;
            word-break: break-all;
        }

        /* AI Review Side-by-side */
        .ai-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }

        .ai-card {
            background-color: #f9fafb;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }

        .list-unstyled {
            list-style: none;
            margin-top: 10px;
        }

        .list-unstyled li {
            margin-bottom: 6px;
            font-size: 13px;
        }

        .progress-bar-container {
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            width: 100%;
            margin: 10px 0;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background-color: #22c55e;
        }

        .rec-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            display: inline-block;
        }

        /* Notes */
        .notes-box {
            border-left: 4px solid #22c55e;
            padding: 4px 15px;
            font-size: 14px;
            color: #374151;
        }

        /* Tags */
        .pill-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .pill {
            padding: 4px 12px;
            border-radius: 20px;
            border: 1px solid #22c55e;
            color: #22c55e;
            font-size: 11px;
            font-weight: 600;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 30px;
            color: #888888;
            font-size: 11px;
        }

        /* Utilities */
        .text-summary {
            font-size: 14px;
            color: #374151;
            margin-bottom: 15px;
        }

        .mb-10 { margin-bottom: 10px; }
        .mt-10 { margin-top: 10px; }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">CodeHire</div>
            <div class="subtitle">Interview Report Card</div>
            <div class="meta-grid">
                <div class="meta-item">
                    <span class="meta-label">Candidate</span>
                    <span class="meta-value">${candidateName}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Interviewer</span>
                    <span class="meta-value">${interviewerName}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Date</span>
                    <span class="meta-value">${dateStr}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Problem</span>
                    <span class="meta-value">${problem}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Duration</span>
                    <span class="meta-value">${duration} min</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Session ID</span>
                    <span class="meta-value">${session.id}</span>
                </div>
            </div>
        </div>
    </header>

    <section>
        <div class="section-title">Performance Score</div>
        <div class="score-grid">
            <div class="score-card">
                <span class="score-val">${testCasesPassed || '0/0'}</span>
                <span class="score-lbl">Auto Score</span>
            </div>
            <div class="score-card">
                <span class="score-val">${'⭐'.repeat(rating || 0)}</span>
                <span class="score-lbl">Host Rating (${rating || 0}/5)</span>
            </div>
            <div class="score-card">
                <span class="score-val">${(ai_review && ai_review.overallRating) ? ai_review.overallRating + '/10' : 'N/A'}</span>
                <span class="score-lbl">AI Rating</span>
            </div>
        </div>
        <div class="decision-badge" style="color: ${decisionData.color}; background-color: ${decisionData.bg}; border-color: ${decisionData.color}">
            ${decisionData.label}
        </div>
    </section>

    ${isSystemDesign ? `
    <section>
        <div class="section-title">🖊️ Whiteboard Design</div>
        ${snapshotImageSrc ? `
        <div style="margin-bottom:20px;">
            <p style="font-size:12px;color:#888;margin-bottom:8px;">${snapshotLabel} &mdash; ${snapshotDate}</p>
            <img
                src="${snapshotImageSrc}"
                alt="Whiteboard Snapshot"
                style="width:100%;border-radius:8px;border:1px solid #e5e7eb;"
            />
        </div>
        ` : `<p style="color:#888;font-size:13px;">No snapshot was saved during this session.</p>`}

        ${aiDesignScore !== null ? `
        <div style="margin-top:20px;">
            <div class="score-grid">
                <div class="score-card">
                    <span class="score-val">${aiDesignScore}/100</span>
                    <span class="score-lbl">AI Design Score</span>
                </div>
                <div class="score-card" style="grid-column:span 2;text-align:left;">
                    <span class="meta-label">AI Feedback Summary</span>
                    <p style="font-size:13px;color:#374151;margin-top:8px;line-height:1.6;">${aiDesignFeedback || 'No feedback available.'}</p>
                </div>
            </div>
        </div>
        ` : `
        <div style="margin-top:16px;padding:12px 16px;background:#fefce8;border:1px solid #eab308;border-radius:8px;">
            <p style="font-size:12px;color:#854d0e;font-weight:600;">⚠️ No AI design review was run for this session. Use the "Run AI Review" button in the session card to add a score before generating the report.</p>
        </div>
        `}
    </section>
    ` : `
    <section>
        <div class="section-title">Final Code Submitted</div>
        <div class="code-container">
            <pre><code>${finalCode}</code></pre>
        </div>
    </section>
    `}

    ${ai_review ? `
    <section>
        <div class="section-title">AI Code Review</div>
        <p class="text-summary">${ai_review.summary || session.agentSummary || ''}</p>
        
        <div class="ai-grid">
            <div class="ai-card">
                <span class="meta-label">Time Complexity</span>
                <p class="meta-value">${ai_review.timeComplexity || 'N/A'}</p>
            </div>
            <div class="ai-card">
                <span class="meta-label">Space Complexity</span>
                <p class="meta-value">${ai_review.spaceComplexity || 'N/A'}</p>
            </div>
            <div class="ai-card">
                <span class="meta-label">Code Quality</span>
                <p class="meta-value">${ai_review.codeQuality || 'N/A'}</p>
            </div>
            <div class="ai-card">
                <span class="meta-label">Problem Solving Approach</span>
                <p class="meta-value">${ai_review.problemSolvingApproach || 'N/A'}</p>
            </div>
        </div>

        <div class="ai-grid mt-10">
            <div>
                <span class="meta-label">Strengths</span>
                <ul class="list-unstyled">
                    ${(ai_review.strengths || []).map(s => `<li>✅ ${s}</li>`).join('')}
                </ul>
            </div>
            <div>
                <span class="meta-label">Improvements</span>
                <ul class="list-unstyled">
                    ${(ai_review.improvements || []).map(i => `<li>💡 ${i}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="mt-10">
            <span class="meta-label">Overall AI Rating</span>
            <div class="progress-bar-container">
                <div class="progress-fill" style="width: ${(ai_review.overallRating || 0) * 10}%"></div>
            </div>
            <div class="rec-badge" style="background-color: ${recColor}">
                Recommendation: ${ai_review.recommendation || 'N/A'}
            </div>
        </div>
    </section>
    ` : ''}

    ${notes ? `
    <section>
        <div class="section-title">Interviewer Notes</div>
        <div class="notes-box">
            ${notes}
        </div>
    </section>
    ` : ''}

    ${(hints && Array.isArray(hints) && hints.length > 0) ? `
    <section>
        <div class="section-title">AI Hints Provided (${hints.length})</div>
        <ul class="list-unstyled">
            ${hints.map(h => `<li class="notes-box mb-10">${typeof h === 'string' ? h : h.hint}</li>`).join('')}
        </ul>
    </section>
    ` : ''}

    ${(tags && Array.isArray(tags) && tags.length > 0) ? `
    <section>
        <div class="section-title">Tags</div>
        <div class="pill-container">
            ${tags.map(t => `<span class="pill">${t}</span>`).join('')}
        </div>
    </section>
    ` : ''}

    <footer>
        "Generated by CodeHire • ${dateStr} • Confidential"
    </footer>
</body>
</html>
  `;
}
