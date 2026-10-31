import PDFDocument from 'pdfkit';

/**
 * Generates a clean, professional PDF report card for a session using pure PDFKit.
 * This runs in any Node.js environment with zero external binary or Chromium dependencies.
 *
 * @param {Object} session - The session document from Prisma
 * @param {Object|null} latestSnapshot - Optional whiteboard snapshot for system-design sessions
 * @returns {Promise<Buffer>} The generated PDF buffer
 */
export function generatePDFWithPDFKit(session, latestSnapshot = null) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `CodeHire Interview Report - ${session.id}`,
          Author: 'CodeHire Platform',
          Subject: 'Interview Evaluation & Code Review',
          Keywords: 'CodeHire, Interview, Evaluation, Report'
        }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const candidateName = session.participant?.name || 'Candidate';
      const interviewerName = session.host?.name || 'Interviewer';
      const dateStr = new Date(session.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Calculate total duration
      let duration = session.timeTaken || 0;
      if (!duration && session.timings && Array.isArray(session.timings)) {
        duration = Math.round(session.timings.reduce((acc, t) => acc + (t.duration || 0), 0) / 60);
      }

      const isSystemDesign = session.sessionType === 'system-design';

      // ── 1. HEADER (Dark sleek banner) ──────────────────────────────────────
      const headerHeight = 115;
      doc.rect(0, 0, doc.page.width, headerHeight).fill('#0a0a0a');

      // CodeHire logo + Subtitle
      doc.fillColor('#22c55e').fontSize(22).font('Helvetica-Bold').text('CodeHire', 40, 22);
      doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('CANDIDATE INTERVIEW REPORT CARD', 40, 48);

      // Metadata Grid in Header
      const metaY1 = 70;
      const metaY2 = 88;
      const col1 = 40;
      const col2 = 210;
      const col3 = 380;

      doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold');
      doc.text('CANDIDATE', col1, metaY1);
      doc.text('INTERVIEWER', col2, metaY1);
      doc.text('DATE', col3, metaY1);

      doc.fillColor('#ffffff').fontSize(10).font('Helvetica');
      doc.text(candidateName, col1, metaY2 - 6, { width: 160, ellipsis: true });
      doc.text(interviewerName, col2, metaY2 - 6, { width: 160, ellipsis: true });
      doc.text(dateStr, col3, metaY2 - 6, { width: 140, ellipsis: true });

      doc.y = headerHeight + 20;

      // ── 2. SESSION OVERVIEW ────────────────────────────────────────────────
      doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Evaluation Summary');
      doc.moveDown(0.5);

      const cardsY = doc.y;
      const cardW = 160;
      const cardH = 55;

      // Card 1: Score
      doc.roundedRect(40, cardsY, cardW, cardH, 6).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#22c55e').fontSize(18).font('Helvetica-Bold')
         .text(session.testCasesPassed || '0/0', 40, cardsY + 10, { width: cardW, align: 'center' });
      doc.fillColor('#64748b').fontSize(8).font('Helvetica')
         .text('AUTO SCORE', 40, cardsY + 34, { width: cardW, align: 'center' });

      // Card 2: Rating
      doc.roundedRect(210, cardsY, cardW, cardH, 6).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#eab308').fontSize(18).font('Helvetica-Bold')
         .text(`${session.rating || 0} / 5`, 210, cardsY + 10, { width: cardW, align: 'center' });
      doc.fillColor('#64748b').fontSize(8).font('Helvetica')
         .text('HOST RATING', 210, cardsY + 34, { width: cardW, align: 'center' });

      // Card 3: AI Overall
      const aiScoreText = (session.ai_review && session.ai_review.overallRating)
        ? `${session.ai_review.overallRating} / 10`
        : (latestSnapshot?.aiScore ? `${latestSnapshot.aiScore} / 100` : 'N/A');
      doc.roundedRect(380, cardsY, cardW, cardH, 6).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#3b82f6').fontSize(18).font('Helvetica-Bold')
         .text(aiScoreText, 380, cardsY + 10, { width: cardW, align: 'center' });
      doc.fillColor('#64748b').fontSize(8).font('Helvetica')
         .text('AI RATING', 380, cardsY + 34, { width: cardW, align: 'center' });

      // Decision Badge
      doc.y = cardsY + cardH + 12;
      const decMap = {
        'move_forward': { label: 'DECISION: MOVE FORWARD', color: '#166534', bg: '#dcfce7', border: '#22c55e' },
        'rejected': { label: 'DECISION: REJECTED', color: '#991b1b', bg: '#fee2e2', border: '#ef4444' },
        'on_hold': { label: 'DECISION: ON HOLD', color: '#854d0e', bg: '#fef9c3', border: '#eab308' }
      };
      const dec = decMap[session.decision] || { label: 'DECISION: PENDING', color: '#475569', bg: '#f1f5f9', border: '#94a3b8' };

      const badgeW = 200;
      doc.roundedRect(40, doc.y, badgeW, 24, 4).fillAndStroke(dec.bg, dec.border);
      doc.fillColor(dec.color).fontSize(9).font('Helvetica-Bold')
         .text(dec.label, 40, doc.y + 6, { width: badgeW, align: 'center' });

      // Problem info tag
      doc.fillColor('#64748b').fontSize(9).font('Helvetica')
         .text(`Problem: ${session.problem || 'Coding Problem'}  •  Duration: ${duration} min`, 260, doc.y + 6);

      doc.y += 34;

      // ── 3. WHITEBOARD (System Design) OR CODE SUBMISSION (Coding) ──────────
      if (isSystemDesign) {
        doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('System Design Whiteboard');
        doc.moveDown(0.3);

        if (latestSnapshot?.imageData) {
          try {
            const base64Data = latestSnapshot.imageData.replace(/^data:image\/\w+;base64,/, '');
            const imgBuffer = Buffer.from(base64Data, 'base64');
            doc.image(imgBuffer, { fit: [515, 220], align: 'center' });
            doc.moveDown(0.5);
          } catch (e) {
            doc.fillColor('#64748b').fontSize(9).font('Helvetica')
               .text('[Snapshot preview could not be rendered]', { italic: true });
          }
        } else {
          doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('No snapshot saved for this session.');
          doc.moveDown(0.5);
        }

        if (latestSnapshot?.aiScore || latestSnapshot?.aiFeedback) {
          doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text('AI Design Feedback:');
          doc.fillColor('#334155').fontSize(9).font('Helvetica')
             .text(latestSnapshot.aiFeedback || 'Evaluation completed.', { lineGap: 2 });
          doc.moveDown(0.8);
        }
      } else {
        const finalCode = (session.problemCodes && session.problemCodes[session.problem])
          || (session.problemCodes && Object.values(session.problemCodes)[0])
          || '// No code submitted during this session';

        doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Final Code Submission');
        doc.moveDown(0.4);

        const lines = finalCode.split('\n');
        const displayLines = lines.slice(0, 30);
        const codeText = displayLines.join('\n') + (lines.length > 30 ? '\n// ... [code truncated for report]' : '');
        const codeBoxH = Math.min(220, Math.max(60, displayLines.length * 11 + 18));

        // Ensure box fits on current page
        if (doc.y + codeBoxH > doc.page.height - 70) {
          doc.addPage();
        }

        const boxY = doc.y;
        doc.roundedRect(40, boxY, doc.page.width - 80, codeBoxH, 6).fill('#0d1117');
        doc.fillColor('#e2e8f0').fontSize(8).font('Courier')
           .text(codeText, 50, boxY + 10, {
             width: doc.page.width - 100,
             height: codeBoxH - 18,
             lineGap: 1
           });

        doc.y = boxY + codeBoxH + 15;
      }

      // ── 4. AI CODE REVIEW ──────────────────────────────────────────────────
      if (session.ai_review) {
        const rev = session.ai_review;

        if (doc.y > doc.page.height - 180) {
          doc.addPage();
        }

        doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('AI Technical Review');
        doc.moveDown(0.3);

        if (rev.summary) {
          doc.fillColor('#334155').fontSize(9).font('Helvetica')
             .text(rev.summary, { lineGap: 2 });
          doc.moveDown(0.6);
        }

        // Metrics Row
        const revGridY = doc.y;
        doc.roundedRect(40, revGridY, doc.page.width - 80, 40, 4).fillAndStroke('#f8fafc', '#e2e8f0');

        doc.fillColor('#64748b').fontSize(7).font('Helvetica-Bold');
        doc.text('TIME COMPLEXITY', 50, revGridY + 8);
        doc.text('SPACE COMPLEXITY', 180, revGridY + 8);
        doc.text('CODE QUALITY', 320, revGridY + 8);
        doc.text('RECOMMENDATION', 440, revGridY + 8);

        doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold');
        doc.text(rev.timeComplexity || 'N/A', 50, revGridY + 22, { width: 120, ellipsis: true });
        doc.text(rev.spaceComplexity || 'N/A', 180, revGridY + 22, { width: 120, ellipsis: true });
        doc.text(rev.codeQuality || 'N/A', 320, revGridY + 22, { width: 110, ellipsis: true });
        doc.text(rev.recommendation || 'N/A', 440, revGridY + 22, { width: 100, ellipsis: true });

        doc.y = revGridY + 48;

        // Strengths & Improvements
        if (Array.isArray(rev.strengths) && rev.strengths.length > 0) {
          doc.fillColor('#166534').fontSize(9).font('Helvetica-Bold').text('Key Strengths:');
          doc.fillColor('#334155').font('Helvetica').fontSize(8.5);
          rev.strengths.forEach(s => doc.text(`  + ${s}`));
          doc.moveDown(0.4);
        }

        if (Array.isArray(rev.improvements) && rev.improvements.length > 0) {
          doc.fillColor('#9a3412').fontSize(9).font('Helvetica-Bold').text('Areas for Improvement:');
          doc.fillColor('#334155').font('Helvetica').fontSize(8.5);
          rev.improvements.forEach(i => doc.text(`  * ${i}`));
          doc.moveDown(0.4);
        }
      }

      // ── 5. INTERVIEWER NOTES ───────────────────────────────────────────────
      if (session.notes) {
        if (doc.y > doc.page.height - 120) {
          doc.addPage();
        }

        doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('Interviewer Notes');
        doc.moveDown(0.3);

        const notesY = doc.y;
        doc.rect(40, notesY, 4, 30).fill('#22c55e');
        doc.fillColor('#334155').fontSize(9).font('Helvetica')
           .text(session.notes, 52, notesY + 2, { width: doc.page.width - 100, lineGap: 2 });
        doc.moveDown(1);
      }

      // ── 6. FOOTER ──────────────────────────────────────────────────────────
      const footerY = doc.page.height - 30;
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
         .text(`Generated by CodeHire • ${dateStr} • Confidential Assessment`, 40, footerY, {
           width: doc.page.width - 80,
           align: 'center'
         });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
