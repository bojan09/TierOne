import React from 'react';

export default function Microsoft365Essentials() {
  return (
    <>
      <section>
        <p>Microsoft 365 is where most office work happens, so it's where most tickets land. You don't administer the tenant at Tier-1, but you support the apps people live in every day.</p>
      </section>
      <section>
        <h2>The apps you'll support most</h2>
        <ul>
          <li><strong>Outlook / Exchange</strong> — email and calendar. Connection issues, send/receive, shared mailboxes, calendar sharing.</li>
          <li><strong>Teams</strong> — chat, meetings, calls. Audio/video device selection, cache issues, missing channels.</li>
          <li><strong>OneDrive / SharePoint</strong> — file sync and shared sites. Sync conflicts, "file locked," sharing permissions.</li>
          <li><strong>Entra ID</strong> — the identity behind it all; sign-in and MFA issues surface here.</li>
        </ul>
      </section>
      <section>
        <h2>Patterns that repeat</h2>
        <ul>
          <li><strong>Sign-in / MFA</strong> — most M365 problems start at authentication. Confirm the account, password, and MFA approval before app-specific steps.</li>
          <li><strong>Cached credentials</strong> — after a password change, cached logins go stale (Outlook and Teams are frequent culprits).</li>
          <li><strong>Sync delays</strong> — OneDrive/Teams aren't instant; "missing" files often just haven't synced.</li>
        </ul>
        <div className="callout callout-info">
          <span className="callout-icon">☁️</span>
          <p className="callout-body"><strong>Triage trick:</strong> does it fail in the desktop app only, or in the browser version too? Browser-works-but-app-doesn't points at the local install or cached credentials, not the service.</p>
        </div>
      </section>
    </>
  );
}
