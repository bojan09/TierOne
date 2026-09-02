import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_UNIXPROCESSES_1 = `# ── Inspect processes ────────────────────────────────────
ps aux                    # All processes, all users
ps aux | grep nginx        # Filter by name
ps -ef                    # Full format (PPID visible)
pgrep nginx               # Get PIDs by name
pgrep -u root             # Get PIDs owned by root

# ── Signals ──────────────────────────────────────────────
kill PID                  # SIGTERM (15) — graceful
kill -9 PID               # SIGKILL — force
kill -HUP PID             # SIGHUP — reload config
pkill nginx               # Kill by process name
pkill -u alice            # Kill all of alice's processes
killall -HUP sshd         # Signal all matching processes

# ── Job control ──────────────────────────────────────────
long_command &            # Run in background
Ctrl+Z                    # Suspend current process
jobs                      # List background/suspended jobs
fg %1                     # Bring job 1 to foreground
bg %1                     # Resume job 1 in background
nohup command &           # Run immune to hangup (survives logout)
disown %1                 # Remove from job table (survives shell exit)`
const CODE_UNIXPROCESSES_2 = `# Start two background jobs
sleep 60 &
sleep 60 &

# List them
jobs

# Check their PIDs
ps aux | grep sleep | grep -v grep

# Bring first to foreground and cancel it
fg %1
# Press Ctrl+C to kill it

# Kill the remaining job by PID
kill %2
echo 'Both jobs cleaned up'`
const CODE_UNIXPROCESSES_3 = `[1] 1234
[2] 1235
[1]-  Running    sleep 60 &
[2]+  Running    sleep 60 &
Both jobs cleaned up`



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

export default function UnixProcesses() {
  return (
    <>
      <section><h2>Overview</h2><p>Unix process management is a POSIX-standard model: every process has a PID, parent PID, owner, and state. Signals are the inter-process communication mechanism. Understanding this model lets you manage processes, write parallel scripts, and diagnose runaway or stuck processes on any Unix system.</p></section>
      <section>
        <h2>Process & Signal Reference</h2>
        <CodeBlock title="Complete process management toolkit" language="bash"
          code={CODE_UNIXPROCESSES_1} />
      </section>
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header"><span className="lab-badge">LAB UNIX-5</span><span className="text-sm font-semibold text-white">Process Management on Ubuntu</span><span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span></div>
          <div className="lab-body space-y-8">
            <LabStep number={1} description="Practice job control and parallel execution."
              command={CODE_UNIXPROCESSES_2}
              output={CODE_UNIXPROCESSES_3} />
          </div>
        </div>
      </section>
      
    </>
  )
}
