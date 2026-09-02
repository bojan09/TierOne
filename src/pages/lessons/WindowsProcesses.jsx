import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WINDOWSPROCESSES_1 = `# ── View services ────────────────────────────────────────────
Get-Service | Sort-Object Status -Descending | Format-Table -AutoSize

# Find stopped automatic services (should be running)
Get-Service | Where-Object {
    $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped'
} | Select-Object Name, DisplayName, Status

# ── Control services ─────────────────────────────────────────
Start-Service   -Name 'Spooler'
Stop-Service    -Name 'Spooler' -Force
Restart-Service -Name 'Spooler'

# Change startup type
Set-Service -Name 'Spooler' -StartupType Disabled
Set-Service -Name 'WinRM'   -StartupType Automatic

# ── Service dependencies ─────────────────────────────────────
(Get-Service 'Spooler').DependentServices   # What depends ON this
(Get-Service 'Spooler').RequiredServices    # What this depends ON

# ── Identify what's inside a svchost ─────────────────────────
$pid = (Get-Process svchost | Select-Object -First 1).Id
Get-Service | Where-Object { $_.ServiceHandle } |
    Get-Process | Where-Object Id -eq $pid`
const CODE_WINDOWSPROCESSES_2 = `# Top 10 by CPU
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 |
  Select-Object Name, Id,
    @{N='CPU_s'; E={[math]::Round($_.CPU, 1)}},
    @{N='RAM_MB'; E={[math]::Round($_.WorkingSet/1MB, 1)}}

# Top 10 by RAM
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10 |
  Select-Object Name, Id,
    @{N='RAM_MB'; E={[math]::Round($_.WorkingSet/1MB, 1)}} |
  Format-Table -AutoSize`
const CODE_WINDOWSPROCESSES_3 = `Name         Id  CPU_s  RAM_MB
svchost    1234   12.3   145.2
lsass       680    4.1    56.8
dns         892    2.9    38.4`
const CODE_WINDOWSPROCESSES_4 = `Write-Host '=== Service Health Check ==='

$stopped = Get-Service | Where-Object {
    $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped'
}

if ($stopped) {
    Write-Host "Found $($stopped.Count) stopped automatic service(s):" -ForegroundColor Yellow
    $stopped | Select-Object Name, DisplayName | Format-Table -AutoSize
} else {
    Write-Host 'All automatic services are running ✓' -ForegroundColor Green
}`



function LabStep({ number, description, command, language = 'powershell', output }) {
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

export default function WindowsProcesses() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Task Manager is the first tool most people open when a system is slow —
          but most users only scratch the surface. Understanding process trees,
          service hosting, memory metrics, and the Sysinternals suite turns you
          from someone who restarts the computer to someone who actually diagnoses
          and fixes the root cause.
        </p>
      </section>

      <section>
        <h2>Task Manager — Beyond the Basics</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="divide-y divide-surface-700">
            {[
              { tab: 'Processes',   tip: 'Right-click → Go to Details for the full process entry. Right-click → Open file location to verify executable path (malware detection).' },
              { tab: 'Performance', tip: 'Click "Open Resource Monitor" for per-process CPU/disk/network breakdown. Watch Hard Faults/sec — spikes mean paging to disk.' },
              { tab: 'App History', tip: 'CPU time and network usage per UWP app over 30 days. Useful for identifying background data consumers.' },
              { tab: 'Startup',     tip: 'Enable/disable startup programs. "Startup impact" is measured by actual CPU and disk usage during login. High-impact items slow boot.' },
              { tab: 'Details',     tip: 'Full process list with PID, CPU, Memory (Private Working Set), Status, and full command line (right-click → Select Columns).' },
              { tab: 'Services',    tip: 'Quick service status view. Right-click → Open Services for full management. Note which services share a svchost group.' },
            ].map(t => (
              <div key={t.tab} className="grid sm:grid-cols-4 gap-2 p-3">
                <p className="font-semibold text-white text-sm col-span-1">{t.tab}</p>
                <p className="text-xs text-slate-400 leading-relaxed col-span-3">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2>Service Management</h2>
        <CodeBlock title="Managing Windows services with PowerShell" language="powershell"
          code={CODE_WINDOWSPROCESSES_1} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WIN-4</span>
            <span className="text-sm font-semibold text-white">Process & Service Analysis on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Generate a process snapshot sorted by resource usage."
              command={CODE_WINDOWSPROCESSES_2}
              output={CODE_WINDOWSPROCESSES_3}
            />
            <LabStep number={2}
              description="Audit all services and find any that are stopped but set to auto-start."
              command={CODE_WINDOWSPROCESSES_4}
              output="All automatic services are running ✓"
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
