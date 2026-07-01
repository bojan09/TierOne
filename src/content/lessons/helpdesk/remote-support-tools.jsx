import React from 'react';

export default function RemoteSupportTools() {
  return (
    <>
      <section>
        <p>
          Much of modern support happens without ever being in the same room as the
          user. Remote tools let you see the screen, take control, and fix the
          problem directly — which is faster for everyone, but only when done with
          consent, care, and good security habits. This is a skill and a
          responsibility.
        </p>
      </section>

      <section>
        <h2>The common tools and methods</h2>
        <ul>
          <li><strong>Remote Desktop (RDP):</strong> connect to and control a Windows machine as if sitting at it — often used for servers and remote workstations.</li>
          <li><strong>Remote assistance / screen sharing:</strong> tools like Quick Assist or third-party apps let you view or control a user’s live session while they watch.</li>
          <li><strong>Unattended agents:</strong> management tools that let support connect to a device without someone present — used for maintenance and after-hours work.</li>
          <li><strong>MDM push:</strong> for phones and tablets, config, apps, and wipes are pushed centrally rather than by taking control of the screen.</li>
        </ul>
        <p>
          A useful distinction: <strong>attended</strong> support (the user is there,
          approving and watching) versus <strong>unattended</strong> (no one at the
          device). Attended is the norm for helping a person with a live problem.
        </p>
      </section>

      <section>
        <h2>Consent and trust</h2>
        <p>
          You’re about to see everything on someone’s screen, so trust is
          everything.
        </p>
        <ul>
          <li><strong>Get explicit consent</strong> before connecting, and let the user know when you’re taking control.</li>
          <li><strong>Say what you’re doing</strong> as you do it — narrate the steps so it never feels like snooping.</li>
          <li><strong>Respect privacy:</strong> ask the user to close personal or sensitive material first; don’t open things unrelated to the issue.</li>
          <li><strong>Verify identity</strong> both ways — the user should know they’re talking to real IT, which is exactly the trust attackers try to exploit with fake “support” calls.</li>
        </ul>
      </section>

      <section>
        <h2>Security hygiene</h2>
        <ul>
          <li><strong>Use only approved tools</strong> — unsanctioned remote software is a real risk and a favourite of scammers.</li>
          <li><strong>End sessions cleanly;</strong> never leave a remote connection or an elevated prompt open and unattended.</li>
          <li><strong>Handle elevation carefully:</strong> admin (UAC) prompts during a session mean you’re making privileged changes — be deliberate.</li>
          <li><strong>Document what you did,</strong> so the ticket reflects the actual changes made on the user’s machine.</li>
        </ul>
      </section>

      <section>
        <h2>Making remote sessions smooth</h2>
        <p>
          Confirm the user can reconnect if the link drops (especially when you
          restart something), keep them informed during quiet stretches, and hand
          control back clearly at the end. Done well, remote support feels to the
          user like you were right there — helpful, transparent, and safe.
        </p>
      </section>
    </>
  );
}
