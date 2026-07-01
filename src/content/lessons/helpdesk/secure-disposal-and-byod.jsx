import React from 'react';

export default function SecureDisposalAndByod() {
  return (
    <>
      <section>
        <p>
          Devices reach the end of their life, and people bring their own phones and
          laptops into work. Both create security gaps that Tier-1 helps close —
          making sure retired equipment doesn’t leak old data, and that personal
          devices touching company resources are safe to do so.
        </p>
      </section>

      <section>
        <h2>Why “delete” isn’t enough</h2>
        <p>
          Dragging files to the trash or even formatting a drive usually leaves the
          data recoverable — the space is just marked reusable. Proper
          <strong> data sanitisation</strong> is required before a device leaves the
          organisation.
        </p>
        <ul>
          <li><strong>Overwriting / wiping:</strong> software writes over the data (one or more passes) so it can’t be recovered. Good for reusing or reselling a drive.</li>
          <li><strong>Cryptographic erase:</strong> on an encrypted drive, destroying the key instantly makes all data unreadable.</li>
          <li><strong>Degaussing:</strong> a strong magnetic field wipes magnetic (spinning) drives — but not SSDs.</li>
          <li><strong>Physical destruction:</strong> shredding, drilling, or crushing the drive when data is highly sensitive or the drive is dead.</li>
        </ul>
        <p>
          For regulated data, organisations keep a <strong>certificate of
          destruction</strong> as proof. If a drive is being repurposed internally
          rather than destroyed, it still gets wiped first.
        </p>
      </section>

      <section>
        <h2>Mobile device security</h2>
        <p>
          Phones and tablets hold email, documents, and saved logins, so they need
          the same seriousness as laptops.
        </p>
        <ul>
          <li><strong>Screen lock and encryption:</strong> a PIN, biometric, or password plus device encryption is the baseline.</li>
          <li><strong>Keep the OS and apps updated;</strong> install apps only from official stores.</li>
          <li><strong>Avoid jailbreaking / rooting,</strong> which removes built-in security protections.</li>
          <li><strong>Remote lock and wipe:</strong> the ability to erase a lost device from afar is why lost phones must be reported immediately.</li>
        </ul>
      </section>

      <section>
        <h2>MDM and BYOD</h2>
        <p>
          <strong>Mobile Device Management (MDM)</strong> lets the organisation
          enforce policy on devices — require a passcode and encryption, push apps
          and updates, and remotely wipe if needed. When employees use their own
          devices for work — <strong>Bring Your Own Device (BYOD)</strong> — MDM
          usually applies to a managed, containerised work profile so company data
          stays separated from personal photos and apps.
        </p>
        <p>
          BYOD trades convenience for complexity: clear policy defines what’s
          allowed, and a remote wipe should be able to remove <em>company</em> data
          without touching the user’s personal content.
        </p>
      </section>

      <section>
        <h2>Onboarding and offboarding</h2>
        <p>
          Access should track employment. When someone joins, they’re enrolled and
          granted least-privilege access. When someone leaves — an
          <strong> offboarding</strong> ticket you’ll often handle — accounts are
          disabled promptly, company data is wiped from any personal devices, and
          equipment is collected and sanitised. Prompt offboarding closes one of the
          most common real-world security gaps.
        </p>
      </section>

      <section>
        <h2>Your part</h2>
        <p>
          Follow the disposal policy rather than improvising, enrol devices in MDM,
          treat lost devices as urgent remote-wipe cases, and work offboarding
          tickets promptly and completely. Retired and personal devices are easy to
          overlook — which is exactly why attackers look there.
        </p>
      </section>
    </>
  );
}
