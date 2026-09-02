import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WS2025BACKUP_1 = `# Install Windows Server Backup feature
Install-WindowsFeature Windows-Server-Backup -IncludeManagementTools

# ── Schedule a daily backup ───────────────────────────────────
$policy = New-WBPolicy

# Add volumes to back up
$vol = Get-WBVolume -AllVolumes | Where-Object { $_.MountPath -eq 'C:\\' }
Add-WBVolume -Policy $policy -Volume $vol

# Add System State (critical for domain controllers)
Add-WBSystemState -Policy $policy

# Set backup target (external drive or network share)
$target = New-WBBackupTarget -NetworkPath '\\\\NAS01\\Backups\\DC01' \`\`
  -Credential (Get-Credential 'BACKUP\\svc-backup')
Add-WBBackupTarget -Policy $policy -Target $target

# Schedule: daily at 23:00
Set-WBSchedule -Policy $policy -Schedule 23:00

# Apply policy
Set-WBPolicy -Policy $policy -Force

# Verify
Get-WBPolicy | Select-Object -ExpandProperty Schedule
Get-WBSummary`
const CODE_WS2025BACKUP_2 = `# Manual System State backup (run on DC01)
wbadmin start systemstatebackup -backupTarget:E: -quiet

# Verify backup completed
wbadmin get versions -backupTarget:E:

# ── AD Object restore (without full DC restore) ───────────────
# For deleted AD objects: use AD Recycle Bin (if enabled)
Get-ADObject -Filter { isDeleted -eq $true } \`\`
  -IncludeDeletedObjects -SearchBase 'CN=Deleted Objects,DC=lab,DC=local' |
  Select-Object Name, WhenDeleted

# Restore a deleted user from Recycle Bin
Restore-ADObject -Identity (Get-ADObject \`\`
  -Filter {Name -eq 'jsmith'} -IncludeDeletedObjects -SearchBase \`\`
  'CN=Deleted Objects,DC=lab,DC=local')

# ── Enable AD Recycle Bin (if not enabled) ────────────────────
Enable-ADOptionalFeature -Identity 'Recycle Bin Feature' \`\`
  -Scope ForestOrConfigurationSet \`\`
  -Target 'lab.local' -Confirm:$false`
const CODE_WS2025BACKUP_3 = `# Install the feature
Install-WindowsFeature Windows-Server-Backup -IncludeManagementTools

# Check existing backup status
Get-WBSummary`
const CODE_WS2025BACKUP_4 = `LastSuccessfulBackupTime   :
LastSuccessfulBackupTarget :
LastBackupResultHR         : 0
NumberOfVersions           : 0

← No backups yet — this is a fresh server`
const CODE_WS2025BACKUP_5 = `# Check if Recycle Bin is already enabled
Get-ADOptionalFeature -Filter 'name -eq "Recycle Bin Feature"' |
  Select-Object Name, EnabledScopes

# Enable if not already enabled
Enable-ADOptionalFeature -Identity 'Recycle Bin Feature' \`\`
  -Scope ForestOrConfigurationSet \`\`
  -Target 'lab.local' -Confirm:$false

# Test: delete a user and restore them
New-ADUser -Name 'Test Recovery' -SamAccountName 'testrecovery' -Enabled $true
Remove-ADUser -Identity 'testrecovery' -Confirm:$false

# Find in Recycle Bin
Get-ADObject -Filter {Name -eq 'Test Recovery'} \`\`
  -IncludeDeletedObjects |
  Restore-ADObject

Get-ADUser -Identity 'testrecovery' | Select-Object Name, Enabled`
const CODE_WS2025BACKUP_6 = `Name            Enabled
----            -------
Test Recovery   False    ← restored, re-enable manually`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info:'callout-info', warning:'callout-warning', success:'callout-success', danger:'callout-danger' }
  return (
    <div className={`callout ${s[type]}`}>
      <span className="callout-icon">{icon}</span>
      <div className="callout-body">{title && <strong>{title}</strong>}{children}</div>
    </div>
  )
}

function LabStep({ number, description, command, language='powershell', output }) {
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
          {output.split('\n').map((l,i)=><div key={i}>{l}</div>)}
        </div>
      )}
    </div>
  )
}

export default function WS2025Backup() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Backups are only valuable if you can restore from them. This lesson covers
          the theory — 3-2-1, RTO, RPO — and the practice: Windows Server Backup
          configuration, System State backups for Active Directory, and critically,
          how to test that your backups actually work.
        </p>
        <Callout type="danger" icon="🔥" title="The only good backup is a tested backup">
          An untested backup is a false sense of security. Schedule quarterly restore
          tests and treat a failed restore test with the same urgency as a production
          incident — because that's exactly what it predicts.
        </Callout>
      </section>

      <section>
        <h2>Backup Types Reference</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-700">
                <tr>{['Type','What it backs up','Speed','Storage','Best for'].map(h=>(
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {[
                  ['Full','All selected data','Slow','High','Weekly baseline'],
                  ['Incremental','Changed since last backup/incremental','Fast','Low','Daily — fast, space-efficient'],
                  ['Differential','Changed since last FULL','Medium','Medium','Daily — simpler restore than incremental'],
                  ['System State','AD DB, SYSVOL, Registry, Boot files','Medium','Medium','Domain Controllers'],
                  ['Bare Metal','Entire disk/system image','Slow','Very High','Disaster recovery to new hardware'],
                ].map(r=>(
                  <tr key={r[0]} className="hover:bg-surface-700/30">
                    {r.map((c,i)=>(
                      <td key={i} className={`px-3 py-2 ${i===0?'font-bold text-white':'text-slate-400'}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2>Windows Server Backup with PowerShell</h2>
        <CodeBlock title="Configure scheduled backup via PowerShell" language="powershell"
          code={CODE_WS2025BACKUP_1} />
      </section>

      <section>
        <h2>Active Directory System State Backup</h2>
        <CodeBlock title="Back up and restore AD System State" language="powershell"
          code={CODE_WS2025BACKUP_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WS-10</span>
            <span className="text-sm font-semibold text-white">Configure and Test Backup on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Install Windows Server Backup and check backup history."
              command={CODE_WS2025BACKUP_3}
              output={CODE_WS2025BACKUP_4}
            />
            <LabStep number={2}
              description="Enable the AD Recycle Bin for easy object recovery."
              command={CODE_WS2025BACKUP_5}
              output={CODE_WS2025BACKUP_6}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
