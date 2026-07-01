import React from 'react';

export default function BackupAndRecovery() {
  return (
    <>
      <section>
        <p>
          Data is the one thing a business truly can’t replace. Hardware can be
          swapped and software reinstalled, but a lost file or a ransomware-encrypted
          drive is gone unless there’s a backup. A big part of protecting users is
          making sure their important data lives somewhere it’s actually being backed
          up — and knowing how to get it back.
        </p>
      </section>

      <section>
        <h2>Why backups exist</h2>
        <p>
          Three everyday threats make backups essential: <strong>hardware failure</strong>
          (drives die without warning), <strong>human error</strong> (deleted or
          overwritten files), and <strong>ransomware</strong> (data held hostage). A
          good backup answers all three.
        </p>
      </section>

      <section>
        <h2>Backup types</h2>
        <ul>
          <li><strong>Full:</strong> a complete copy of everything. Simplest to restore, but largest and slowest.</li>
          <li><strong>Incremental:</strong> only what changed since the last backup of any kind. Small and fast to run, but a restore needs the last full plus every increment since.</li>
          <li><strong>Differential:</strong> everything changed since the last <em>full</em> backup. Larger than incremental, but a restore needs only the full plus the latest differential.</li>
        </ul>
        <p>
          The trade-off is always backup speed/size versus restore simplicity —
          worth understanding when a user asks why a restore is taking so long.
        </p>
      </section>

      <section>
        <h2>The 3-2-1 rule</h2>
        <p>
          The gold standard: keep <strong>3</strong> copies of your data, on
          <strong> 2</strong> different types of media, with <strong>1</strong> copy
          offsite. That way no single event — a dead disk, a stolen laptop, a flooded
          office, or ransomware — takes everything at once.
        </p>
      </section>

      <section>
        <h2>How backups usually work today</h2>
        <ul>
          <li><strong>Cloud sync (OneDrive/known-folder move):</strong> in Microsoft 365, the Desktop, Documents, and Pictures folders are redirected to OneDrive, so a user’s files are copied to the cloud automatically — often the single most important protection you can confirm is on.</li>
          <li><strong>File History (Windows) / Time Machine (macOS):</strong> keep versioned local backups to an external or network drive.</li>
          <li><strong>Server/enterprise backup:</strong> centralised, scheduled backups of shared data, handled by higher tiers.</li>
        </ul>
      </section>

      <section>
        <h2>Restoring — and testing</h2>
        <p>
          Versioning lets you recover an earlier copy of a file after a bad edit, and
          cloud/recycle-bin retention often recovers recent deletions. The golden
          rule: <strong>a backup that has never been restored isn’t proven</strong>,
          so restores get tested. For Tier-1, the highest-value habit is simple —
          make sure important files sit in a backed-up location (like OneDrive), not
          only on the local desktop, before disaster makes it matter.
        </p>
      </section>
    </>
  );
}
