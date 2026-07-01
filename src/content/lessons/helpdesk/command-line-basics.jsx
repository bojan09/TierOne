import React from 'react';

export default function CommandLineBasics() {
  return (
    <>
      <section>
        <p>
          The graphical interface is friendly, but the command line is fast, precise,
          and shows you details the GUI hides. You don’t need to be a scripter — a
          handful of commands will let you diagnose connectivity, check what’s
          running, and gather facts for a ticket in seconds. It’s one of the clearest
          signs of a technician who knows their way around.
        </p>
      </section>

      <section>
        <h2>The three you’ll meet</h2>
        <ul>
          <li><strong>Command Prompt (cmd):</strong> the classic Windows shell — simple and everywhere.</li>
          <li><strong>PowerShell:</strong> Windows’ modern shell; far more powerful, works with objects, and is the tool of choice for anything beyond the basics.</li>
          <li><strong>Terminal (bash / zsh):</strong> the Linux and macOS shell — the same idea with different command names.</li>
        </ul>
        <p>
          Many commands need administrator rights: open the shell “as administrator”
          for an <strong>elevated</strong> prompt — and be deliberate, because those
          commands can change the system.
        </p>
      </section>

      <section>
        <h2>Getting around</h2>
        <ul>
          <li><strong>See where you are:</strong> <code>cd</code> with no argument (Windows) or <code>pwd</code> (Linux/mac).</li>
          <li><strong>List files:</strong> <code>dir</code> (Windows) or <code>ls</code> (Linux/mac).</li>
          <li><strong>Change directory:</strong> <code>cd foldername</code>, and <code>cd ..</code> to go up.</li>
        </ul>
      </section>

      <section>
        <h2>The support commands worth memorising</h2>
        <p>
          These answer the questions you ask most often:
        </p>
        <ul>
          <li><strong><code>ipconfig /all</code></strong> (Windows) or <strong><code>ip addr</code></strong> (Linux): the machine’s IP, gateway, DNS, and MAC — your first look at any connectivity issue.</li>
          <li><strong><code>ping</code></strong>: is a host reachable? Ping the gateway, then a public IP, then a name to walk the connectivity ladder.</li>
          <li><strong><code>nslookup</code></strong>: does a name resolve? If IPs work but names don’t, this confirms DNS.</li>
          <li><strong><code>tracert</code></strong> (Windows) / <strong><code>traceroute</code></strong>: where along the path do packets stop?</li>
          <li><strong><code>tasklist</code></strong> (Windows) / <strong><code>ps</code></strong> (Linux): what’s running — useful for a runaway process.</li>
          <li><strong><code>sfc /scannow</code></strong>: checks and repairs Windows system files.</li>
        </ul>
      </section>

      <section>
        <h2>Turning output into a good ticket</h2>
        <p>
          The command line isn’t just for fixing — it’s for <em>evidence</em>. Copy
          the relevant output (an IP configuration, a failed ping) straight into the
          ticket so the next person sees exactly what you saw. Precise facts beat
          “the internet was broken” every time. Start with these few commands, use
          them on real tickets, and they’ll quickly become second nature.
        </p>
      </section>
    </>
  );
}
