import React from 'react';
import CodeBlock from '@/components/CodeBlock.jsx';

const LAYERED_CHECK = `# Work outward from the machine, one layer at a time
ipconfig /all            # Does the device have a valid IP + gateway?
ping 127.0.0.1           # Is the network stack alive locally?
ping 192.168.1.1         # Can we reach the local gateway?
ping 8.8.8.8             # Can we reach the internet by IP?
nslookup example.com     # Does name resolution (DNS) work?`;

export default function TroubleshootingMethodology() {
  return (
    <>
      <section>
        <p>
          The difference between a beginner and a professional isn’t how many
          fixes they’ve memorised — it’s that the professional follows a{' '}
          <strong>repeatable method</strong>. A method means you get to the
          answer the same reliable way whether you’ve seen the problem before or
          not.
        </p>
      </section>

      <section>
        <h2>The loop</h2>
        <ol>
          <li>
            <strong>Reproduce / confirm.</strong> See the actual symptom
            yourself. “It’s broken” is not a symptom — “Outlook shows
            ‘disconnected’ and won’t send” is.
          </li>
          <li>
            <strong>Gather information.</strong> What changed? When did it start?
            Who is affected — one person or many? One user points to the device
            or account; many points to a shared system.
          </li>
          <li>
            <strong>Form a hypothesis.</strong> A single, testable guess: “DNS
            isn’t resolving for this machine.”
          </li>
          <li>
            <strong>Test it — change one thing at a time.</strong> If you change
            three things and it works, you don’t know what fixed it (and can’t
            document it).
          </li>
          <li>
            <strong>Fix, then verify.</strong> Confirm with the user that the
            real-world task now works — not just that your test passed.
          </li>
          <li>
            <strong>Document and close.</strong> Record the cause and the fix so
            the next person doesn’t start from zero.
          </li>
        </ol>
      </section>

      <section>
        <h2>Divide and conquer</h2>
        <p>
          When a problem could live anywhere along a chain, don’t test randomly —
          split the chain in half and test the middle. Network issues are the
          classic example: check each layer outward from the device until one
          fails. The first failing step is where the problem lives.
        </p>
        <CodeBlock language="bash" code={LAYERED_CHECK} />
        <div className="callout callout-info">
          <span className="callout-icon">🧭</span>
          <p className="callout-body">
            <strong>Read the first failure, not the last.</strong> If{' '}
            <code>ping 8.8.8.8</code> works but <code>nslookup</code> fails, the
            network is fine and DNS is your culprit — stop looking at cables.
          </p>
        </div>
      </section>

      <section>
        <h2>When to escalate</h2>
        <p>Escalate — with your notes attached — when any of these are true:</p>
        <ul>
          <li>You’ve exhausted what your tier and access allow.</li>
          <li>
            The fix requires authority or change-control you don’t have.
          </li>
          <li>
            The impact is severe (many users, critical system) and speed matters
            more than solving it solo.
          </li>
        </ul>
        <div className="callout callout-warning">
          <span className="callout-icon">⚠️</span>
          <p className="callout-body">
            <strong>Never escalate empty-handed.</strong> A good escalation
            includes the symptom, who/what is affected, what you’ve already
            tried, and the result of each test. That’s the difference between
            handing off a problem and handing off a head-start.
          </p>
        </div>
      </section>
    </>
  );
}
