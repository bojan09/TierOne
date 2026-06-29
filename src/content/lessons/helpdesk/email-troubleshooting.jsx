import React from 'react';

export default function EmailTroubleshooting() {
  return (
    <>
      <section>
        <p>Email is mission-critical and emotionally charged — when it breaks, people panic. A calm, structured approach resolves most cases quickly.</p>
      </section>
      <section>
        <h2>The classic: Outlook "disconnected"</h2>
        <p>You met this in the foundations lesson. The structured path:</p>
        <ol>
          <li>Confirm the network works (browse a site).</li>
          <li>Check the same account in <strong>webmail</strong> — if it works there, the problem is the local client, not the mailbox.</li>
          <li>Look for a stale cached password (clear it in Credential Manager).</li>
          <li>Restart Outlook; if needed, repair the profile.</li>
        </ol>
        <div className="callout callout-success">
          <span className="callout-icon">✓</span>
          <p className="callout-body"><strong>Webmail is your diagnostic shortcut.</strong> Works in webmail, fails in Outlook → local client/credentials. Fails in both → the account or the service.</p>
        </div>
      </section>
      <section>
        <h2>Other frequent tickets</h2>
        <ul>
          <li><strong>Not receiving mail</strong> — check Junk/Clutter, rules that auto-file, and whether the sender bounced.</li>
          <li><strong>Can't send</strong> — large attachment over the limit, or an authentication/connection issue.</li>
          <li><strong>Delivery failures</strong> — read the bounce message; it usually states the exact reason (bad address, mailbox full, blocked).</li>
        </ul>
      </section>
      <section>
        <h2>Always capture the error</h2>
        <p>Copy the exact bounce text or error code into the ticket. Paraphrased email errors are unsearchable and frequently misremembered.</p>
      </section>
    </>
  );
}
