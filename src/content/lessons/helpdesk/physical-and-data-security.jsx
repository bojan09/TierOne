import React from 'react';

export default function PhysicalAndDataSecurity() {
  return (
    <>
      <section>
        <p>
          Not every threat arrives over the network. A laptop left unlocked in a
          café, a spreadsheet of customer data emailed in the clear, or a lost phone
          full of company mail can all cause a breach without a single line of
          malicious code. Physical and data security are where good habits — the
          ones you model and reinforce every day — do most of the work.
        </p>
      </section>

      <section>
        <h2>Physical security on the front line</h2>
        <p>
          The goal is simple: keep unauthorised people away from devices and
          screens. The controls are mostly behavioural.
        </p>
        <ul>
          <li><strong>Lock the screen every time you step away.</strong> Windows+L or Control-Command-Q — muscle memory you should teach every user.</li>
          <li><strong>Badge access and tailgating:</strong> secure areas use badge or PIN entry; following someone through a door (tailgating) defeats it. It’s okay to challenge or report unfamiliar people.</li>
          <li><strong>Clean desk:</strong> no passwords on sticky notes, no sensitive documents left out, no unattended unlocked machines.</li>
          <li><strong>Cable locks and privacy filters</strong> protect laptops in open spaces and stop shoulder surfing.</li>
          <li><strong>Lost or stolen device:</strong> report it <em>immediately</em> so it can be remotely locked or wiped and credentials rotated. Speed limits the damage.</li>
        </ul>
      </section>

      <section>
        <h2>Protecting data itself</h2>
        <p>
          If a device is lost, encryption is what keeps the data on it safe.
          Understanding the basics lets you answer real questions and follow policy.
        </p>
        <ul>
          <li><strong>Encryption at rest:</strong> full-disk encryption — BitLocker on Windows, FileVault on macOS — makes a stolen drive unreadable without the key.</li>
          <li><strong>Encryption in transit:</strong> HTTPS and VPNs protect data moving across networks so it can’t be read if intercepted.</li>
          <li><strong>Data classification:</strong> organisations label data (public, internal, confidential, restricted) so people know how to handle it. Personally identifiable information (PII) and financial or health data get the strictest handling.</li>
          <li><strong>Least privilege on shares:</strong> people should only access the files their role requires — a recurring theme in access-request tickets.</li>
        </ul>
      </section>

      <section>
        <h2>Removable media and everyday risks</h2>
        <p>
          A found USB drive is a classic attack vector — plugging it in can auto-run
          malware. Many organisations disable USB storage or apply
          <strong> data loss prevention (DLP)</strong> tools that block sensitive
          data from leaving via email, upload, or removable media. When users ask to
          copy data to a personal drive or send it to a personal account, that’s a
          policy question, not a quick favour.
        </p>
      </section>

      <section>
        <h2>Backups belong to security too</h2>
        <p>
          The most reliable defence against ransomware and hardware failure is a
          tested backup. The <strong>3-2-1 rule</strong> — three copies, on two
          types of media, with one kept offsite — means a single disaster never
          takes everything. A backup that has never been restored isn’t a backup
          yet, so restores get tested.
        </p>
      </section>

      <section>
        <h2>What this means for you</h2>
        <p>
          Lock screens, handle data according to its classification, never email
          sensitive information unencrypted, treat lost devices as urgent, and turn
          “can you just send me that file” requests into a check against policy.
          Small, consistent habits prevent the incidents that make headlines.
        </p>
      </section>
    </>
  );
}
