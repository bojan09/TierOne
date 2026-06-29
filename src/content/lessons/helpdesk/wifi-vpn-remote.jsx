import React from 'react';

export default function WifiVpnRemote() {
  return (
    <>
      <section>
        <p>Remote and hybrid work moved a lot of support off the office network. Wi-Fi quirks and VPN issues are now daily tickets.</p>
      </section>
      <section>
        <h2>Wi-Fi: signal vs. connection</h2>
        <ul>
          <li><strong>Weak signal</strong> — distance, walls, interference. Symptoms: drops, slowness. Fix: move closer, change band/channel.</li>
          <li><strong>Connected but no internet</strong> — usually DHCP/DNS or a captive portal (hotel/airport login page) not completed.</li>
          <li><strong>Wrong network</strong> — auto-joined a neighbour's or guest SSID. Check what they're actually on.</li>
        </ul>
      </section>
      <section>
        <h2>VPN: the secure tunnel</h2>
        <p>A <strong>VPN</strong> creates an encrypted tunnel from the user's device into the company network so they can reach internal resources from home. Common failures:</p>
        <ul>
          <li><strong>Won't connect</strong> — no underlying internet first (check that before the VPN), expired credentials, or MFA not approved.</li>
          <li><strong>Connects but resources fail</strong> — DNS or routing inside the tunnel; often a reconnect or profile refresh.</li>
          <li><strong>Everything slow on VPN</strong> — all traffic routed through the tunnel; expected, sometimes adjustable.</li>
        </ul>
        <div className="callout callout-info">
          <span className="callout-icon">🔐</span>
          <p className="callout-body"><strong>First question for any VPN ticket:</strong> "Does the internet work without the VPN?" If not, you're solving a connectivity problem, not a VPN one.</p>
        </div>
      </section>
    </>
  );
}
