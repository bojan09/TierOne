import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WINDOWSNETWORKING_1 = `# ── IP Configuration ─────────────────────────────────────────
ipconfig /all              # Full NIC info including MAC, DHCP, DNS
ipconfig /flushdns         # Clear DNS resolver cache
ipconfig /release          # Release DHCP lease
ipconfig /renew            # Request new DHCP lease
ipconfig /displaydns       # Show DNS cache contents

# ── Connectivity testing ─────────────────────────────────────
ping -n 4 192.168.100.10   # ICMP ping (4 packets)
ping -a 192.168.100.10     # Resolve hostname from IP
tracert 8.8.8.8            # Trace route (Windows)

# PowerShell versions (more options)
Test-Connection -ComputerName DC01 -Count 2
Test-NetConnection -ComputerName DC01 -Port 389  # TCP port test
Test-NetConnection -ComputerName 8.8.8.8 -TraceRoute

# ── Connections and ports ────────────────────────────────────
netstat -ano               # All connections with PIDs
netstat -bn                # Connections with executable names
Get-NetTCPConnection       # PowerShell version
Get-NetTCPConnection -State Listen | Select-Object LocalPort,
  @{N='Process';E={(Get-Process -Id $_.OwningProcess).Name}}

# ── DNS ──────────────────────────────────────────────────────
nslookup dc01.lab.local
Resolve-DnsName dc01.lab.local -Type A
Resolve-DnsName -Name lab.local -Type MX

# ── Routing ──────────────────────────────────────────────────
route print                # Full routing table
Get-NetRoute               # PowerShell routing table`
const CODE_WINDOWSNETWORKING_2 = `# Find the adapter name
Get-NetAdapter | Select-Object Name, InterfaceDescription, Status

# Set static IP (replace 'Ethernet0' with your adapter name)
New-NetIPAddress \`\`
  -InterfaceAlias 'Ethernet0' \`\`
  -IPAddress      '192.168.100.50' \`\`
  -PrefixLength   24 \`\`
  -DefaultGateway '192.168.100.1'

# Set DNS servers
Set-DnsClientServerAddress \`\`
  -InterfaceAlias 'Ethernet0' \`\`
  -ServerAddresses '192.168.100.10','8.8.8.8'

# Revert to DHCP
Set-NetIPInterface -InterfaceAlias 'Ethernet0' -Dhcp Enabled
Set-DnsClientServerAddress -InterfaceAlias 'Ethernet0' -ResetServerAddresses`
const CODE_WINDOWSNETWORKING_3 = `# Full NIC info
Get-NetAdapter | Select-Object Name, Status, LinkSpeed, MacAddress

# IP configuration
Get-NetIPAddress | Where-Object AddressFamily -eq IPv4 |
  Select-Object InterfaceAlias, IPAddress, PrefixLength

# DNS servers
Get-DnsClientServerAddress -AddressFamily IPv4 |
  Where-Object ServerAddresses | Select-Object InterfaceAlias, ServerAddresses`
const CODE_WINDOWSNETWORKING_4 = `Name      Status  LinkSpeed  MacAddress
Ethernet0 Up      1 Gbps     00-0C-29-xx-xx-xx

InterfaceAlias  IPAddress        PrefixLength
Ethernet0       192.168.100.10   24

InterfaceAlias  ServerAddresses
Ethernet0       {127.0.0.1}`
const CODE_WINDOWSNETWORKING_5 = `# Test DC01's own services
$tests = @(
    @{Host='localhost'; Port=389;  Name='LDAP'},
    @{Host='localhost'; Port=53;   Name='DNS'},
    @{Host='localhost'; Port=3389; Name='RDP'},
    @{Host='localhost'; Port=5985; Name='WinRM'}
)

foreach ($t in $tests) {
    $r = Test-NetConnection -ComputerName $t.Host -Port $t.Port -WarningAction SilentlyContinue
    $status = if ($r.TcpTestSucceeded) {'OPEN'} else {'CLOSED'}
    Write-Host "  $($t.Name.PadRight(8)) port $($t.Port)  $status"
}`
const CODE_WINDOWSNETWORKING_6 = `  LDAP     port 389   OPEN
  DNS      port 53    OPEN
  RDP      port 3389  OPEN
  WinRM    port 5985  OPEN`



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

export default function WindowsNetworking() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Windows has a comprehensive set of networking tools — most sysadmins
          use only a fraction of them. This lesson covers the complete Windows
          networking toolkit from the classic <code className="font-mono text-accent-cyan text-sm mx-1">ipconfig</code>
          through to modern PowerShell cmdlets and packet capture with pktmon.
        </p>
      </section>

      <section>
        <h2>Diagnostic Command Reference</h2>
        <CodeBlock title="Windows networking toolkit" language="powershell"
          code={CODE_WINDOWSNETWORKING_1} />
      </section>

      <section>
        <h2>Configure Networking with PowerShell</h2>
        <CodeBlock title="Set static IP, DNS, and routes" language="powershell"
          code={CODE_WINDOWSNETWORKING_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WIN-5</span>
            <span className="text-sm font-semibold text-white">Network Diagnostics on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Run a complete network status snapshot on DC01."
              command={CODE_WINDOWSNETWORKING_3}
              output={CODE_WINDOWSNETWORKING_4}
            />
            <LabStep number={2}
              description="Test connectivity to key services and diagnose any failures."
              command={CODE_WINDOWSNETWORKING_5}
              output={CODE_WINDOWSNETWORKING_6}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
