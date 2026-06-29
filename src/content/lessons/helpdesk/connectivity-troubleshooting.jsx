import React from 'react';

export default function ConnectivityTroubleshooting() {
  return (
    <>
      <section>
        <p>"I can't connect" is the most common networking ticket. The method from the foundations lesson — work outward, one layer at a time — turns it from guesswork into a checklist.</p>
      </section>
      <section>
        <h2>The connectivity ladder</h2>
        <ol>
          <li><strong>Physical / Wi-Fi</strong> — cable seated? Connected to the right Wi-Fi? Airplane mode off?</li>
          <li><strong>Local IP</strong> — does the device have a valid address, or a self-assigned 169.254.x.x (which means DHCP failed)?</li>
          <li><strong>Gateway</strong> — can it reach the router?</li>
          <li><strong>Internet</strong> — can it reach a known public IP?</li>
          <li><strong>DNS</strong> — can it resolve names?</li>
        </ol>
        <p>The first rung that fails is where the problem lives. Stop there — don't keep climbing.</p>
      </section>
      <section>
        <h2>Reading the signs</h2>
        <div className="callout callout-warning">
          <span className="callout-icon">🔎</span>
          <p className="callout-body"><strong>169.254.x.x address</strong> = DHCP didn't respond (cable, switch, or DHCP issue). <strong>Pings IPs but not names</strong> = DNS. <strong>Nothing at all</strong> = physical/Wi-Fi. The address and what pings tell you almost everything.</p>
        </div>
      </section>
      <section>
        <h2>Quick wins that aren't cheating</h2>
        <p>Renewing the IP lease, reconnecting Wi-Fi, or a targeted restart genuinely fix transient faults. They're legitimate steps — just document what you did so a recurring problem isn't mistaken for a fixed one.</p>
      </section>
    </>
  );
}
