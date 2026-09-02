import React, { useState } from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_THREATMODELLING_1 = `# On DC01 — enumerate all listening ports and services
Get-NetTCPConnection -State Listen |
  Select-Object LocalPort, @{N='Process'; E={
    (Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name
  }} |
  Sort-Object LocalPort |
  Format-Table -AutoSize`
const CODE_THREATMODELLING_2 = `LocalPort  Process
---------  -------
53         dns
88         lsass        ← Kerberos
135        svchost      ← RPC
139        System       ← NetBIOS
389        lsass        ← LDAP
445        System       ← SMB
464        lsass        ← Kpasswd
636        lsass        ← LDAPS
3268       lsass        ← Global Catalogue
3389       svchost      ← RDP ← HIGH RISK if exposed externally
5985       svchost      ← WinRM`
const CODE_THREATMODELLING_3 = `# STRIDE analysis for RDP on a domain controller:
# S — Spoofing:       Attacker uses stolen credentials to authenticate as a legitimate admin
# T — Tampering:      Attacker redirects clipboard/drive contents through the RDP session
# R — Repudiation:    No RDP session logging enabled — admin activity untracked
# I — Information:    RDP transmits session data — interception if NLA is disabled
# D — DoS:            Flooding RDP port causes CPU spike, legitimate admins locked out
# E — Escalation:     Attacker authenticates as user, exploits local priv esc to get SYSTEM

# Check if Network Level Authentication (NLA) is enforced — partial Spoofing mitigation
Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp" |
  Select-Object UserAuthentication   # 1 = NLA required (good)`
const CODE_THREATMODELLING_4 = `UserAuthentication
------------------
1                  ← NLA enforced ✔`
const CODE_THREATMODELLING_5 = `# View current audit policy
auditpol /get /category:*

# Enable logon/logoff auditing (addresses Repudiation for authentication events)
auditpol /set /subcategory:"Logon"        /success:enable /failure:enable
auditpol /set /subcategory:"Account Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Account Management" /success:enable /failure:enable

# Verify events are being captured
Get-EventLog Security -Newest 5 | Select-Object EventID, Message | Format-List`
const CODE_THREATMODELLING_6 = `# Document DREAD scores for: Brute-force RDP attack on DC01
$threat = @{
  Name           = "RDP Brute Force on Domain Controller"
  Damage         = 10  # Full DC compromise = AD takeover
  Reproducibility = 8  # Automated tools readily available
  Exploitability  = 6  # Requires credential list + tool, moderate skill
  AffectedUsers   = 10  # All domain users impacted if DC falls
  Discoverability = 9   # Port 3389 shows up in any Shodan scan
}
$total = $threat.Damage + $threat.Reproducibility +
         $threat.Exploitability + $threat.AffectedUsers +
         $threat.Discoverability

Write-Host "Threat: $($threat.Name)"
Write-Host "DREAD Score: $total / 50 — $(if($total -gt 40){'CRITICAL'}elseif($total -gt 25){'HIGH'}else{'MEDIUM'})" -ForegroundColor $(if($total -gt 40){'Red'}elseif($total -gt 25){'Yellow'}else{'Green'})`
const CODE_THREATMODELLING_7 = `Threat: RDP Brute Force on Domain Controller
DREAD Score: 43 / 50 — CRITICAL`


function Callout({ type = 'info', icon, title, children }) {
  const s = { info: 'callout-info', warning: 'callout-warning', success: 'callout-success', danger: 'callout-danger' }
  return (
    <div className={`callout ${s[type]}`}>
      <span className="callout-icon">{icon}</span>
      <div className="callout-body">{title && <strong>{title} — </strong>}{children}</div>
    </div>
  )
}

// ─── Interactive STRIDE diagram ───────────────────────────────────────────────
const STRIDE_DATA = [
  {
    letter: 'S', threat: 'Spoofing',              color: 'bg-brand-500',        text: 'text-brand-200',
    property: 'Authentication',
    def: 'Impersonating another user, process, or system to gain unauthorised access.',
    example: 'Attacker forges a Kerberos ticket to authenticate as a domain admin.',
    controls: ['MFA', 'Strong passwords', 'Certificate-based auth', 'Kerberos armoring'],
  },
  {
    letter: 'T', threat: 'Tampering',             color: 'bg-accent-red',       text: 'text-red-200',
    property: 'Integrity',
    def: 'Unauthorised modification of data — in transit, at rest, or in memory.',
    example: 'Attacker modifies a PowerShell script before it runs, inserting a backdoor.',
    controls: ['Code signing', 'File integrity monitoring', 'TLS for transit', 'Hash verification'],
  },
  {
    letter: 'R', threat: 'Repudiation',           color: 'bg-accent-purple',    text: 'text-purple-200',
    property: 'Non-repudiation',
    def: 'Denying having performed an action due to lack of audit trail or logging.',
    example: 'Admin deletes AD accounts; no logging was enabled — they deny doing it.',
    controls: ['Windows Security Audit log', 'SIEM', 'Immutable log storage', 'Digital signatures'],
  },
  {
    letter: 'I', threat: 'Information Disclosure', color: 'bg-accent-cyan',     text: 'text-cyan-200',
    property: 'Confidentiality',
    def: 'Exposing data to parties who should not have access.',
    example: 'Unencrypted SQL backup left in a world-readable S3 bucket.',
    controls: ['Encryption at rest', 'TLS in transit', 'RBAC', 'Data classification'],
  },
  {
    letter: 'D', threat: 'Denial of Service',     color: 'bg-accent-amber',     text: 'text-amber-200',
    property: 'Availability',
    def: 'Disrupting or degrading the availability of a service to legitimate users.',
    example: 'DDoS attack floods the firewall, preventing staff from accessing the web app.',
    controls: ['Rate limiting', 'DDoS protection', 'Redundancy', 'Auto-scaling'],
  },
  {
    letter: 'E', threat: 'Elevation of Privilege', color: 'bg-accent-green',    text: 'text-green-200',
    property: 'Authorisation',
    def: 'Gaining higher access rights than authorised — e.g. user becoming domain admin.',
    example: 'Exploiting an unpatched local privilege escalation vulnerability (LPE) in Windows.',
    controls: ['Least privilege', 'UAC', 'Patch management', 'PAM solutions'],
  },
]

function StrideCard({ item, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border transition-all duration-200 overflow-hidden
                  ${selected ? 'border-brand-500/50' : 'border-surface-700 hover:border-slate-500'}`}
    >
      <div className={`flex items-center gap-3 p-4 ${selected ? 'bg-surface-700' : 'bg-surface-800'}`}>
        <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center
                         text-white font-black text-lg font-mono flex-shrink-0`}>
          {item.letter}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{item.threat}</p>
          <p className="text-[10px] text-slate-500">{item.property} violation</p>
        </div>
      </div>
      {selected && (
        <div className="px-4 pb-4 pt-3 bg-surface-800/60 space-y-3 border-t border-surface-700">
          <p className="text-xs text-slate-300 leading-relaxed">{item.def}</p>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Example</p>
            <p className="text-xs text-slate-400 italic leading-relaxed">{item.example}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Controls</p>
            <div className="flex flex-wrap gap-1.5">
              {item.controls.map(c => (
                <span key={c} className="tag text-[10px]">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </button>
  )
}

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

export default function ThreatModelling() {
  const [selectedStride, setSelectedStride] = useState(null)

  const toggle = (idx) => setSelectedStride(prev => prev === idx ? null : idx)

  return (
    <>
      {/* ── OVERVIEW ── */}
      <section>
        <h2>Overview</h2>
        <p>
          Threat modelling is structured thinking about how a system could be attacked —
          before the attacker does it. Rather than reactively patching after breaches,
          threat modelling helps you anticipate and prevent them. It's the difference
          between a sysadmin who reacts to incidents and one who prevents them.
        </p>
        <p className="mt-4">
          This lesson covers three frameworks used daily in security teams:
          <strong> STRIDE</strong> for categorising threats,
          <strong> MITRE ATT&CK</strong> for mapping real-world attacker behaviour, and
          <strong> DREAD</strong> for scoring and prioritising what to fix first.
        </p>
        <Callout type="info" icon="💡" title="Who does threat modelling">
          Not just security specialists. Every sysadmin deploying a server, a developer
          writing an API, and every team adding a new service should ask:
          "What could go wrong here? How would an attacker abuse this?"
        </Callout>
      </section>

      {/* ── STRIDE ── */}
      <section>
        <h2>STRIDE — The Threat Classification Framework</h2>
        <p>
          STRIDE is a mnemonic for six categories of security threats developed by Microsoft.
          For any component of a system, ask whether each STRIDE threat applies.
          Click each category to expand it.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
          {STRIDE_DATA.map((item, idx) => (
            <StrideCard
              key={item.letter}
              item={item}
              selected={selectedStride === idx}
              onClick={() => toggle(idx)}
            />
          ))}
        </div>
      </section>

      {/* ── MITRE ATT&CK ── */}
      <section>
        <h2>MITRE ATT&CK — Real Attacker Behaviour</h2>
        <p>
          MITRE ATT&CK (Adversarial Tactics, Techniques and Common Knowledge) is a
          globally-accessible knowledge base of adversary tactics and techniques based on
          real-world observations. It's used by threat intelligence teams, red teams,
          and defenders to understand and detect attacker behaviour.
        </p>

        <div className="info-card mt-5 overflow-hidden">
          <div className="p-4 border-b border-surface-700">
            <p className="text-sm font-semibold text-white mb-1">ATT&CK Structure</p>
            <p className="text-xs text-slate-400">Tactics → Techniques → Sub-techniques → Procedures</p>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {[
                { tactic: 'Reconnaissance',       id: 'TA0043', color: 'bg-brand-500/15',       techniques: ['T1595 Active Scanning', 'T1589 Gather Victim Identity'] },
                { tactic: 'Initial Access',        id: 'TA0001', color: 'bg-accent-red/15',      techniques: ['T1566 Phishing', 'T1190 Exploit Public App', 'T1133 External Remote Service'] },
                { tactic: 'Execution',             id: 'TA0002', color: 'bg-orange-500/15',      techniques: ['T1059 Command/Scripting', 'T1204 User Execution'] },
                { tactic: 'Persistence',           id: 'TA0003', color: 'bg-accent-amber/15',    techniques: ['T1547 Boot Autostart', 'T1053 Scheduled Task', 'T1098 Account Manipulation'] },
                { tactic: 'Privilege Escalation',  id: 'TA0004', color: 'bg-accent-green/15',    techniques: ['T1068 Exploit Vulnerability', 'T1055 Process Injection'] },
                { tactic: 'Lateral Movement',      id: 'TA0008', color: 'bg-accent-cyan/15',     techniques: ['T1021 Remote Services', 'T1550 Pass the Hash'] },
                { tactic: 'Exfiltration',          id: 'TA0010', color: 'bg-accent-purple/15',   techniques: ['T1048 Over Alt Protocol', 'T1041 Over C2 Channel'] },
              ].map(col => (
                <div key={col.tactic} className={`${col.color} border-r border-surface-700/50 last:border-0 p-3 min-w-[140px]`}>
                  <p className="text-[10px] font-bold text-white mb-1 leading-tight">{col.tactic}</p>
                  <p className="text-[9px] text-slate-400 font-mono mb-2">{col.id}</p>
                  <div className="space-y-1">
                    {col.techniques.map(t => (
                      <div key={t} className="text-[10px] text-slate-400 bg-surface-800/60
                                               rounded px-1.5 py-1 leading-tight">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3>MITRE ATT&CK in Practice</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          {[
            { icon: '🔴', role: 'Red Teams (Offence)', desc: 'Use ATT&CK to plan realistic attack simulations. Map planned attack steps to techniques to ensure comprehensive coverage of attack scenarios.' },
            { icon: '🔵', role: 'Blue Teams (Defence)', desc: 'Map detection rules, SIEM alerts, and endpoint sensors to techniques. Identify gaps — which ATT&CK techniques have no detection coverage?' },
            { icon: '📊', role: 'Threat Intelligence', desc: 'Map known threat actor groups (APT28, Lazarus) to their preferred techniques. Prioritise defences based on which techniques the groups targeting your industry use.' },
            { icon: '✅', role: 'Security Assessments', desc: 'Use ATT&CK to structure penetration testing scope. Document findings as ATT&CK technique references for consistent, comparable reporting.' },
          ].map(u => (
            <div key={u.role} className="info-card py-4 flex gap-3">
              <span className="text-xl flex-shrink-0">{u.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white mb-1">{u.role}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DREAD SCORING ── */}
      <section>
        <h2>DREAD — Prioritising Threats</h2>
        <p>
          Identifying threats is step one. Prioritising which to fix first is where
          DREAD helps. Score each identified threat 1–10 on five dimensions:
        </p>
        <div className="info-card overflow-hidden mt-4">
          <div className="divide-y divide-surface-700">
            {[
              { letter: 'D', dim: 'Damage potential',  q: 'How bad would it be if this succeeds?',            hi: 'Compromise of entire AD forest', lo: 'Read a non-sensitive config file' },
              { letter: 'R', dim: 'Reproducibility',   q: 'How reliably can the attack be repeated?',         hi: 'Always works, automated exploit', lo: 'Requires very specific race condition' },
              { letter: 'E', dim: 'Exploitability',    q: 'How much skill or effort does exploitation require?', hi: 'Metasploit module, no skill needed', lo: 'Requires kernel-level expertise' },
              { letter: 'A', dim: 'Affected users',    q: 'How many users are impacted?',                     hi: 'All users and systems', lo: 'Single internal test account' },
              { letter: 'D', dim: 'Discoverability',   q: 'How easy is it for an attacker to find this?',     hi: 'Listed in public Shodan results', lo: 'Requires internal code review' },
            ].map(r => (
              <div key={r.dim} className="grid grid-cols-12 gap-3 p-4 items-start">
                <div className="col-span-1">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30
                                   flex items-center justify-center font-mono font-black text-brand-300">
                    {r.letter}
                  </div>
                </div>
                <div className="col-span-11 sm:col-span-4">
                  <p className="text-sm font-semibold text-white">{r.dim}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{r.q}</p>
                </div>
                <div className="hidden sm:block col-span-3">
                  <p className="text-[10px] font-semibold text-accent-red uppercase tracking-widest mb-1">Score 10</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.hi}</p>
                </div>
                <div className="hidden sm:block col-span-4">
                  <p className="text-[10px] font-semibold text-accent-green uppercase tracking-widest mb-1">Score 1</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.lo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Callout type="info" icon="📐" title="DREAD in use">
          Total score = D + R + E + A + D (max 50). Scores above 40 are critical, 25–40
          are high, below 25 are medium/low. Use DREAD as a relative ranking tool —
          it's most valuable when comparing multiple threats to decide what to fix first.
        </Callout>
      </section>

      {/* ── VMware LAB ── */}
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB SEC-2</span>
            <span className="text-sm font-semibold text-white">Threat Model the Lab Environment</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Map your lab's attack surface — identify all exposed services on DC01."
              command={CODE_THREATMODELLING_1}
              output={CODE_THREATMODELLING_2}
            />
            <LabStep number={2}
              description="Apply STRIDE to RDP (port 3389) on DC01 — identify all applicable threats."
              language="powershell"
              command={CODE_THREATMODELLING_3}
              output={CODE_THREATMODELLING_4}
            />
            <LabStep number={3}
              description="Check Windows Security Audit policy — addressing the Repudiation threat."
              command={CODE_THREATMODELLING_5}
            />
            <LabStep number={4}
              description="Calculate a DREAD score for the RDP exposure threat on DC01."
              language="powershell"
              command={CODE_THREATMODELLING_6}
              output={CODE_THREATMODELLING_7}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
