import React from 'react';

export default function AuthenticationAndPasswords() {
  return (
    <>
      <section>
        <p>
          Almost every ticket you touch involves proving who someone is — resets,
          lockouts, new accounts, access requests. Authentication is the front door
          to everything, which makes it the single most attacked part of any
          organisation. Getting the fundamentals right is core help-desk work.
        </p>
      </section>

      <section>
        <h2>The three factors</h2>
        <p>
          Authentication is proving identity using one or more <strong>factors</strong>:
        </p>
        <ul>
          <li><strong>Something you know:</strong> a password, PIN, or security question.</li>
          <li><strong>Something you have:</strong> a phone with an authenticator app, a hardware key, a smart card.</li>
          <li><strong>Something you are:</strong> a biometric — fingerprint, face, iris.</li>
        </ul>
        <p>
          Using two or more <em>different</em> factors together is multi-factor
          authentication. Two passwords aren’t MFA; a password plus a phone code is.
        </p>
      </section>

      <section>
        <h2>Passwords done properly</h2>
        <p>
          Passwords remain the weakest link, so the guidance you give matters.
          Modern best practice has shifted from “complex and changed constantly” to
          “long, unique, and only changed when needed.”
        </p>
        <ul>
          <li><strong>Length beats complexity.</strong> A long passphrase like “correct-horse-battery-staple” is stronger and more memorable than “P@ss1!”.</li>
          <li><strong>Never reuse passwords.</strong> One breached site becomes many compromised accounts through credential stuffing.</li>
          <li><strong>Use a password manager.</strong> It generates and stores unique passwords so users don’t have to remember them.</li>
          <li><strong>Never share or store passwords in plain text</strong> — including in tickets, chats, or sticky notes.</li>
          <li><strong>Force a change only on evidence of compromise,</strong> not on a fixed schedule — forced rotation tends to produce weaker, predictable passwords.</li>
        </ul>
        <p>
          Common account policies you’ll work within: minimum length, lockout after
          a number of failed attempts, password history (can’t reuse the last N),
          and complexity requirements.
        </p>
      </section>

      <section>
        <h2>MFA: the highest-value control</h2>
        <p>
          Multi-factor authentication stops the large majority of account
          takeovers, because a stolen password alone is no longer enough. Know the
          common methods and their relative strength:
        </p>
        <ul>
          <li><strong>Authenticator app (TOTP):</strong> a rotating 6-digit code. Strong and free.</li>
          <li><strong>Push approval:</strong> tap “approve” on your phone. Convenient, but watch for “MFA fatigue” attacks where users approve spam prompts.</li>
          <li><strong>Hardware security key (FIDO2):</strong> the strongest common option — phishing-resistant.</li>
          <li><strong>SMS codes:</strong> better than nothing, but weakest — vulnerable to SIM-swapping. Prefer an app or key.</li>
        </ul>
        <p>
          A big part of Tier-1 work is helping users enrol in MFA and recover when
          they lose their device — following the verified process, never by simply
          turning MFA off.
        </p>
      </section>

      <section>
        <h2>SSO, lockouts, and your responsibilities</h2>
        <p>
          <strong>Single sign-on (SSO)</strong> lets one trusted login grant access
          to many apps — fewer passwords, fewer resets, and centralised control.
          When accounts lock out repeatedly, the usual culprit is a cached old
          password on another device retrying in the background.
        </p>
        <p>
          Two rules you never break: <strong>verify identity before any reset or
          unlock</strong> (attackers call the help desk too), and <strong>never
          transmit or store a user’s password</strong>. Set credentials to
          “must change at next logon” so only the user knows the final value.
        </p>
      </section>
    </>
  );
}
