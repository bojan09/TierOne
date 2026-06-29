import React from 'react';

export default function HardwareEssentials() {
  return (
    <>
      <section>
        <p>You can't fix what you can't name. Tier-1 support starts with recognising the parts of a machine and what each one does when it misbehaves.</p>
      </section>
      <section>
        <h2>The core components</h2>
        <ul>
          <li><strong>CPU</strong> — the processor; does the work. Rarely the cause of "slow," but heat or 100% usage shows here.</li>
          <li><strong>RAM</strong> — short-term memory. Too little = constant disk swapping = sluggish, frozen apps.</li>
          <li><strong>Storage (SSD/HDD)</strong> — where files and the OS live. A failing or full drive is one of the most common "slow computer" causes.</li>
          <li><strong>Motherboard, PSU, GPU</strong> — the board ties it together; the power supply feeds it; the GPU drives displays.</li>
          <li><strong>Peripherals</strong> — keyboard, mouse, monitor, dock, printer. Half of "my computer is broken" tickets are a peripheral or a cable.</li>
        </ul>
      </section>
      <section>
        <h2>The support reflex</h2>
        <p>Before assuming a deep fault, check the boring physical layer: power, cables, connections, and whether the right device is selected. It resolves a surprising share of tickets in seconds.</p>
        <div className="callout callout-info">
          <span className="callout-icon">🔌</span>
          <p className="callout-body"><strong>Symptom → suspect:</strong> slow = RAM/disk; no display = cable/GPU/monitor input; no power = PSU/outlet; random shutdowns = heat/power. Match the symptom to the part before you touch settings.</p>
        </div>
      </section>
    </>
  );
}
