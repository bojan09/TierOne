import React from 'react';

export default function LaptopsAndMobileDevices() {
  return (
    <>
      <section>
        <p>
          A huge share of help-desk tickets involve laptops and phones — the
          devices people carry, drop, drain, and depend on. They pack the same
          computing into a smaller, less repairable package, which changes how you
          troubleshoot. Knowing what’s different keeps you from chasing the wrong
          fix.
        </p>
      </section>

      <section>
        <h2>What makes a laptop different</h2>
        <p>
          A laptop is a full computer with everything integrated: display, keyboard,
          trackpad, battery, and often soldered components you can’t easily upgrade.
        </p>
        <ul>
          <li><strong>Battery and adapter:</strong> the most common failure area. “Plugged in, not charging,” swollen batteries, or the wrong-wattage charger all show up constantly.</li>
          <li><strong>Integrated display:</strong> a cracked or black screen may still output to an external monitor — a quick way to isolate display vs system faults.</li>
          <li><strong>Function keys:</strong> brightness, volume, Wi-Fi toggle, and external-display switching often share the Fn keys — a surprising number of “broken” tickets are a toggled setting.</li>
          <li><strong>Limited upgrades:</strong> RAM or SSD may be soldered; heavier repairs go to hardware/depot, not Tier-1.</li>
          <li><strong>Docking stations:</strong> extend a laptop with power, monitors, and peripherals over one connection — and are themselves a frequent point of failure.</li>
        </ul>
      </section>

      <section>
        <h2>Common laptop tickets</h2>
        <ul>
          <li><strong>Won’t power on:</strong> check the adapter and a known-good outlet, battery seating, and try a power drain (hold power 15–30s).</li>
          <li><strong>Overheating / loud fan / slow:</strong> blocked vents, dust, or a runaway process; check with Task Manager.</li>
          <li><strong>No display:</strong> confirm brightness isn’t at zero and the external-display toggle, then test an external monitor.</li>
          <li><strong>No Wi-Fi:</strong> confirm the wireless toggle / airplane mode before deeper network steps.</li>
        </ul>
      </section>

      <section>
        <h2>Phones and tablets</h2>
        <p>
          Mobile devices run mobile operating systems — chiefly <strong>iOS</strong>
          (Apple) and <strong>Android</strong> (many vendors) — and mostly manage
          themselves, but a few issues dominate.
        </p>
        <ul>
          <li><strong>Storage full:</strong> blocks updates, photos, and mail sync — often the real cause of “my phone won’t update.”</li>
          <li><strong>Battery and charging:</strong> failing batteries, bad cables, or dirty ports.</li>
          <li><strong>Email/account sync:</strong> re-adding a corporate account or fixing app-specific settings.</li>
          <li><strong>Connectivity:</strong> Wi-Fi vs cellular, and using a phone as a mobile hotspot.</li>
        </ul>
        <p>
          Corporate phones are usually enrolled in <strong>MDM</strong>, so some
          settings are controlled centrally and a lost device can be wiped remotely.
        </p>
      </section>

      <section>
        <h2>How you approach it</h2>
        <p>
          Isolate methodically: power and battery first, then display (external
          monitor test), then connectivity, then software. Rule out the simple
          toggles and adapters before escalating hardware — and remember that on
          portable devices, “have you tried a different charger and cable” is a
          genuinely high-yield question.
        </p>
      </section>
    </>
  );
}
