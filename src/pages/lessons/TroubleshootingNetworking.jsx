import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_TROUBLESHOOTINGNETWORKING_1 = `# Step 1: Does hostname resolve at all?
nslookup dc01.lab.local
dig dc01.lab.local

# Step 2: Test with a specific DNS server
dig @192.168.100.10 dc01.lab.local   # Test with DC01 DNS
dig @8.8.8.8 google.com              # Test with Google DNS

# Step 3: Check reverse DNS (PTR record)
dig -x 192.168.100.10
nslookup 192.168.100.10

# Step 4: Check what DNS server you're using
cat /etc/resolv.conf
resolvectl status

# Step 5: Test DNS connectivity
nc -zuv 192.168.100.10 53   # UDP port 53
nc -zv  192.168.100.10 53   # TCP port 53 (zone transfers)

# Step 6: Flush local DNS cache
# Linux:
sudo resolvectl flush-caches
# Windows:
# ipconfig /flushdns`
const CODE_TROUBLESHOOTINGNETWORKING_2 = `# Capture all traffic on interface ens33
sudo tcpdump -i ens33

# Capture with readable timestamps, no DNS resolution, line buffered
sudo tcpdump -i ens33 -n -l

# Filter by host
sudo tcpdump -i ens33 -n host 192.168.100.10

# Filter by port
sudo tcpdump -i ens33 -n port 443
sudo tcpdump -i ens33 -n port 53 and udp

# Capture DNS queries
sudo tcpdump -i ens33 -n port 53

# Capture HTTP traffic (insecure) with payload
sudo tcpdump -i ens33 -n -A port 80

# Save to file for Wireshark analysis
sudo tcpdump -i ens33 -n -w /tmp/capture.pcap
# Transfer and open in Wireshark on your workstation

# Count packets by type (quick statistics)
sudo tcpdump -i ens33 -n -q -c 100 2>/dev/null | awk '{print $2}' | cut -d. -f1-4 | sort | uniq -c | sort -rn | head`
const CODE_TROUBLESHOOTINGNETWORKING_3 = `# L1/L2: Interface and link status
ip link show ens33 | grep -E 'state|ether'

# L3: IP and routing
ip addr show ens33 | grep inet
ping -c 2 192.168.100.10
ip route show

# L4: Port connectivity
nc -zv 192.168.100.10 389   # LDAP
nc -zv 192.168.100.10 53    # DNS
nc -zv 192.168.100.10 445   # SMB

# L7: DNS resolution
dig @192.168.100.10 dc01.lab.local +short`
const CODE_TROUBLESHOOTINGNETWORKING_4 = `ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> state UP
    ether 00:0c:29:xx:xx:xx
    inet 192.168.100.20/24
64 bytes from 192.168.100.10: icmp_seq=1 ttl=128 time=0.4ms
Connection to 192.168.100.10 389 port [tcp/ldap] succeeded!
Connection to 192.168.100.10 53  port [tcp/domain] succeeded!
Connection to 192.168.100.10 445 port [tcp/microsoft-ds] succeeded!
192.168.100.10`
const CODE_TROUBLESHOOTINGNETWORKING_5 = `# Terminal 1: start capture
sudo tcpdump -i ens33 -n port 53 &

# Terminal 2: generate DNS traffic
dig @192.168.100.10 dc01.lab.local
dig @192.168.100.10 _ldap._tcp.lab.local SRV

# Stop capture
kill %1`
const CODE_TROUBLESHOOTINGNETWORKING_6 = `11:00:01 192.168.100.20.48291 > 192.168.100.10.53: A? dc01.lab.local.
11:00:01 192.168.100.10.53 > 192.168.100.20.48291: A 192.168.100.10
11:00:02 192.168.100.20.51234 > 192.168.100.10.53: SRV? _ldap._tcp.lab.local.
11:00:02 192.168.100.10.53 > 192.168.100.20.51234: SRV dc01.lab.local.:389`



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

export default function TroubleshootingNetworking() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Network problems are among the most common — and most anxiety-inducing —
          incidents you'll face as a sysadmin. The good news: with a structured
          OSI-layer approach and the right tools, most network problems can be
          diagnosed in minutes rather than hours.
        </p>
        <Callout type="info" icon="🎯" title="The golden rule of network troubleshooting">
          Work the OSI layers. Start at Layer 1 (is the cable plugged in?) and work
          upward to Layer 7 (is the application responding?). Each layer you eliminate
          narrows the problem space by half.
        </Callout>
      </section>

      <section>
        <h2>The Network Troubleshooting Toolkit</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="divide-y divide-surface-700">
            {[
              { tool: 'ping',       layer: 'L3', purpose: 'Test basic IP reachability — does the path exist?', cmd: 'ping -c 4 192.168.100.10' },
              { tool: 'traceroute', layer: 'L3', purpose: 'Show each router hop to destination — where does the path fail?', cmd: 'traceroute 8.8.8.8' },
              { tool: 'mtr',        layer: 'L3', purpose: 'Continuous traceroute with packet loss per hop — better than traceroute for intermittent issues', cmd: 'mtr --report 8.8.8.8' },
              { tool: 'ss / netstat', layer: 'L4', purpose: 'Show all TCP/UDP connections and listening ports', cmd: 'ss -tlnp' },
              { tool: 'nc (netcat)', layer: 'L4', purpose: 'Test if a specific TCP/UDP port is open', cmd: 'nc -zv 192.168.100.10 443' },
              { tool: 'nslookup / dig', layer: 'L7', purpose: 'DNS resolution testing — does the name resolve correctly?', cmd: 'dig @8.8.8.8 example.com' },
              { tool: 'curl',        layer: 'L7', purpose: 'Test HTTP/HTTPS application layer — does the web service respond?', cmd: 'curl -Iv https://example.com' },
              { tool: 'tcpdump',     layer: 'All', purpose: 'Capture raw packets — the ground truth of what is actually on the wire', cmd: 'tcpdump -i ens33 port 80' },
            ].map(t => (
              <div key={t.tool} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 items-start">
                <div className="flex items-center gap-2">
                  <code className="font-mono font-bold text-accent-cyan text-sm">{t.tool}</code>
                  <span className="tag text-[10px]">{t.layer}</span>
                </div>
                <p className="text-xs text-slate-400 sm:col-span-2 leading-relaxed">{t.purpose}</p>
                <code className="text-[11px] font-mono text-slate-500 leading-relaxed">{t.cmd}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2>DNS Diagnosis</h2>
        <CodeBlock title="DNS troubleshooting workflow" language="bash"
          code={CODE_TROUBLESHOOTINGNETWORKING_1} />
      </section>

      <section>
        <h2>tcpdump — Packet Capture</h2>
        <CodeBlock title="tcpdump — essential capture filters" language="bash"
          code={CODE_TROUBLESHOOTINGNETWORKING_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB TROUBLE-4</span>
            <span className="text-sm font-semibold text-white">Full OSI-Layer Connectivity Diagnosis</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Work through all OSI layers from the Ubuntu VM to DC01."
              command={CODE_TROUBLESHOOTINGNETWORKING_3}
              output={CODE_TROUBLESHOOTINGNETWORKING_4}
            />
            <LabStep number={2}
              description="Capture DNS traffic with tcpdump and watch queries in real time."
              command={CODE_TROUBLESHOOTINGNETWORKING_5}
              output={CODE_TROUBLESHOOTINGNETWORKING_6}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
