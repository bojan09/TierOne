import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WS2025WAC_1 = `# Download WAC installer
$wacUrl = 'https://aka.ms/WACDownload'
Invoke-WebRequest -Uri $wacUrl -OutFile C:\\Temp\\WindowsAdminCenter.msi

# Install in gateway mode with HTTPS on port 443
msiexec /i C:\\Temp\\WindowsAdminCenter.msi /qn /L*v C:\\Temp\\wac-install.log SME_PORT=443 SSL_CERTIFICATE_OPTION=generate

# Wait for service to start
Start-Sleep -Seconds 30
Get-Service ServerManagementGateway | Select-Object Name, Status

# Access: https://DC01 from any browser on the network`
const CODE_WS2025WAC_2 = `# Check WinRM is running (required for WAC to manage servers)
Get-Service WinRM | Select-Object Name, Status, StartType

# Check WAC can reach itself via WinRM
Test-WSMan localhost

# Check Windows Firewall allows WinRM
Get-NetFirewallRule -DisplayName '*Windows Remote Management*' |
  Select-Object DisplayName, Enabled | Format-Table -AutoSize`
const CODE_WS2025WAC_3 = `Name   Status  StartType
----   ------  ---------
WinRM  Running Automatic

cfg     : http://schemas.microsoft.com/wbem/wsman/1/config

DisplayName                            Enabled
Windows Remote Management (HTTP-In)    True`



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

export default function WS2025WAC() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>Windows Admin Center is Microsoft's modern, browser-based replacement for the fragmented world of MMC snap-ins, Server Manager, and constant RDP sessions. Install it once on a management server and manage your entire Windows fleet from a browser — no RDP required.</p>
        <Callout type="info" icon="🌐" title="No cloud required">WAC runs entirely on-premises. No Azure subscription, no internet connectivity needed. It is a locally-hosted web application that uses WinRM to reach your servers.</Callout>
      </section>
      <section>
        <h2>WAC Key Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {[
            {icon:'📊',name:'Performance Monitor',desc:'Real-time CPU, memory, disk, and network charts without RDP'},
            {icon:'📋',name:'Event Viewer',desc:'Browse and filter Windows event logs in the browser'},
            {icon:'💾',name:'Storage',desc:'Manage volumes, disks, and Storage Spaces'},
            {icon:'⚙️',name:'Services',desc:'Start, stop, and configure Windows services'},
            {icon:'🔥',name:'Windows Firewall',desc:'View and manage firewall rules graphically'},
            {icon:'📜',name:'Certificates',desc:'Browse and manage the certificate store'},
            {icon:'💻',name:'PowerShell',desc:'Browser-based PowerShell terminal'},
            {icon:'🌐',name:'Network',desc:'View and configure network adapters'},
            {icon:'📁',name:'Files',desc:'Browse the server filesystem'},
          ].map(t => (
            <div key={t.name} className="info-card py-3 text-center">
              <span className="text-2xl">{t.icon}</span>
              <p className="font-bold text-white text-xs mt-1">{t.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Installation & Setup</h2>
        <CodeBlock title="Install WAC in gateway mode on DC01" language="powershell"
          code={CODE_WS2025WAC_1}
        />
      </section>
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WS-11</span>
            <span className="text-sm font-semibold text-white">Verify WAC Prerequisites on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~10 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1} description="Check all WAC prerequisites are met on DC01."
              command={CODE_WS2025WAC_2}
              output={CODE_WS2025WAC_3}
            />
          </div>
        </div>
      </section>
      
    </>
  )
}
