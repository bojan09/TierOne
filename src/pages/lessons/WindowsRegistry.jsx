import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WINDOWSREGISTRY_1 = `# ── Read values ──────────────────────────────────────────────
reg query 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' /v ProductName

# PowerShell — read all values in a key
Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' |
  Select-Object ProductName, DisplayVersion, CurrentBuild

# ── Write values ─────────────────────────────────────────────
# Create a key and set a string value
New-Item -Path 'HKCU:\\Software\\MyApp' -Force | Out-Null
Set-ItemProperty -Path 'HKCU:\\Software\\MyApp' -Name 'Theme' -Value 'Dark'
Set-ItemProperty -Path 'HKCU:\\Software\\MyApp' -Name 'MaxItems' -Value 50 -Type DWord

# ── Export and import (backup/restore) ───────────────────────
reg export 'HKCU\\Software\\MyApp' C:\\backup-myapp.reg
reg import C:\\backup-myapp.reg

# ── Audit startup entries ────────────────────────────────────
$runKeys = @(
    'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
    'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run'
)
foreach ($key in $runKeys) {
    Write-Host "\`n[$key]"
    Get-ItemProperty $key -ErrorAction SilentlyContinue |
        Select-Object * -ExcludeProperty PS* |
        Format-List
}`
const CODE_WINDOWSREGISTRY_2 = `# Windows version details from registry
Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' |
  Select-Object ProductName, DisplayVersion, CurrentBuild, UBR

# Check all startup entries
$keys = @(
  'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
  'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run'
)
foreach ($k in $keys) {
    Write-Host "--- $k ---"
    (Get-ItemProperty $k).PSObject.Properties |
        Where-Object Name -notlike 'PS*' |
        Select-Object Name, Value | Format-Table -AutoSize
}`
const CODE_WINDOWSREGISTRY_3 = `ProductName    : Windows Server 2025 Standard Evaluation
DisplayVersion : 24H2
CurrentBuild   : 26100
UBR            : 2033

--- HKLM:\\...\\Run ---
Name            Value
SecurityHealth  C:\\Windows\\System32\\SecurityHealthSystray.exe`
const CODE_WINDOWSREGISTRY_4 = `# Create a custom app registry key
New-Item 'HKLM:\\SOFTWARE\\TierOne' -Force | Out-Null
Set-ItemProperty 'HKLM:\\SOFTWARE\\TierOne' -Name 'Version' -Value '1.0'
Set-ItemProperty 'HKLM:\\SOFTWARE\\TierOne' -Name 'InstallDate' -Value (Get-Date -Format 'yyyy-MM-dd')
Set-ItemProperty 'HKLM:\\SOFTWARE\\TierOne' -Name 'Enabled' -Value 1 -Type DWord

# Export as backup
reg export 'HKLM\\SOFTWARE\\TierOne' C:\\reg-backup.reg /y
Write-Host 'Exported to C:\\reg-backup.reg'

# Verify
Get-ItemProperty 'HKLM:\\SOFTWARE\\TierOne'`
const CODE_WINDOWSREGISTRY_5 = `Exported to C:\\reg-backup.reg
Version     : 1.0
InstallDate : 2025-01-15
Enabled     : 1`


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

export default function WindowsRegistry() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          The Windows Registry is the central configuration database for the entire
          operating system. Every installed application, hardware device, user
          preference, and system setting is stored here. Understanding the registry
          is essential for troubleshooting, security auditing, and automation.
        </p>
      </section>

      <section>
        <h2>Registry Hive Structure</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="divide-y divide-surface-700">
            {[
              { hive: 'HKLM\\HARDWARE',   file: 'volatile (RAM)',                    desc: 'Detected hardware devices and their configuration. Rebuilt on every boot.' },
              { hive: 'HKLM\\SAM',        file: 'System32\\config\\SAM',            desc: 'Local accounts database. Encrypted. Only accessible as SYSTEM.' },
              { hive: 'HKLM\\SECURITY',   file: 'System32\\config\\SECURITY',       desc: 'Local security policy, LSA secrets, cached domain credentials.' },
              { hive: 'HKLM\\SOFTWARE',   file: 'System32\\config\\SOFTWARE',       desc: 'Machine-wide software settings. Installed apps write here.' },
              { hive: 'HKLM\\SYSTEM',     file: 'System32\\config\\SYSTEM',         desc: 'Services, drivers, boot configuration. Critical for system startup.' },
              { hive: 'HKCU',             file: 'Users\\SID\\NTUSER.DAT',           desc: 'Current user\'s settings. Loaded when user logs in.' },
              { hive: 'HKCR',             file: 'Merge of HKLM\\SOFTWARE\\Classes', desc: 'File associations and COM object registrations.' },
            ].map(r => (
              <div key={r.hive} className="grid sm:grid-cols-3 gap-2 p-3">
                <code className="font-mono text-accent-cyan text-xs font-bold">{r.hive}</code>
                <code className="font-mono text-slate-500 text-[11px] leading-relaxed">{r.file}</code>
                <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2>Registry Operations</h2>
        <CodeBlock title="reg.exe and PowerShell registry reference" language="powershell"
          code={CODE_WINDOWSREGISTRY_1} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WIN-3</span>
            <span className="text-sm font-semibold text-white">Registry Audit & Configuration on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Read key system information from the registry."
              command={CODE_WINDOWSREGISTRY_2}
              output={CODE_WINDOWSREGISTRY_3}
            />
            <LabStep number={2}
              description="Create and export an application configuration key."
              command={CODE_WINDOWSREGISTRY_4}
              output={CODE_WINDOWSREGISTRY_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
