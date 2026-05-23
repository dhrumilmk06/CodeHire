import { Resend } from "resend";


const baseStyles = `
  body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; }
  .header { padding: 32px 40px; border-bottom: 1px solid #1a1a1a; }
  .logo { font-size: 22px; font-weight: 900; color: #00ff9d; letter-spacing: -0.5px; }
  .logo span { color: #ffffff; }
  .body { padding: 40px; }
  .badge { display: inline-block; padding: 6px 16px; border-radius: 100px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 28px; }
  h1 { font-size: 26px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; line-height: 1.3; }
  p { font-size: 15px; color: #a1a1aa; line-height: 1.7; margin: 0 0 16px 0; }
  .name { color: #ffffff; font-weight: 700; }
  .divider { border: none; border-top: 1px solid #1a1a1a; margin: 32px 0; }
  .footer { padding: 24px 40px; border-top: 1px solid #1a1a1a; }
  .footer p { font-size: 12px; color: #3f3f46; margin: 0; }
`;

function buildEmail({ subject, badgeColor, badgeBg, badgeText, candidateName, bodyHtml }) {
  return {
    subject,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Code<span>Hire</span></div>
    </div>
    <div class="body">
      <div class="badge" style="background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor}33;">
        ${badgeText}
      </div>
      <p>Hi <span class="name">${candidateName}</span>,</p>
      ${bodyHtml}
      <hr class="divider" />
      <p style="font-size: 13px; color: #71717a;">Best regards,<br/>The Hiring Team</p>
    </div>
    <div class="footer">
      <p>This email was sent via CodeHire Interview Platform</p>
    </div>
  </div>
</body>
</html>`
  };
}

export async function sendDecisionEmail({ candidateName, candidateEmail, jobRole, companyName, decision }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // DEV: Resend sandbox only allows sending to the account owner's email.
  // Set DEV_EMAIL_OVERRIDE in .env to redirect all emails there during development.
  // Remove this override once you've verified a domain at resend.com/domains.
  const toEmail = process.env.DEV_EMAIL_OVERRIDE || candidateEmail;
  if (process.env.DEV_EMAIL_OVERRIDE) {
    console.log(`[Decision Email] DEV MODE — redirecting email from ${candidateEmail} → ${toEmail}`);
  }

  let emailData;

  switch (decision) {
    case "move_forward":
      emailData = buildEmail({
        subject: `Great news from ${companyName} — You're moving forward! 🎉`,
        badgeColor: "#00ff9d",
        badgeBg: "#00ff9d15",
        badgeText: "✅ Moving Forward",
        candidateName,
        bodyHtml: `
          <h1>You're moving forward! 🎉</h1>
          <p>
            We're thrilled to share some exciting news — after reviewing your interview for the
            <strong style="color: #00ff9d;">${jobRole}</strong> position at <strong style="color: #ffffff;">${companyName}</strong>,
            the team was genuinely impressed by your performance and approach.
          </p>
          <p>
            Your problem-solving skills and technical ability stood out, and we're excited to continue this journey with you.
            The next steps will be shared with you very soon — keep an eye on your inbox!
          </p>
          <p>Thank you for the time and effort you put into this process. We look forward to what's ahead.</p>
        `
      });
      break;

    case "on_hold":
      emailData = buildEmail({
        subject: `Update on your ${jobRole} application at ${companyName}`,
        badgeColor: "#fbbf24",
        badgeBg: "#fbbf2415",
        badgeText: "⏸ On Hold",
        candidateName,
        bodyHtml: `
          <h1>An update on your application</h1>
          <p>
            Thank you for interviewing for the <strong style="color: #fbbf24;">${jobRole}</strong> position at
            <strong style="color: #ffffff;">${companyName}</strong>.
          </p>
          <p>
            Our team is still in the process of evaluating all candidates, and we want to be thoughtful in our decision.
            We haven't made a final determination yet, and we will be in touch as soon as we have more clarity.
          </p>
          <p>
            We genuinely appreciate your time, patience, and the effort you put into the interview. We'll reach out
            with an update as soon as possible.
          </p>
        `
      });
      break;

    case "rejected":
      emailData = buildEmail({
        subject: `Your ${jobRole} application at ${companyName}`,
        badgeColor: "#ef4444",
        badgeBg: "#ef444415",
        badgeText: "Application Update",
        candidateName,
        bodyHtml: `
          <h1>Thank you for your time</h1>
          <p>
            We sincerely appreciate you taking the time to interview for the
            <strong style="color: #ef4444;">${jobRole}</strong> position at <strong style="color: #ffffff;">${companyName}</strong>.
          </p>
          <p>
            After careful consideration, we have decided to move forward with other candidates whose experience more
            closely aligns with the current needs of the role. This was not an easy decision, as we had many strong applicants.
          </p>
          <p>
            Please know that this doesn't diminish your skills or potential in any way. We encourage you to keep building
            and wish you all the best in your search — we're confident the right opportunity is out there for you.
          </p>
        `
      });
      break;

    default:
      throw new Error(`Invalid decision: ${decision}`);
  }

  const result = await resend.emails.send({
    from: "CodeHire <onboarding@resend.dev>",
    to: toEmail,
    subject: emailData.subject,
    html: emailData.html,
  });

  // Resend returns errors in result.error instead of throwing — check manually
  if (result.error) {
    console.error("[Decision Email] Resend API error:", result.error);
    throw new Error(result.error.message || "Resend failed to deliver email");
  }

  console.log("[Decision Email] Sent successfully. ID:", result.data?.id);
  return result;
}
