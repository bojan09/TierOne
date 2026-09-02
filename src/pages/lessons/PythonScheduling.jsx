import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_PYTHONSCHEDULING_1 = `# Edit with: crontab -e
# View with: crontab -l

# Disable email output (use log files instead)
MAILTO=''
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Daily disk health check at 06:00 — log output, capture errors
0 6 * * * /opt/scripts/disk-monitor.py >> /var/log/disk-monitor.log 2>&1

# Hourly server health snapshot
0 * * * * /opt/scripts/health-snapshot.py >> /var/log/health.log 2>&1

# Weekly log cleanup (Sundays at 02:00)
0 2 * * 0 /opt/scripts/log-cleanup.py >> /var/log/cleanup.log 2>&1

# Run as a specific user with sudo:
# Add to /etc/cron.d/myjob:
# 0 6 * * * sysadmin /opt/scripts/job.py >> /var/log/job.log 2>&1`
const CODE_PYTHONSCHEDULING_2 = `#!/usr/bin/env python3
"""scheduled-task.py — Template for cron-deployed Python scripts."""
import sys, logging, fcntl, time
from pathlib import Path
from datetime import datetime

# ── Configuration ────────────────────────────────────────────
SCRIPT_NAME = Path(__file__).stem
LOG_FILE    = Path(f'/var/log/{SCRIPT_NAME}.log')
LOCK_FILE   = Path(f'/tmp/{SCRIPT_NAME}.lock')

# ── Logging setup ─────────────────────────────────────────────
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
log = logging.getLogger(SCRIPT_NAME)

# ── Lock file — prevent concurrent runs ───────────────────────
class SingleInstance:
    def __enter__(self):
        self._fp = open(LOCK_FILE, 'w')
        try:
            fcntl.flock(self._fp, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError:
            log.warning('Another instance is running — exiting')
            sys.exit(0)
        return self

    def __exit__(self, *args):
        fcntl.flock(self._fp, fcntl.LOCK_UN)
        self._fp.close()
        LOCK_FILE.unlink(missing_ok=True)

# ── Main logic ────────────────────────────────────────────────
def main():
    log.info('Starting run')
    start = time.time()

    try:
        # --- Your work goes here ---
        import psutil
        disk_pct = psutil.disk_usage('/').percent
        log.info(f'Disk usage: {disk_pct}%')

        if disk_pct > 85:
            log.warning(f'HIGH DISK: {disk_pct}% — alerting')
            # send_alert(f'Disk at {disk_pct}%')
        # ---------------------------

    except Exception as e:
        log.error(f'Unhandled error: {e}', exc_info=True)
        sys.exit(1)
    finally:
        elapsed = round(time.time() - start, 2)
        log.info(f'Run complete in {elapsed}s')

if __name__ == '__main__':
    with SingleInstance():
        main()`
const CODE_PYTHONSCHEDULING_3 = `# Create the script
sudo mkdir -p /opt/scripts
cat > /opt/scripts/health-check.py << 'EOF'
#!/usr/bin/env python3
import logging, psutil
from pathlib import Path
from datetime import datetime

logging.basicConfig(
    filename='/var/log/health-check.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)
log = logging.getLogger('health')

cpu = psutil.cpu_percent(interval=1)
mem = psutil.virtual_memory().percent
disk = psutil.disk_usage('/').percent

log.info(f'cpu={cpu}% mem={mem}% disk={disk}%')
if any([cpu > 90, mem > 90, disk > 85]):
    log.warning(f'THRESHOLD EXCEEDED: cpu={cpu} mem={mem} disk={disk}')
EOF
chmod +x /opt/scripts/health-check.py

# Test it
python3 /opt/scripts/health-check.py
cat /var/log/health-check.log`
const CODE_PYTHONSCHEDULING_4 = `# Add to crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * python3 /opt/scripts/health-check.py >> /var/log/health-check.log 2>&1") | crontab -

# Verify it was added
crontab -l

# Check cron is running
sudo systemctl status cron`
const CODE_PYTHONSCHEDULING_5 = `*/5 * * * * python3 /opt/scripts/health-check.py >> /var/log/health-check.log 2>&1

cron.service - Regular background program processing daemon
   Active: active (running)`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info: 'callout-info', warning: 'callout-warning', success: 'callout-success' }
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

export default function PythonScheduling() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Scheduled automation is the backbone of operational work — backups, health
          checks, log rotation, report generation, and cleanup all run on schedules.
          Python scripts deployed as cron jobs or systemd timers handle these tasks
          reliably when written correctly.
        </p>
        <Callout type="info" icon="💡" title="The production checklist for scheduled scripts">
          Every scheduled script needs: (1) proper output logging to a file, (2) error
          handling that notifies on failure, (3) a lock file if runtime can exceed interval,
          (4) idempotency — safe to run multiple times, and (5) a startup check that
          prerequisites are available.
        </Callout>
      </section>

      <section>
        <h2>Cron Reference</h2>
        <div className="info-card mt-4 overflow-hidden">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-4 pt-4">
            Cron expression format
          </p>
          <div className="font-mono text-sm px-4 pb-4">
            <div className="flex gap-2 mb-3 flex-wrap">
              {['minute', 'hour', 'day-of-month', 'month', 'day-of-week'].map((f, i) => (
                <div key={f} className="text-center">
                  <div className={`px-3 py-1.5 rounded-lg font-bold text-base ${['text-brand-300 bg-brand-500/20','text-accent-cyan bg-accent-cyan/15','text-accent-green bg-accent-green/15','text-accent-amber bg-accent-amber/15','text-accent-purple bg-accent-purple/15'][i]}`}>*</div>
                  <div className="text-[10px] text-slate-500 mt-1">{f}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              {[
                ['* * * * *',      'Every minute'],
                ['0 * * * *',      'Every hour (at :00)'],
                ['30 2 * * *',     'Daily at 02:30'],
                ['30 2 * * 1-5',   'Weekdays at 02:30'],
                ['0 0 * * 0',      'Weekly, Sunday midnight'],
                ['0 0 1 * *',      'Monthly, 1st at midnight'],
                ['*/15 * * * *',   'Every 15 minutes'],
                ['0 9,17 * * 1-5', 'Weekdays at 09:00 and 17:00'],
              ].map(([expr, desc]) => (
                <div key={expr} className="flex gap-4">
                  <code className="text-accent-green font-mono w-32 flex-shrink-0">{expr}</code>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <CodeBlock className="mt-4" title="Production crontab setup" language="bash"
          code={CODE_PYTHONSCHEDULING_1} />
      </section>

      <section>
        <h2>Production Script Template</h2>
        <CodeBlock title="scheduled-task.py — production-ready template" language="bash"
          code={CODE_PYTHONSCHEDULING_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PY-6</span>
            <span className="text-sm font-semibold text-white">Deploy a Cron-Scheduled Health Check</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Create and deploy a production-style scheduled health check."
              command={CODE_PYTHONSCHEDULING_3}
              output="2025-01-15 11:00:00 INFO cpu=8.5% mem=47.2% disk=15.3%"
            />
            <LabStep number={2}
              description="Schedule it with cron — run every 5 minutes."
              command={CODE_PYTHONSCHEDULING_4}
              output={CODE_PYTHONSCHEDULING_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
