import React from 'react';

export default function OperatingSystemsOverview() {
  return (
    <>
      <section>
        <p>The operating system is the layer between the person and the hardware. You'll mostly support Windows, but macOS and Linux show up too — and the concepts transfer.</p>
      </section>
      <section>
        <h2>What an OS does for you</h2>
        <ul>
          <li><strong>Manages resources</strong> — CPU, memory, disk, devices. Task Manager (Windows) / Activity Monitor (mac) show what's consuming them.</li>
          <li><strong>Runs processes</strong> — apps are processes; a hung app is a process to end and relaunch.</li>
          <li><strong>Handles users & permissions</strong> — who can do what, covered in the next lesson.</li>
          <li><strong>Provides services</strong> — background components (printing, networking, updates) that can be stopped/started.</li>
        </ul>
      </section>
      <section>
        <h2>The three you'll meet</h2>
        <ul>
          <li><strong>Windows</strong> — the enterprise default; most tickets. Know Settings, Control Panel, Task Manager, Event Viewer.</li>
          <li><strong>macOS</strong> — common with designers/execs; Unix underneath, System Settings for config.</li>
          <li><strong>Linux</strong> — servers and developers; the terminal is the tool. You'll meet it on the SysAdmin track.</li>
        </ul>
        <div className="callout callout-success">
          <span className="callout-icon">🧩</span>
          <p className="callout-body"><strong>Transferable thinking:</strong> every OS has the same building blocks — processes, services, users, logs. Learn the concept once and you can navigate any of them.</p>
        </div>
      </section>
    </>
  );
}
