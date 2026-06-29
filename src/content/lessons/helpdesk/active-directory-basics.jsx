import React from 'react';

export default function ActiveDirectoryBasics() {
  return (
    <>
      <section>
        <p>In most Windows workplaces, identities live in <strong>Active Directory</strong> (AD) — or its cloud counterpart, Entra ID. As Tier-1 you won't redesign it, but you'll perform its three most common tasks constantly.</p>
      </section>
      <section>
        <h2>The three tasks you'll own</h2>
        <ul>
          <li><strong>Password reset</strong> — by far the most frequent ticket. Reset, set "must change at next logon," and confirm the user can sign in.</li>
          <li><strong>Account unlock</strong> — too many wrong attempts locks the account. Unlock, then check <em>why</em> (a phone with an old saved password is a classic repeat-offender).</li>
          <li><strong>Group membership</strong> — adding/removing a user from a group grants or revokes access to shared resources (tie this back to users/groups/permissions).</li>
        </ul>
      </section>
      <section>
        <h2>Key building blocks</h2>
        <ul>
          <li><strong>Users</strong> — one identity per person.</li>
          <li><strong>Groups</strong> — bundles of users that get access together.</li>
          <li><strong>Organisational Units (OUs)</strong> — folders that organise objects and where policy is applied.</li>
          <li><strong>Group Policy</strong> — centrally enforced settings (you'll go deep on this in the SysAdmin track).</li>
        </ul>
        <div className="callout callout-warning">
          <span className="callout-icon">🔁</span>
          <p className="callout-body"><strong>Recurring lockouts</strong> almost always trace to a cached old password — a mapped drive, a phone's mail app, or a saved Wi-Fi credential. Fix the source, not just the symptom.</p>
        </div>
      </section>
    </>
  );
}
