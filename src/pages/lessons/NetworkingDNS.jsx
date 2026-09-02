import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_NETWORKINGDNS_1 = `# ── Basic queries ────────────────────────────────────────────
dig dc01.lab.local              # A record (default)
dig dc01.lab.local A            # Explicit A record
dig lab.local MX                # Mail exchanger
dig lab.local NS                # Nameservers
dig lab.local SOA               # Zone authority record
dig lab.local TXT               # Text records (SPF, DKIM)

# ── Query a specific DNS server ──────────────────────────────
dig @192.168.100.10 dc01.lab.local    # Ask DC01's DNS
dig @8.8.8.8 google.com               # Ask Google directly

# ── Reverse DNS lookup ───────────────────────────────────────
dig -x 192.168.100.10                 # PTR record for IP

# ── SRV records (Active Directory discovery) ─────────────────
dig @192.168.100.10 _ldap._tcp.lab.local SRV
dig @192.168.100.10 _kerberos._tcp.lab.local SRV

# ── Useful flags ─────────────────────────────────────────────
dig dc01.lab.local +short          # IP only, no details
dig dc01.lab.local +noall +answer  # Answer section only
dig dc01.lab.local +trace          # Full resolution path
dig dc01.lab.local +dnssec         # Include DNSSEC records

# ── Equivalent Windows commands ──────────────────────────────
# Resolve-DnsName dc01.lab.local -Type A
# Resolve-DnsName 192.168.100.10  (reverse)`
const CODE_NETWORKINGDNS_2 = `# Install dig if needed
sudo apt install dnsutils -y

# Query DC01's DNS for the lab domain
dig @192.168.100.10 lab.local SOA +noall +answer
dig @192.168.100.10 lab.local NS  +short
dig @192.168.100.10 dc01.lab.local A +short

# Discover AD services via SRV records
dig @192.168.100.10 _ldap._tcp.lab.local SRV +short
dig @192.168.100.10 _kerberos._tcp.lab.local SRV +short`
const CODE_NETWORKINGDNS_3 = `lab.local. 3600 IN SOA dc01.lab.local. hostmaster.lab.local. 4 900 600 86400 3600

dc01.lab.local.

192.168.100.10

0 100 389 dc01.lab.local.
0 100 88 dc01.lab.local.`
const CODE_NETWORKINGDNS_4 = `# On DC01 — create additional DNS records
Add-DnsServerResourceRecordA -ZoneName 'lab.local' \`\`
  -Name 'webserver' -IPv4Address '192.168.100.30'

Add-DnsServerResourceRecordCName -ZoneName 'lab.local' \`\`
  -Name 'www' -HostNameAlias 'webserver.lab.local'

# Create PTR record
Add-DnsServerResourceRecordPtr -ZoneName '100.168.192.in-addr.arpa' \`\`
  -Name '30' -PtrDomainName 'webserver.lab.local'

# Verify from Ubuntu
# dig @192.168.100.10 www.lab.local CNAME +short
# dig @192.168.100.10 -x 192.168.100.30 +short`
const CODE_NETWORKINGDNS_5 = `# From Ubuntu after creating records:
webserver.lab.local.   <- CNAME target
webserver.lab.local.   <- PTR result`



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

export default function NetworkingDNS() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          DNS is the phonebook of the internet — and of your internal network. Without
          it, Active Directory breaks, email routing fails, and web browsing stops.
          A deep understanding of DNS lets you diagnose problems that appear to be
          network connectivity issues but are actually name resolution failures.
        </p>
        <Callout type="info" icon="💡" title="DNS is always the answer">
          A famous sysadmin saying: "It's always DNS." When something mysteriously
          breaks — check DNS first. Understand the resolution chain and you'll solve
          80% of connectivity problems in under 2 minutes.
        </Callout>
      </section>

      <section>
        <h2>DNS Record Types</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-700">
                <tr>
                  {['Type','Purpose','Example'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {[
                  { type:'A',      purpose:'Maps hostname → IPv4 address',                    example:'dc01.lab.local → 192.168.100.10' },
                  { type:'AAAA',   purpose:'Maps hostname → IPv6 address',                    example:'dc01.lab.local → 2001:db8::1' },
                  { type:'CNAME',  purpose:'Alias — points one name to another hostname',     example:'www.lab.local → webserver.lab.local' },
                  { type:'MX',     purpose:'Mail exchange — which server handles email',       example:'lab.local MX 10 mail.lab.local' },
                  { type:'PTR',    purpose:'Reverse DNS — maps IP → hostname',                 example:'10.100.168.192.in-addr.arpa → dc01' },
                  { type:'NS',     purpose:'Nameserver — which servers are authoritative',    example:'lab.local NS dc01.lab.local' },
                  { type:'SOA',    purpose:'Start of Authority — zone metadata',               example:'Primary NS, serial, refresh timers' },
                  { type:'TXT',    purpose:'Arbitrary text — used for SPF, DKIM, verification',example:'lab.local TXT "v=spf1 ip4:1.2.3.4 -all"' },
                  { type:'SRV',    purpose:'Service location — used by AD, VoIP, etc.',        example:'_ldap._tcp.lab.local SRV 0 100 389 dc01' },
                  { type:'CAA',    purpose:'Certificate Authority Authorisation — limits who can issue certs', example:'lab.local CAA 0 issue "letsencrypt.org"' },
                ].map(r => (
                  <tr key={r.type} className="hover:bg-surface-700/30">
                    <td className="px-3 py-2 font-mono font-bold text-brand-300">{r.type}</td>
                    <td className="px-3 py-2 text-slate-400">{r.purpose}</td>
                    <td className="px-3 py-2 text-slate-500 font-mono text-[10px]">{r.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2>dig — The DNS Diagnostic Tool</h2>
        <CodeBlock title="dig reference — query every record type" language="bash"
          code={CODE_NETWORKINGDNS_1} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB NET-6</span>
            <span className="text-sm font-semibold text-white">Inspect and Create DNS Records in the Lab</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Query all DNS record types for the lab domain from Ubuntu."
              command={CODE_NETWORKINGDNS_2}
              output={CODE_NETWORKINGDNS_3}
            />
            <LabStep number={2}
              description="Create DNS records on DC01 using PowerShell."
              language="powershell"
              command={CODE_NETWORKINGDNS_4}
              output={CODE_NETWORKINGDNS_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
