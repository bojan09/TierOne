import React from 'react';

export default function HowNetworksWork() {
  return (
    <>
      <section>
        <p>You don't need to be a network engineer for Tier-1, but you do need a mental model of how a device reaches the internet — because that's the path most connectivity tickets travel.</p>
      </section>
      <section>
        <h2>The four things every device needs</h2>
        <ul>
          <li><strong>IP address</strong> — the device's address on the network (often handed out automatically by <strong>DHCP</strong>).</li>
          <li><strong>Subnet mask</strong> — defines which addresses are "local" vs. remote.</li>
          <li><strong>Default gateway</strong> — the router; the door out to other networks.</li>
          <li><strong>DNS server</strong> — translates names (example.com) into IP addresses.</li>
        </ul>
        <div className="callout callout-info">
          <span className="callout-icon">🌐</span>
          <p className="callout-body">Miss any one of these and symptoms differ: no IP = nothing works; no gateway = local only; no DNS = "internet is down" but IPs still ping. The symptom tells you which is missing.</p>
        </div>
      </section>
      <section>
        <h2>Names vs. numbers (DNS)</h2>
        <p>Humans use names; networks use numbers. <strong>DNS</strong> is the phone book. When a site won't load but the connection is otherwise fine, suspect DNS — it's behind a large fraction of "the internet is broken" reports.</p>
      </section>
      <section>
        <h2>Public vs. private</h2>
        <p>Inside the office, devices use <strong>private</strong> addresses; the router uses <strong>NAT</strong> to share one public address outward. You rarely change this, but knowing it explains why every device shows a 192.168.x.x or 10.x.x.x address.</p>
      </section>
    </>
  );
}
