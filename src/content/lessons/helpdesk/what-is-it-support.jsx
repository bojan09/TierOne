import React from 'react';

/**
 * Pure lesson body (content only). Chrome, XP and nav are supplied by the
 * spine-driven LessonView via LessonChrome. Lazily loaded by slug.
 */
export default function WhatIsItSupport() {
  return (
    <>
      <section>
        <p>
          IT support is the function that keeps people working. When something a
          person relies on stops behaving — email, a printer, a login, a shared
          drive — support is who they turn to. The job is not really about
          computers; it is about <strong>removing obstacles for humans</strong>{' '}
          quickly, calmly, and in a way they can trust.
        </p>
      </section>

      <section>
        <h2>The support tiers</h2>
        <p>
          Most organisations structure support in tiers. Knowing where you sit
          tells you what to solve and when to hand off.
        </p>
        <ul>
          <li>
            <strong>Tier 1 (Help Desk):</strong> first contact. Password resets,
            account lockouts, connectivity, “it won’t open,” basic how-to. Fast
            triage; resolve the common cases, route the rest.
          </li>
          <li>
            <strong>Tier 2 (Desktop / Technical Support):</strong> deeper
            hardware, software, and configuration issues that Tier 1 escalates.
          </li>
          <li>
            <strong>Tier 3 (System / Network Administration):</strong> servers,
            infrastructure, and root-cause fixes that affect many users at once.
          </li>
        </ul>
        <div className="callout callout-info">
          <span className="callout-icon">💡</span>
          <p className="callout-body">
            <strong>Escalation is a skill, not a failure.</strong> Knowing the
            boundary of your tier — and handing off cleanly with good notes — is
            what makes you valuable, not the appearance of solving everything
            alone.
          </p>
        </div>
      </section>

      <section>
        <h2>The ticket is the unit of work</h2>
        <p>
          Almost everything you do flows through a <strong>ticket</strong> — a
          record of one request or problem, from the moment it’s reported to the
          moment it’s resolved and closed. A ticket gives the work a history,
          an owner, and a status, so nothing falls through the cracks and the
          next person can pick up where you left off.
        </p>
        <p>
          Tickets are also measured. The <strong>SLA</strong> (service level
          agreement) sets the target time to respond and resolve based on
          priority. A single user who can’t print is not the same priority as a
          finance team that can’t access the system on payroll day.
        </p>
      </section>

      <section>
        <h2>The mindset that gets you hired</h2>
        <ul>
          <li>
            <strong>Empathy first.</strong> The person is frustrated and often
            embarrassed. Acknowledge the impact before diving into the fix.
          </li>
          <li>
            <strong>Curiosity over guessing.</strong> Good support is
            investigation, not pattern-matching to the last thing that worked.
          </li>
          <li>
            <strong>Write it down.</strong> If it isn’t documented, it didn’t
            happen — and someone will solve the same problem from scratch
            tomorrow.
          </li>
        </ul>
        <div className="callout callout-success">
          <span className="callout-icon">🎯</span>
          <p className="callout-body">
            <strong>Takeaway:</strong> your real product is trust delivered under
            pressure. The technical skills are how you deliver it — the next
            lessons build the method.
          </p>
        </div>
      </section>
    </>
  );
}
