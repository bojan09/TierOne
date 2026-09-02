import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WINDOWSEVENTVIEWER_1 = `# ── Recent errors (server-side filtered — fast) ───────────────
Get-WinEvent -FilterHashtable @{
    LogName   = 'System'
    Level     = 1, 2          # Critical and Error
    StartTime = (Get-Date).AddHours(-24)
} | Select-Object TimeCreated, Id, ProviderName, Message |
  Format-Table -AutoSize

# ── Security: failed logins in last hour ─────────────────────
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    Id      = 4625
    StartTime = (Get-Date).AddHours(-1)
} | Select-Object TimeCreated,
    @{N='Account'; E={$_.Properties[5].Value}},
    @{N='Source';  E={$_.Properties[19].Value}}

# ── Service Control Manager events (service failures) ─────────
Get-WinEvent -FilterHashtable @{
    LogName      = 'System'
    ProviderName = 'Service Control Manager'
    Level        = 1, 2
} -MaxEvents 20 | Select-Object TimeCreated, Message

# ── Count events by ID — find the noisy ones ─────────────────
Get-WinEvent -LogName System -MaxEvents 1000 |
    Group-Object Id |
    Sort-Object Count -Descending |
    Select-Object -First 10 |
    Select-Object Name, Count`
const CODE_WINDOWSEVENTVIEWER_2 = `# Recent successful logons
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'; Id = 4624
    StartTime = (Get-Date).AddHours(-24)
} -MaxEvents 20 |
ForEach-Object {
    [PSCustomObject]@{
        Time    = $_.TimeCreated
        Account = $_.Properties[5].Value
        Type    = switch($_.Properties[8].Value) {
            2 {'Interactive'} 3 {'Network'} 10 {'Remote'} default {'Other'}
        }
        Source = $_.Properties[18].Value
    }
} | Where-Object Account -ne '-' |
  Format-Table -AutoSize`
const CODE_WINDOWSEVENTVIEWER_3 = `Time                Account        Type          Source
----                -------        ----          ------
01/15/2025 10:00    Administrator  Interactive   -
01/15/2025 09:55    Administrator  Remote        192.168.100.20
01/15/2025 09:50    SYSTEM         Network       -`
const CODE_WINDOWSEVENTVIEWER_4 = `# Check if audit log has been tampered with
$cleared = Get-WinEvent -FilterHashtable @{
    LogName = 'Security'; Id = 1102
} -MaxEvents 5 -ErrorAction SilentlyContinue

if ($cleared) {
    Write-Host 'WARNING: Audit log was cleared!' -ForegroundColor Red
    $cleared | Select-Object TimeCreated, Message
} else {
    Write-Host 'OK: Audit log intact (no clearing events found)' -ForegroundColor Green
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

export default function WindowsEventViewer() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Event Viewer contains the most comprehensive operational record of everything
          happening on a Windows system. For security incidents, performance problems,
          and application failures, the event logs are always the first place to look.
          Knowing exactly which logs to check and which event IDs matter cuts diagnosis
          time from hours to minutes.
        </p>
      </section>

      <section>
        <h2>Critical Event IDs to Know</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-700">
                <tr>{['ID','Log','Meaning','Why it matters'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {[
                  ['4624','Security','Successful logon','Who logged in, when, from where, what type (RDP vs local)'],
                  ['4625','Security','Failed logon','Brute-force detection — many failures = attack in progress'],
                  ['4648','Security','Logon with explicit credentials (runas)','Credential theft / lateral movement indicator'],
                  ['4672','Security','Special privileges assigned at logon','Admin-level logon — track privilege use'],
                  ['4688','Security','Process creation','What programs ran, who ran them, parent process (requires audit policy)'],
                  ['4720','Security','User account created','Unauthorised account creation = potential backdoor'],
                  ['4732','Security','User added to security group','Privilege escalation — user added to Admins'],
                  ['7045','System','New service installed','Malware often installs as a service for persistence'],
                  ['1102','Security','Audit log cleared','Attacker covering tracks — high priority alert'],
                  ['41','System','Kernel power — unexpected restart','System crash / BSOD without graceful shutdown'],
                ].map(r => (
                  <tr key={r[0]} className="hover:bg-surface-700/30">
                    <td className="px-3 py-2 font-mono font-bold text-brand-300">{r[0]}</td>
                    <td className="px-3 py-2 text-slate-500">{r[1]}</td>
                    <td className="px-3 py-2 text-white">{r[2]}</td>
                    <td className="px-3 py-2 text-slate-400">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2>Querying Logs with PowerShell</h2>
        <CodeBlock title="Get-WinEvent — efficient log querying" language="powershell"
          code={CODE_WINDOWSEVENTVIEWER_1} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WIN-6</span>
            <span className="text-sm font-semibold text-white">Security Log Analysis on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Query the Security log for logon events and build an activity report."
              command={CODE_WINDOWSEVENTVIEWER_2}
              output={CODE_WINDOWSEVENTVIEWER_3}
            />
            <LabStep number={2}
              description="Check for any audit log cleared events (serious security indicator)."
              command={CODE_WINDOWSEVENTVIEWER_4}
              output="OK: Audit log intact (no clearing events found)"
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
