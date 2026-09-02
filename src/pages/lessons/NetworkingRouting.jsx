import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_NETWORKINGROUTING_1 = `# ── View routing table ───────────────────────────────────────
ip route show
ip route show table main   # Same as above
route -n                   # Legacy format (still useful)

# ── Find which route is used for a destination ───────────────
ip route get 8.8.8.8       # Which route reaches Google DNS?
ip route get 10.10.20.5    # Which route for internal IP?

# ── Add static routes ────────────────────────────────────────
# Route a specific network via a gateway
sudo ip route add 10.20.0.0/16 via 192.168.100.1

# Route via a specific interface
sudo ip route add 172.16.0.0/12 dev ens34

# Add a default route (gateway of last resort)
sudo ip route add default via 192.168.100.1

# ── Remove routes ────────────────────────────────────────────
sudo ip route del 10.20.0.0/16
sudo ip route del default

# ── Make routes persistent (Netplan) ─────────────────────────
# In /etc/netplan/00-config.yaml:
# network:
#   ethernets:
#     ens33:
#       routes:
#         - to: 10.20.0.0/16
#           via: 192.168.100.1
#         - to: default
#           via: 192.168.100.1
sudo netplan apply`
const CODE_NETWORKINGROUTING_2 = `# Current routing table
ip route show

# Which route reaches DC01?
ip route get 192.168.100.10

# Trace the actual path
traceroute -n 192.168.100.10
traceroute -n 8.8.8.8`
const CODE_NETWORKINGROUTING_3 = `default via 192.168.100.1 dev ens33 proto static
192.168.100.0/24 dev ens33 proto kernel scope link src 192.168.100.20

192.168.100.10 dev ens33 src 192.168.100.20 uid 1000
  cache

traceroute to 192.168.100.10: 1 hop
 1  192.168.100.10  0.412 ms`
const CODE_NETWORKINGROUTING_4 = `# Simulate a static route to a remote network
sudo ip route add 172.16.50.0/24 via 192.168.100.1

# Verify it was added
ip route show | grep 172.16

# Check which route would be used
ip route get 172.16.50.100

# Clean up
sudo ip route del 172.16.50.0/24`
const CODE_NETWORKINGROUTING_5 = `172.16.50.0/24 via 192.168.100.1 dev ens33

172.16.50.100 via 192.168.100.1 dev ens33 src 192.168.100.20
  cache`



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

export default function NetworkingRouting() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Routing is the process of forwarding packets from source to destination across
          multiple networks. Every packet in a TCP/IP network is routed — your workstation
          routes it to the default gateway, which routes it toward the destination,
          hop by hop, until it arrives. Understanding routing helps you diagnose
          connectivity problems, design networks, and understand how the internet works.
        </p>
      </section>

      <section>
        <h2>How a Router Makes a Decision</h2>
        <p>For every incoming packet, a router asks: "Which route best matches the destination IP?"</p>
        <div className="info-card mt-4 overflow-hidden">
          <div className="p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Routing table lookup — longest prefix match wins
            </p>
            <div className="font-mono text-xs space-y-1.5 overflow-x-auto">
              <div className="min-w-[420px]">
                <div className="grid grid-cols-3 gap-4 text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                  <span>Destination</span><span>Gateway</span><span>Interface</span>
                </div>
                {[
                  { dest: '10.0.0.0/8',       gw: 'via 192.168.1.1', iface: 'eth0', match: false },
                  { dest: '10.10.0.0/16',      gw: 'via 10.0.0.1',   iface: 'eth1', match: false },
                  { dest: '10.10.20.0/24',     gw: 'directly conn.', iface: 'eth2', match: true  },
                  { dest: '192.168.1.0/24',    gw: 'directly conn.', iface: 'eth0', match: false },
                  { dest: '0.0.0.0/0',         gw: 'via 192.168.1.254', iface: 'eth0', match: false },
                ].map(r => (
                  <div key={r.dest} className={`grid grid-cols-3 gap-4 p-1.5 rounded ${r.match ? 'bg-brand-500/15 border border-brand-500/30' : ''}`}>
                    <span className={r.match ? 'text-brand-300 font-bold' : 'text-slate-400'}>{r.dest}</span>
                    <span className={r.match ? 'text-brand-300' : 'text-slate-500'}>{r.gw}</span>
                    <span className={r.match ? 'text-brand-300' : 'text-slate-500'}>{r.iface}</span>
                  </div>
                ))}
                <div className="mt-3 text-[10px] text-slate-500">
                  Packet destined for <span className="text-accent-cyan">10.10.20.50</span> → matches
                  highlighted /24 (most specific) → forwarded out eth2
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Static Routes on Linux</h2>
        <CodeBlock title="Static route management with ip route" language="bash"
          code={CODE_NETWORKINGROUTING_1} />
      </section>

      <section>
        <h2>Dynamic Routing Overview</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            {
              proto: 'OSPF', full: 'Open Shortest Path First',
              color: 'border-brand-500/25 bg-brand-500/5', text: 'text-brand-300',
              type: 'Link-State (IGP)',
              metric: 'Cost (bandwidth-based)',
              use: 'Enterprise campus and data centre routing. Fast convergence. Scales to thousands of routers within an AS.',
            },
            {
              proto: 'BGP', full: 'Border Gateway Protocol',
              color: 'border-accent-amber/25 bg-accent-amber/5', text: 'text-accent-amber',
              type: 'Path-Vector (EGP)',
              metric: 'Policy-based attributes',
              use: 'The routing protocol of the internet. Used between Autonomous Systems (ISPs, large enterprises). Complex but extremely scalable.',
            },
            {
              proto: 'RIP', full: 'Routing Information Protocol',
              color: 'border-slate-600/25 bg-surface-800', text: 'text-slate-400',
              type: 'Distance-Vector (IGP)',
              metric: 'Hop count (max 15)',
              use: 'Legacy protocol. 15-hop limit makes it unsuitable for large networks. Occasionally seen in small/old environments.',
            },
          ].map(p => (
            <div key={p.proto} className={`card p-5 border ${p.color}`}>
              <div className="mb-2">
                <code className={`font-mono font-black text-lg ${p.text}`}>{p.proto}</code>
                <p className="text-[11px] text-slate-500 mt-0.5">{p.full}</p>
              </div>
              <div className="space-y-2 text-xs">
                <div><span className="text-slate-500">Type: </span><span className="text-slate-300">{p.type}</span></div>
                <div><span className="text-slate-500">Metric: </span><span className="text-slate-300">{p.metric}</span></div>
                <p className="text-slate-400 leading-relaxed mt-2">{p.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB NET-5</span>
            <span className="text-sm font-semibold text-white">Configure and Verify Static Routes on Ubuntu</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Inspect the current routing table and trace path to various destinations."
              command={CODE_NETWORKINGROUTING_2}
              output={CODE_NETWORKINGROUTING_3}
            />
            <LabStep number={2}
              description="Add a static route for a simulated remote network and verify it."
              command={CODE_NETWORKINGROUTING_4}
              output={CODE_NETWORKINGROUTING_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
