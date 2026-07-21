import { ctaButton, emailLayout, escapeHtml, paragraph, type EmailContent } from "../layout";

export function hostelApprovedEmail(input: {
  hostelName: string;
  loginUrl: string;
  /**
   * Present only when a brand-new account was created for the owner.
   * Existing accounts are upgraded in place and keep their credentials
   * (ARCHITECTURE.md §3.2).
   */
  credentials?: { email: string; temporaryPassword: string };
}): EmailContent {
  const credentialsBlock = input.credentials
    ? [
        paragraph(
          `Email: <strong>${escapeHtml(input.credentials.email)}</strong><br/>Temporary password: <strong>${escapeHtml(input.credentials.temporaryPassword)}</strong>`,
        ),
        paragraph("You will be asked to set a new password on first login."),
      ]
    : [
        paragraph(
          "Log in with the account you registered with — it has been upgraded to hostel admin access.",
        ),
      ];

  return {
    subject: `Your hostel is approved — ${input.hostelName}`,
    html: emailLayout({
      heading: "Hostel approved 🎉",
      bodyHtml: [
        paragraph(
          `<strong>${escapeHtml(input.hostelName)}</strong> has been approved and is now part of HostelHub.`,
        ),
        ...credentialsBlock,
        ctaButton(input.loginUrl, "Go to your dashboard"),
      ].join("\n"),
    }),
  };
}
