import React from 'react';

export default function TicketsAndDocumentation() {
  return (
    <>
      <section>
        <p>
          A ticket is not paperwork you do <em>after</em> the real work — it{' '}
          <strong>is</strong> the work, written down. Good ticket-writing is one
          of the most visible signals of a professional, and it’s the first
          thing a hiring manager can judge from your portfolio.
        </p>
      </section>

      <section>
        <h2>Anatomy of a useful ticket</h2>
        <ul>
          <li>
            <strong>Title:</strong> specific and searchable. “Outlook
            disconnected after password change” — not “email broken.”
          </li>
          <li>
            <strong>Affected user &amp; scope:</strong> who, and how many. One
            person, a team, a site?
          </li>
          <li>
            <strong>Symptom:</strong> exactly what happens, including the precise
            error text and when it started.
          </li>
          <li>
            <strong>Steps taken:</strong> what you tried, in order, and the
            result of each — so no one repeats your work.
          </li>
          <li>
            <strong>Resolution &amp; root cause:</strong> what actually fixed it
            and <em>why</em> it broke. “Restarted it” is not a root cause.
          </li>
        </ul>
      </section>

      <section>
        <h2>Write for the next person</h2>
        <p>
          Assume a colleague — or future you — will read this ticket in six
          months with zero memory of today. Two habits make that reader’s life
          easy:
        </p>
        <ol>
          <li>
            <strong>Capture the error verbatim.</strong> Copy the exact message
            or code. Paraphrased errors are unsearchable and often wrong.
          </li>
          <li>
            <strong>Separate cause from fix.</strong> The cause explains; the fix
            resolves. A ticket with both becomes a reusable knowledge-base
            article.
          </li>
        </ol>
      </section>

      <section>
        <h2>Weak vs. strong — same incident</h2>
        <div className="callout callout-danger">
          <span className="callout-icon">✗</span>
          <p className="callout-body">
            <strong>Weak</strong>
            “User couldn’t get email. Fixed it. Closed.”
          </p>
        </div>
        <div className="callout callout-success">
          <span className="callout-icon">✓</span>
          <p className="callout-body">
            <strong>Strong</strong>
            Symptom: Outlook showed “Disconnected” and prompted for a password
            repeatedly after the user’s account password was reset this morning.
            Scope: 1 user. Steps: confirmed network OK; confirmed new password
            works in webmail; cleared cached credentials in Credential Manager.
            Root cause: Windows had cached the old password. Fix: removed stale
            Outlook entry from Credential Manager; Outlook reconnected.
          </p>
        </div>
      </section>

      <section>
        <h2>Customer communication</h2>
        <ul>
          <li>
            <strong>Acknowledge fast,</strong> even before you have an answer —
            silence reads as neglect.
          </li>
          <li>
            <strong>Explain in their language,</strong> not jargon. They want to
            know when they can work again.
          </li>
          <li>
            <strong>Close the loop.</strong> Tell them it’s fixed, what to do if
            it returns, and thank them for the report.
          </li>
        </ul>
        <div className="callout callout-info">
          <span className="callout-icon">📌</span>
          <p className="callout-body">
            <strong>Takeaway:</strong> a clear ticket resolves one incident; a
            clear, root-caused ticket prevents the next ten and shows you think
            like an engineer. That’s the habit the Virtual Help Desk will drill.
          </p>
        </div>
      </section>
    </>
  );
}
