import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_PYTHONLOGPARSING_1 = `import re
from collections import Counter, defaultdict
from datetime import datetime

# ── nginx access log parser ────────────────────────────────
# Format: 192.168.1.1 - - [15/Jan/2025:10:00:00 +0000] "GET /api HTTP/1.1" 200 1234
NGINX_PATTERN = re.compile(
    r'(?P<ip>\\d+\\.\\d+\\.\\d+\\.\\d+)\\s+'
    r'\\S+\\s+\\S+\\s+'
    r'\\[(?P<timestamp>[^\\]]+)\\]\\s+'
    r'"(?P<method>\\w+)\\s+(?P<path>[^\\s]+)\\s+HTTP/[\\d.]+"\\s+'
    r'(?P<status>\\d{3})\\s+'
    r'(?P<size>\\d+)'
)

def parse_nginx_log(filepath):
    """Generator — yields parsed log entry dicts one at a time."""
    with open(filepath) as f:
        for line_num, line in enumerate(f, 1):
            match = NGINX_PATTERN.search(line)
            if match:
                entry = match.groupdict()
                entry['status'] = int(entry['status'])
                entry['size']   = int(entry['size'])
                entry['line']   = line_num
                yield entry

# ── SSH auth log parser ────────────────────────────────────
SSH_FAILED = re.compile(
    r'Failed (?P<method>\\S+) for (?:invalid user )?(?P<user>\\S+)'
    r' from (?P<ip>[\\d.]+)'
)

SSH_SUCCESS = re.compile(
    r'Accepted (?P<method>\\S+) for (?P<user>\\S+)'
    r' from (?P<ip>[\\d.]+)'
)

# ── syslog parser ──────────────────────────────────────────
SYSLOG_PATTERN = re.compile(
    r'(?P<month>\\w{3})\\s+(?P<day>\\d+)\\s+(?P<time>[\\d:]+)\\s+'
    r'(?P<host>\\S+)\\s+(?P<process>[^:]+):\\s+(?P<message>.+)'
)`
const CODE_PYTHONLOGPARSING_2 = `from collections import Counter
from pathlib import Path

def analyse_nginx(logfile):
    ip_counter     = Counter()
    status_counter = Counter()
    path_counter   = Counter()
    errors_4xx     = []
    errors_5xx     = []
    total_bytes    = 0
    total_lines    = 0

    for entry in parse_nginx_log(logfile):
        total_lines += 1
        total_bytes += entry['size']
        ip_counter[entry['ip']] += 1
        status_counter[entry['status']] += 1
        path_counter[entry['path']] += 1

        if 400 <= entry['status'] < 500:
            errors_4xx.append(entry)
        elif entry['status'] >= 500:
            errors_5xx.append(entry)

    print(f'\\
=== nginx Log Analysis ===')
    print(f'Total requests : {total_lines:,}')
    print(f'Total bytes    : {total_bytes/1_000_000:.1f} MB')
    print(f'5xx errors     : {len(errors_5xx)}')

    print('\\
Top 5 IP addresses:')
    for ip, count in ip_counter.most_common(5):
        print(f'  {ip:20s}  {count:6,} requests')

    print('\\
Status code distribution:')
    for status, count in sorted(status_counter.items()):
        bar = '#' * min(count // 10, 40)
        print(f'  {status}  {count:6,}  {bar}')

    print('\\
Top 5 endpoints:')
    for path, count in path_counter.most_common(5):
        print(f'  {count:6,}  {path[:60]}')

    return {'total': total_lines, '5xx': len(errors_5xx)}`
const CODE_PYTHONLOGPARSING_3 = `cat > ~/ssh-analyzer.py << 'EOF'
#!/usr/bin/env python3
import re
from collections import Counter

FAILED = re.compile(r'Failed .* from ([\\d.]+)')
ACCEPTED = re.compile(r'Accepted .* for (\\S+) from ([\\d.]+)')

failed_ips   = Counter()
success_users = Counter()
logfile = '/var/log/auth.log'

try:
    with open(logfile) as f:
        for line in f:
            m = FAILED.search(line)
            if m:
                failed_ips[m.group(1)] += 1
            m = ACCEPTED.search(line)
            if m:
                success_users[m.group(1)] += 1

    print('=== Top 10 SSH failure sources ===')
    for ip, count in failed_ips.most_common(10):
        flag = ' *** HIGH ***' if count > 10 else ''
        print(f'  {ip:20s}  {count:4d} failures{flag}')

    print('\\
=== Successful logins ===')
    for user, count in success_users.most_common():
        print(f'  {user:20s}  {count} login(s)')

except FileNotFoundError:
    print(f'Log not found: {logfile}')
EOF
python3 ~/ssh-analyzer.py`
const CODE_PYTHONLOGPARSING_4 = `=== Top 10 SSH failure sources ===
  192.168.100.10         2 failures
  127.0.0.1              1 failures

=== Successful logins ===
  user                   3 login(s)`



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

export default function PythonLogParsing() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Log files are the most valuable source of operational intelligence available to
          a sysadmin. Python's combination of regex, file iteration, and the collections
          module makes it the ideal tool for turning raw log data into actionable reports —
          finding the top attack sources, slowest API endpoints, or most common errors in
          seconds.
        </p>
        <Callout type="info" icon="💡" title="Logs are structured — parse them properly">
          Every log format has a consistent structure. Don't use grep for complex analysis —
          parse the structure once with Python and then query the resulting data freely.
        </Callout>
      </section>

      <section>
        <h2>Regex for Log Parsing</h2>
        <CodeBlock title="Named groups — the right way to parse logs" language="bash"
          code={CODE_PYTHONLOGPARSING_1} />
      </section>

      <section>
        <h2>Analysis & Reporting</h2>
        <CodeBlock title="nginx log analysis — top IPs, status codes, slow endpoints" language="bash"
          code={CODE_PYTHONLOGPARSING_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PY-5</span>
            <span className="text-sm font-semibold text-white">Parse SSH Auth Log and Find Brute-Force Attempts</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Write a script to find the top SSH brute-force sources in auth.log."
              command={CODE_PYTHONLOGPARSING_3}
              language="bash"
              output={CODE_PYTHONLOGPARSING_4}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
