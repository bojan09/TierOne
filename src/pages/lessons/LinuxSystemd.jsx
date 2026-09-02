import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_LINUXSYSTEMD_1 = `# ── Service lifecycle ────────────────────────────────────────
sudo systemctl start nginx       # Start now
sudo systemctl stop nginx        # Stop now
sudo systemctl restart nginx     # Stop then start
sudo systemctl reload nginx      # Reload config (no downtime)
sudo systemctl status nginx      # Show status, recent logs

# ── Boot persistence ─────────────────────────────────────────
sudo systemctl enable nginx      # Start at boot
sudo systemctl disable nginx     # Don't start at boot
sudo systemctl enable --now nginx  # Enable AND start immediately
sudo systemctl disable --now nginx # Disable AND stop immediately

# ── Inspect ──────────────────────────────────────────────────
systemctl is-active nginx        # Returns 'active' or 'inactive'
systemctl is-enabled nginx       # Returns 'enabled' or 'disabled'
systemctl is-failed nginx        # Returns 'failed' or 'active'
systemctl list-units --type=service --state=running
systemctl list-units --type=service --state=failed
systemctl list-unit-files --type=service | grep enabled

# ── System-wide ──────────────────────────────────────────────
sudo systemctl daemon-reload     # Re-read unit files after changes
sudo systemctl reset-failed      # Clear 'failed' state on all units
sudo systemctl reset-failed nginx  # Clear failed state for nginx

# ── Power management ─────────────────────────────────────────
sudo systemctl reboot
sudo systemctl poweroff
sudo systemctl halt`
const CODE_LINUXSYSTEMD_2 = `[Unit]
Description=My Application Server
Documentation=https://docs.myapp.com
After=network.target postgresql.service   # Start AFTER these
Requires=postgresql.service               # FAIL if postgres not running
Wants=redis.service                       # Start redis if possible, but don't fail

[Service]
Type=simple                   # simple|forking|oneshot|notify|idle
User=appuser                  # Run as this user (NOT root)
Group=appuser
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp/env  # Load env vars from file
ExecStart=/opt/myapp/bin/server --port 8080
ExecReload=/bin/kill -HUP $MAINPID  # Signal for config reload
ExecStop=/bin/kill -TERM $MAINPID

# Restart policy
Restart=on-failure            # Restart if process exits non-zero
RestartSec=5                  # Wait 5s before restarting
StartLimitIntervalSec=60      # Reset restart counter every 60s
StartLimitBurst=3             # Max 3 restarts in the interval

# Security hardening
NoNewPrivileges=yes           # Prevent privilege escalation
ProtectSystem=strict          # Mount /usr, /boot read-only
PrivateTmp=yes                # Isolated /tmp directory

[Install]
WantedBy=multi-user.target    # Enable for normal multi-user boot`
const CODE_LINUXSYSTEMD_3 = `# ── Basic queries ────────────────────────────────────────────
journalctl -u nginx                # All logs for nginx
journalctl -u nginx -f             # Follow in real time
journalctl -u nginx -n 50          # Last 50 lines
journalctl -u nginx --since '1 hour ago'
journalctl -u nginx --since '2025-01-15 09:00' --until '2025-01-15 10:00'

# ── Filter by priority ───────────────────────────────────────
journalctl -p err                  # Errors and above
journalctl -p warning -u nginx     # Warnings for nginx
# Priorities: emerg alert crit err warning notice info debug

# ── Boot logs ────────────────────────────────────────────────
journalctl -b                      # Current boot
journalctl -b -1                   # Previous boot
journalctl --list-boots            # List all boots

# ── System-wide ──────────────────────────────────────────────
journalctl --disk-usage            # How much disk logs use
sudo journalctl --vacuum-size=500M # Keep only last 500MB
sudo journalctl --vacuum-time=30d  # Keep only last 30 days`
const CODE_LINUXSYSTEMD_4 = `# Two files needed: a .service and a .timer

# 1. Create the service unit (what to run)
sudo tee /etc/systemd/system/disk-check.service << 'EOF'
[Unit]
Description=Disk Space Check

[Service]
Type=oneshot
User=root
ExecStart=/opt/scripts/disk-monitor.py
StandardOutput=journal
EOF

# 2. Create the timer unit (when to run)
sudo tee /etc/systemd/system/disk-check.timer << 'EOF'
[Unit]
Description=Run disk check every 15 minutes

[Timer]
OnCalendar=*:0/15        # Every 15 minutes (cron: */15 * * * *)
# OnBootSec=5min         # 5 minutes after boot
# OnUnitActiveSec=1h     # Every hour after last run
Persistent=true          # Run missed jobs after downtime

[Install]
WantedBy=timers.target
EOF

# 3. Enable and start the timer
sudo systemctl daemon-reload
sudo systemctl enable --now disk-check.timer

# 4. Verify
systemctl list-timers disk-check.timer`
const CODE_LINUXSYSTEMD_5 = `# How long has the system been running?
systemctl status --no-pager | head -5

# Which services are failed?
systemctl list-units --state=failed

# Check nginx is running
systemctl is-active nginx && echo 'nginx: OK' || echo 'nginx: not running'`
const CODE_LINUXSYSTEMD_6 = `State: running
Jobs: 0 queued
Failed: 0 units

nginx: OK`
const CODE_LINUXSYSTEMD_7 = `# Create the script
sudo mkdir -p /opt/healthcheck
sudo tee /opt/healthcheck/run.sh << 'SCRIPT'
#!/bin/bash
echo "[$(date)] Disk: $(df -h / | tail -1 | awk '{print $5}') used"
echo "[$(date)] RAM:  $(free -h | grep Mem | awk '{print $3}') used"
SCRIPT
sudo chmod +x /opt/healthcheck/run.sh

# Create the unit file
sudo tee /etc/systemd/system/healthcheck.service << 'EOF'
[Unit]
Description=System Health Check

[Service]
Type=oneshot
ExecStart=/opt/healthcheck/run.sh
StandardOutput=journal
EOF

sudo systemctl daemon-reload
sudo systemctl start healthcheck
journalctl -u healthcheck -n 5 --no-pager`
const CODE_LINUXSYSTEMD_8 = `Jan 15 11:00:00 srv01 run.sh[1234]: [2025-01-15 11:00:00] Disk: 15% used
Jan 15 11:00:00 srv01 run.sh[1234]: [2025-01-15 11:00:00] RAM:  1.2G used`
const CODE_LINUXSYSTEMD_9 = `sudo tee /etc/systemd/system/healthcheck.timer << 'EOF'
[Unit]
Description=Health Check Timer

[Timer]
OnCalendar=*:0/5
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now healthcheck.timer
systemctl list-timers healthcheck.timer`
const CODE_LINUXSYSTEMD_10 = `NEXT                         LEFT     LAST  PASSED  UNIT
Thu 2025-01-15 11:05:00 UTC  4min 59s  n/a    n/a   healthcheck.timer`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info: 'callout-info', warning: 'callout-warning', success: 'callout-success', danger: 'callout-danger' }
  return (
    <div className={`callout ${s[type]}`}>
      <span className="callout-icon">{icon}</span>
      <div className="callout-body">{title && <strong>{title}</strong>}{children}</div>
    </div>
  )
}

function LabStep({ number, description, command, language = 'bash', output }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 rounded-full bg-accent-amber/20 border border-accent-amber/30
                         text-accent-amber text-[11px] font-bold font-mono flex items-center
                         justify-center flex-shrink-0 mt-0.5">{number}</span>
        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
      </div>
      {command && <div className="ml-9"><CodeBlock code={command} language={language} showCopy /></div>}
      {output && (
        <div className="ml-9 rounded-xl bg-surface-950 border border-surface-700 px-4 py-3
                        font-mono text-xs text-accent-green leading-6">
          {output.split('\n').map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}
    </div>
  )
}

export default function LinuxSystemd() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          systemd is the init system used by virtually all modern Linux distributions.
          It is process ID 1 — the first process started by the kernel, which then starts
          everything else. Understanding systemd means understanding how Linux starts,
          how services are managed, and how to debug anything that goes wrong at boot
          or runtime.
        </p>
        <Callout type="info" icon="💡" title="systemd replaced SysVinit">
          The old /etc/init.d/ scripts and service command are deprecated. Everything
          is now managed through systemctl and journalctl. On modern systems, the old
          commands are often wrappers that call systemctl anyway.
        </Callout>
      </section>

      <section>
        <h2>systemctl — Service Control</h2>
        <CodeBlock title="systemctl — complete daily reference" language="bash"
          code={CODE_LINUXSYSTEMD_1} />
      </section>

      <section>
        <h2>Unit File Anatomy</h2>
        <p>Every service is defined by a unit file. Understanding the structure lets you
          create custom services for your own scripts.</p>
        <CodeBlock title="/etc/systemd/system/myapp.service — annotated" language="bash"
          code={CODE_LINUXSYSTEMD_2} />
      </section>

      <section>
        <h2>journalctl — Log Querying</h2>
        <CodeBlock title="journalctl — log query reference" language="bash"
          code={CODE_LINUXSYSTEMD_3} />
      </section>

      <section>
        <h2>systemd Timers — Modern Cron</h2>
        <CodeBlock title="Create a systemd timer for scheduled tasks" language="bash"
          code={CODE_LINUXSYSTEMD_4} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB LINUX-5</span>
            <span className="text-sm font-semibold text-white">Write a Custom Service Unit and Timer</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Explore current service state on the Ubuntu Server VM."
              command={CODE_LINUXSYSTEMD_5}
              output={CODE_LINUXSYSTEMD_6}
            />
            <LabStep number={2}
              description="Create a simple health-check service that runs a Python script."
              command={CODE_LINUXSYSTEMD_7}
              output={CODE_LINUXSYSTEMD_8}
            />
            <LabStep number={3}
              description="Create a timer to run the health check every 5 minutes."
              command={CODE_LINUXSYSTEMD_9}
              output={CODE_LINUXSYSTEMD_10}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
