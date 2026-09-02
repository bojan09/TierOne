import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_UNIXPOSIXSHELL_1 = `#!/bin/sh
# POSIX-compliant script
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_NAME="$(basename "$0")"
LOG_FILE="/var/log/\${SCRIPT_NAME%.sh}.log"
LOCK_FILE="/tmp/\${SCRIPT_NAME%.sh}.lock"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }
die() { log "ERROR: $*" >&2; exit 1; }

# Cleanup on exit
cleanup() {
    rm -f "$LOCK_FILE"
    log 'Script finished'
}
trap cleanup EXIT INT TERM

# Prevent concurrent runs
[ -f "$LOCK_FILE" ] && die 'Already running'
echo $$ > "$LOCK_FILE"

# ── Main logic ────────────────────────────────────────────
log 'Script started'

[ -d /var/backup ] || mkdir -p /var/backup

for service in ssh nginx; do
    if command -v "$service" >/dev/null 2>&1; then
        log "Found: $service"
    else
        log "Not found: $service"
    fi
done`
const CODE_UNIXPOSIXSHELL_2 = `# Check which shell /bin/sh points to
ls -la /bin/sh

# Run a script under dash explicitly to test portability
dash myscript.sh

# Check for bashisms that break portability
shellcheck --shell=sh myscript.sh`



function LabStep({ number, description, command, language='bash', output }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 rounded-full bg-accent-amber/20 border border-accent-amber/30 text-accent-amber text-[11px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">{number}</span>
        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
      </div>
      {command && <div className="ml-9"><CodeBlock code={command} language={language} showCopy /></div>}
      {output && (<div className="ml-9 rounded-xl bg-surface-950 border border-surface-700 px-4 py-3 font-mono text-xs text-accent-green leading-6">{output.split('\n').map((l,i)=><div key={i}>{l}</div>)}</div>)}
    </div>
  )
}

export default function UnixPOSIXShell() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>POSIX shell scripting is the skill that makes your scripts work everywhere — Linux, macOS, FreeBSD, Solaris. A script written to the POSIX standard with #!/bin/sh runs on any certified system without modification.</p>
      </section>
      <section>
        <h2>POSIX Script Template</h2>
        <CodeBlock title="production-ready POSIX sh template" language="bash"
          code={CODE_UNIXPOSIXSHELL_1} />
      </section>
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header"><span className="lab-badge">LAB UNIX-2</span><span className="text-sm font-semibold text-white">Write and Test a POSIX Script</span><span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span></div>
          <div className="lab-body space-y-8">
            <LabStep number={1} description="Verify your script runs under dash (strict POSIX sh) not just bash."
              command={CODE_UNIXPOSIXSHELL_2}
              output="/bin/sh -> dash    <- Ubuntu uses POSIX dash, not bash" />
          </div>
        </div>
      </section>
      
    </>
  )
}
