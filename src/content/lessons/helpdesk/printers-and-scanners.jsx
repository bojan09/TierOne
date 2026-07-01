import React from 'react';

export default function PrintersAndScanners() {
  return (
    <>
      <section>
        <p>
          Printers generate more tickets per device than almost anything else on a
          network. The good news: the failures are predictable, and a calm,
          ordered check of the queue, the connection, and the hardware resolves most
          of them. Knowing how printing actually works turns “it won’t print” from a
          mystery into a checklist.
        </p>
      </section>

      <section>
        <h2>Printer types</h2>
        <ul>
          <li><strong>Laser:</strong> uses toner and a heated fuser; fast, sharp text, common in offices. “Faded” or “smeared” output points at toner or the fuser.</li>
          <li><strong>Inkjet:</strong> sprays liquid ink; great for colour/photos, prone to clogged heads and dried cartridges.</li>
          <li><strong>Thermal:</strong> uses heat on special paper; common for receipts and shipping labels.</li>
          <li><strong>Multifunction (MFP):</strong> print, scan, copy, and fax in one device — the typical office unit.</li>
        </ul>
      </section>

      <section>
        <h2>How a print job reaches the printer</h2>
        <p>
          When a user prints, the job is formatted by the <strong>driver</strong>,
          queued by the <strong>print spooler</strong> service, and sent to the
          printer over its connection:
        </p>
        <ul>
          <li><strong>USB:</strong> directly attached to one PC.</li>
          <li><strong>Network (IP):</strong> the printer has its own address; many users print to it, often via a shared <strong>print server</strong>.</li>
          <li><strong>Wi-Fi:</strong> common for small offices and home setups.</li>
        </ul>
        <p>
          If any link in that chain stalls — a stuck spooler, an “offline” status, a
          lost network path — nothing comes out even though everything looks fine.
        </p>
      </section>

      <section>
        <h2>The common failures — and the order to check</h2>
        <ul>
          <li><strong>Jobs stuck in the queue:</strong> open the queue, clear stuck jobs, and restart the Print Spooler service if needed.</li>
          <li><strong>Printer shows “offline” or paused:</strong> set it back online; confirm it’s powered and on the network.</li>
          <li><strong>Paper jam / out of paper / low toner or ink:</strong> the physical basics — check them early.</li>
          <li><strong>Wrong or corrupt driver:</strong> reinstall or update the correct driver; a mismatched driver produces garbage or nothing.</li>
          <li><strong>Print quality:</strong> streaks and faded areas usually mean toner/ink or a cleaning cycle is due.</li>
          <li><strong>Wrong printer selected:</strong> surprisingly common — confirm the default and where the job was sent.</li>
        </ul>
      </section>

      <section>
        <h2>Scanning</h2>
        <p>
          Most office scanning is on an MFP, using a <strong>flatbed</strong> for
          single pages or an <strong>automatic document feeder (ADF)</strong> for
          stacks. Typical destinations are scan-to-email or scan-to-folder; when
          those fail, the cause is usually a mail/network setting or permissions on
          the destination folder, not the scanner itself.
        </p>
      </section>

      <section>
        <h2>Your approach</h2>
        <p>
          Work the chain in order: the queue and spooler, then online/connection
          status, then the driver, then the physical consumables. Confirm a test
          print, and — because the same jams and stuck queues recur — show the user
          how to clear them next time. It turns a repeat ticket into a one-time fix.
        </p>
      </section>
    </>
  );
}
