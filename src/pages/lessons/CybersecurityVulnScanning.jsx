import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_CYBERSECURITYVULNSCANNING_1 = `# ── Discovery ────────────────────────────────────────────────
# Find live hosts on the lab network
sudo nmap -sn 192.168.100.0/24

# ── Service scanning ─────────────────────────────────────────
# Top 1000 ports with version detection
sudo nmap -sV 192.168.100.10

# All ports + version + default scripts
sudo nmap -sV -sC -p- 192.168.100.10

# ── OS detection ─────────────────────────────────────────────
sudo nmap -O 192.168.100.10

# ── Vulnerability scripts ────────────────────────────────────
# Run vulnerability NSE scripts
sudo nmap --script vuln 192.168.100.10

# Check for specific vulnerabilities
sudo nmap --script smb-vuln-* 192.168.100.10
sudo nmap --script ssl-cert,ssl-enum-ciphers -p 443 192.168.100.10

# ── Output formats ───────────────────────────────────────────
sudo nmap -sV -oA scan-results 192.168.100.0/24
# Creates: scan-results.nmap (text), .xml (for parsers), .gnmap (grepable)`
const CODE_CYBERSECURITYVULNSCANNING_2 = `sudo apt install nmap -y

# Discover live hosts
sudo nmap -sn 192.168.100.0/24

# Quick scan of DC01
sudo nmap -sV --top-ports 20 192.168.100.10`
const CODE_CYBERSECURITYVULNSCANNING_3 = `Starting Nmap 7.94
Nmap scan report for 192.168.100.10
Host is up (0.00041s latency).

PORT     STATE SERVICE       VERSION
53/tcp   open  domain        (generic dns response: SERVFAIL)
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos
135/tcp  open  msrpc         Microsoft Windows RPC
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP
445/tcp  open  microsoft-ds  Windows Server 2025
3389/tcp open  ms-wbt-server Microsoft Terminal Services`
const CODE_CYBERSECURITYVULNSCANNING_4 = `# Check for SSL/TLS issues on any HTTPS services
sudo nmap --script ssl-cert,ssl-enum-ciphers -p 443 192.168.100.20 2>/dev/null

# Check SMB configuration
sudo nmap --script smb-security-mode -p 445 192.168.100.10

# Save results for review
sudo nmap -sV -oX /tmp/lab-scan.xml 192.168.100.0/24 2>/dev/null
echo 'Scan saved to /tmp/lab-scan.xml'`
const CODE_CYBERSECURITYVULNSCANNING_5 = `Host script results:
|  smb-security-mode:
|    account_used: guest
|    authentication_level: user
|    challenge_response: supported
|_   message_signing: required  <- good security posture

Scan saved to /tmp/lab-scan.xml`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info: 'callout-info', warning: 'callout-warning', success: 'callout-success', danger: 'callout-danger' }
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

export default function CybersecurityVulnScanning() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Vulnerability scanning is the systematic process of identifying security
          weaknesses before attackers do. A mature security programme scans continuously
          — new vulnerabilities are published daily, and any window between discovery
          and patching is an attack opportunity.
        </p>
        <Callout type="danger" icon="⚠️" title="Only scan systems you own or have permission to scan">
          Scanning systems without authorisation is illegal in most jurisdictions.
          Always get written permission, limit scans to your lab, and notify
          system owners before scanning production systems.
        </Callout>
      </section>

      <section>
        <h2>CVE & CVSS — The Vulnerability Language</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            {
              term: 'CVE', full: 'Common Vulnerabilities and Exposures',
              color: 'border-brand-500/25 bg-brand-500/5', text: 'text-brand-300',
              desc: 'A unique identifier for each publicly known vulnerability. Format: CVE-YEAR-NUMBER. Example: CVE-2021-44228 is Log4Shell.',
              use: 'Use CVE IDs when reporting vulnerabilities, tracking patches, and searching for exploits.',
            },
            {
              term: 'CVSS', full: 'Common Vulnerability Scoring System',
              color: 'border-accent-amber/25 bg-accent-amber/5', text: 'text-accent-amber',
              desc: 'A 0-10 severity score. Critical (9-10): remotely exploitable, no auth. High (7-8.9): significant impact. Medium (4-6.9): limited scope. Low (0-3.9): minimal impact.',
              use: 'Use CVSS as a starting point for prioritisation — combine with asset criticality and exposure.',
            },
          ].map(t => (
            <div key={t.term} className={`card p-5 border ${t.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <code className={`font-mono font-black text-lg ${t.text}`}>{t.term}</code>
                <span className="text-xs text-slate-500">{t.full}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">{t.desc}</p>
              <p className="text-xs text-slate-500 italic">{t.use}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>nmap — Network Reconnaissance</h2>
        <CodeBlock title="nmap scanning reference" language="bash"
          code={CODE_CYBERSECURITYVULNSCANNING_1} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB SEC-8</span>
            <span className="text-sm font-semibold text-white">Scan and Assess the Lab Network</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Install nmap and perform a network discovery scan."
              command={CODE_CYBERSECURITYVULNSCANNING_2}
              output={CODE_CYBERSECURITYVULNSCANNING_3}
            />
            <LabStep number={2}
              description="Run vulnerability scripts against the Ubuntu server and review findings."
              command={CODE_CYBERSECURITYVULNSCANNING_4}
              output={CODE_CYBERSECURITYVULNSCANNING_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
