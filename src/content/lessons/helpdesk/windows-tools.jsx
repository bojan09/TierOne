import React from 'react';

export default function WindowsToolsAndControlPanel() {
  return (
    <>
      <section>
        <p>
          Windows hides a powerful set of built-in tools behind a few menus, and
          knowing which one answers which question is what makes troubleshooting
          quick. You don’t need third-party software for most Tier-1 work — you need
          to know where Windows already keeps the answers.
        </p>
      </section>

      <section>
        <h2>Settings vs Control Panel</h2>
        <p>
          Windows has two overlapping places for configuration. <strong>Settings</strong>
          is the modern app for most day-to-day options (network, display, accounts,
          updates). The older <strong>Control Panel</strong> still holds some
          advanced items. Microsoft is gradually merging the two, so it’s normal to
          bounce between them — knowing both saves time.
        </p>
      </section>

      <section>
        <h2>The tools that solve most tickets</h2>
        <ul>
          <li><strong>Task Manager:</strong> what’s running, what’s using CPU/memory/disk, and which apps launch at startup. The go-to for “my PC is slow” or a frozen app (End Task).</li>
          <li><strong>Device Manager:</strong> every piece of hardware and its driver. A yellow warning icon flags a driver or device problem.</li>
          <li><strong>Disk Management:</strong> drives, partitions, and drive letters — useful when a disk “disappears” or a new drive needs formatting.</li>
          <li><strong>Event Viewer:</strong> the system’s logs. When something crashes intermittently, the Application and System logs often hold the clue.</li>
          <li><strong>Services:</strong> background processes like the Print Spooler — start, stop, or restart them here.</li>
          <li><strong>Programs &amp; Features:</strong> uninstall or repair installed software.</li>
          <li><strong>System Information / About:</strong> the machine’s specs, Windows edition, and version — handy for tickets and compatibility checks.</li>
        </ul>
      </section>

      <section>
        <h2>Opening them fast</h2>
        <p>
          The quickest route is usually the Start menu search — type “Device
          Manager,” “Disk Management,” or “Event Viewer.” Power users use the
          <strong> Run</strong> dialog (Windows+R) with short commands:
        </p>
        <ul>
          <li><code>devmgmt.msc</code> — Device Manager</li>
          <li><code>diskmgmt.msc</code> — Disk Management</li>
          <li><code>services.msc</code> — Services</li>
          <li><code>eventvwr</code> — Event Viewer</li>
          <li><code>control</code> — Control Panel</li>
        </ul>
      </section>

      <section>
        <h2>Matching the tool to the problem</h2>
        <p>
          Slow or frozen? Task Manager. Hardware or driver acting up? Device Manager.
          Drive missing or unformatted? Disk Management. Intermittent crash? Event
          Viewer. A service like printing stalled? Services. Building this mental map
          — symptom to tool — is what lets you move straight to the answer instead of
          clicking around.
        </p>
      </section>
    </>
  );
}
