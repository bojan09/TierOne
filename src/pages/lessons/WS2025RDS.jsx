import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WS2025RDS_1 = `# Quick deployment — all roles on one server (lab/small environments)
Install-WindowsFeature RDS-RD-Server, RDS-Connection-Broker, RDS-Web-Access, RDS-Licensing -IncludeManagementTools

# Verify installation
Get-WindowsFeature | Where-Object {$_.Name -like 'RDS-*' -and $_.InstallState -eq 'Installed'} |
  Select-Object Name, DisplayName | Format-Table -AutoSize`
const CODE_WS2025RDS_2 = `# List all active RDS sessions
Get-RDUserSession -ConnectionBroker DC01.lab.local |
  Select-Object UserName, HostServer, SessionState, IdleTime |
  Format-Table -AutoSize

# Disconnect a specific session
$session = Get-RDUserSession | Where-Object UserName -eq 'jsmith'
Disconnect-RDUser -HostServer $session.HostServer -UnifiedSessionID $session.UnifiedSessionId -Force

# Get server load
Get-RDServer -ConnectionBroker DC01.lab.local -Role RDS-RD-SERVER |
  ForEach-Object {
    $load = (Get-RDSessionHost -SessionHost $_.Server -ConnectionBroker DC01.lab.local).RDSessionHostCurrentSessions
    [PSCustomObject]@{Server=$_.Server; ActiveSessions=$load}
  }`
const CODE_WS2025RDS_3 = `# Check RDP enabled state
(Get-ItemProperty 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server').fDenyTSConnections
# 0 = enabled, 1 = disabled

# Enable if needed
Set-ItemProperty 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' fDenyTSConnections -Value 0
Enable-NetFirewallRule -DisplayGroup 'Remote Desktop'

# Who is connected right now?
query session /server:DC01`



function Callout({ type='info', icon, title, children }) {
  const s = { info:'callout-info', warning:'callout-warning', success:'callout-success' }
  return (<div className={`callout ${s[type]}`}><span className="callout-icon">{icon}</span><div className="callout-body">{title && <strong>{title}</strong>}{children}</div></div>)
}

function LabStep({ number, description, command, language='powershell', output }) {
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

export default function WS2025RDS() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>Remote Desktop Services delivers Windows desktops and applications to users from a central server — essential for remote work scenarios, legacy application hosting, and centralised desktop management.</p>
      </section>
      <section>
        <h2>RDS Role Installation</h2>
        <CodeBlock title="Install RDS roles" language="powershell"
          code={CODE_WS2025RDS_1} />
      </section>
      <section>
        <h2>Managing Sessions with PowerShell</h2>
        <CodeBlock title="RDS session management" language="powershell"
          code={CODE_WS2025RDS_2} />
      </section>
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WS-9</span>
            <span className="text-sm font-semibold text-white">Enable and Test RDP on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1} description="Verify RDP is enabled and check current sessions."
              command={CODE_WS2025RDS_3}
              output={["0","","SESSIONNAME  USERNAME       ID  STATE   TYPE","console      Administrator   1  Active"]} />
          </div>
        </div>
      </section>
      
    </>
  )
}
