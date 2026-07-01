import React from 'react';

export default function PeripheralsAndDisplays() {
  return (
    <>
      <section>
        <p>
          Keyboards, mice, headsets, webcams, and — above all — monitors are where a
          lot of everyday tickets live. Most “it’s not working” peripheral problems
          come down to the right cable in the right port, the correct input source,
          or a driver. Knowing the connectors and the two or three usual causes
          makes these fast wins.
        </p>
      </section>

      <section>
        <h2>Connecting peripherals</h2>
        <ul>
          <li><strong>USB:</strong> the universal connector. Know <strong>USB-A</strong> (the classic rectangle) and <strong>USB-C</strong> (small, reversible), and that versions differ in speed. Most keyboards, mice, and headsets are plug-and-play.</li>
          <li><strong>Bluetooth:</strong> wireless pairing for mice, keyboards, and headsets — check it’s powered, in pairing mode, charged, and actually paired to the right device.</li>
          <li><strong>Thunderbolt / USB-C:</strong> carries data, video, and power over one cable; the backbone of modern docks.</li>
          <li><strong>Docking stations:</strong> one connection expands a laptop into monitors, wired network, and peripherals — and are a common single point of failure for “everything stopped working.”</li>
        </ul>
      </section>

      <section>
        <h2>Display connectors</h2>
        <p>
          Monitors are the peripheral you’ll troubleshoot most. Recognise the
          connectors:
        </p>
        <ul>
          <li><strong>HDMI:</strong> the most common; carries video and audio.</li>
          <li><strong>DisplayPort:</strong> common on business PCs; high resolutions and refresh rates.</li>
          <li><strong>USB-C / Thunderbolt:</strong> video over the same port used for data and charging.</li>
          <li><strong>VGA and DVI:</strong> older, still seen on legacy monitors and projectors; VGA is analog and video-only.</li>
        </ul>
      </section>

      <section>
        <h2>The usual display problems</h2>
        <ul>
          <li><strong>“No signal”:</strong> the monitor is on the wrong <strong>input source</strong>, or a cable is loose or faulty. Check the source button and reseat/swap the cable first.</li>
          <li><strong>External monitor not detected:</strong> use Detect (Windows+P to switch modes), confirm the dock/cable, and check for a display driver update.</li>
          <li><strong>Wrong resolution or blurry:</strong> set the display to its native resolution; scaling settings can also make text tiny or huge.</li>
          <li><strong>Duplicate vs extend:</strong> Windows+P toggles whether a second monitor mirrors or extends the desktop — a frequent “my second screen is wrong” fix.</li>
        </ul>
        <p>
          The same first checks apply to webcams and headsets: correct device
          selected in the app’s settings, plugged into a working port, and not
          claimed by another program.
        </p>
      </section>

      <section>
        <h2>Your approach</h2>
        <p>
          Start physical and simple: right cable, firmly seated, correct input
          source, correct device selected. Then Detect displays and check the
          driver. Most peripheral tickets never need to go deeper than that — and
          swapping in a known-good cable or port is one of the fastest tests you
          have.
        </p>
      </section>
    </>
  );
}
