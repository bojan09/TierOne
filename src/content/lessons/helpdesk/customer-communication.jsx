import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomerCommunication() {
  return (
    <>
      <section>
        <p>The most underrated Tier-1 skill isn't technical — it's communication. Two technicians can apply the same fix; the one who communicates well is the one who gets hired and promoted.</p>
      </section>
      <section>
        <h2>The communication loop</h2>
        <ul>
          <li><strong>Acknowledge fast.</strong> A quick "I've got your ticket and I'm looking into it" beats silence, even before you have an answer.</li>
          <li><strong>Set expectations.</strong> Tell them what you're doing and roughly how long. Uncertainty is worse than bad news.</li>
          <li><strong>Translate.</strong> Explain in their terms — what it means for their work — not in jargon.</li>
          <li><strong>Close the loop.</strong> Confirm it's fixed, say what to do if it returns, and thank them for the report.</li>
        </ul>
      </section>
      <section>
        <h2>Escalating well</h2>
        <p>Escalation is a skill, not a failure. When you hand off, include the symptom, scope, what you've tried, and each result — so the next person starts with a head-start, not a blank ticket.</p>
        <div className="callout callout-info">
          <span className="callout-icon">🤝</span>
          <p className="callout-body"><strong>Tone under pressure is the product.</strong> Frustrated users calm down when they feel heard and informed. Empathy first, then the fix — that combination is what makes a memorable technician.</p>
        </div>
      </section>
      <section>
        <h2>You've reached the end of the track</h2>
        <p>From the support mindset to networks, accounts, M365, and communication — you now have the Tier-1 foundation. Head to the <Link to="/simulator">Virtual Help Desk</Link> to put it all together on realistic tickets.</p>
      </section>
    </>
  );
}
