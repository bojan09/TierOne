import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_CYBERSECURITYLINUXHARDENING_1 = `sudo apt install unattended-upgrades apt-listchanges -y

# Enable automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Configure what to auto-install
sudo tee /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "02:00";
EOF

# Enable the daily timer
sudo tee /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

# Test dry run
sudo unattended-upgrades --dry-run --debug 2>&1 | head -20`
const CODE_CYBERSECURITYLINUXHARDENING_2 = `sudo apt install auditd audispd-plugins -y
sudo systemctl enable auditd --now

# Add audit rules
sudo tee /etc/audit/rules.d/99-security.rules << 'EOF'
# Delete all existing rules
-D

# Monitor access to sensitive files
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group  -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/ssh/sshd_config -p wa -k sshd

# Monitor privilege escalation
-w /bin/su     -p x -k privilege_escalation
-w /usr/bin/sudo -p x -k privilege_escalation

# Monitor changes to audit config itself
-w /etc/audit/ -p wa -k audit_config
-w /etc/audit/audit.rules -p wa -k audit_config

# Log all commands run by root
-a exit,always -F arch=b64 -F euid=0 -S execve -k root_commands
EOF

sudo augenrules --load
sudo auditctl -l   # List active rules

# Search audit log
sudo ausearch -k identity --interpret | tail -5
sudo aureport --summary`
const CODE_CYBERSECURITYLINUXHARDENING_3 = `sudo apt install lynis -y
sudo lynis audit system --quiet 2>/dev/null
grep 'Hardening index' /var/log/lynis.log | tail -1`
const CODE_CYBERSECURITYLINUXHARDENING_4 = `# Kernel hardening
sudo tee /etc/sysctl.d/99-cis.conf << 'EOF'
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.all.rp_filter = 1
kernel.randomize_va_space = 2
kernel.dmesg_restrict = 1
fs.suid_dumpable = 0
EOF
sudo sysctl -p /etc/sysctl.d/99-cis.conf

# Auto-updates
sudo apt install -y unattended-upgrades
echo 'APT::Periodic::Unattended-Upgrade "1";' | sudo tee /etc/apt/apt.conf.d/20auto

# Auditd
sudo apt install -y auditd
sudo systemctl enable auditd --now
sudo auditctl -w /etc/passwd -p wa -k identity

# Re-audit
sudo lynis audit system --quiet 2>/dev/null
grep 'Hardening index' /var/log/lynis.log | tail -1`
const CODE_CYBERSECURITYLINUXHARDENING_5 = `net.ipv4.tcp_syncookies = 1
... applied

[+] Hardening index : 68 [#############       ]  ← +12 points`
const CODE_CYBERSECURITYLINUXHARDENING_6 = `# Trigger an auditable event
sudo cat /etc/shadow > /dev/null

# Search the audit log for it
sudo ausearch -k identity --interpret 2>/dev/null | grep -A3 'shadow'

# Check sudo usage log
sudo journalctl _COMM=sudo | tail -5`
const CODE_CYBERSECURITYLINUXHARDENING_7 = `time->Wed Jan 15 11:30:00 2025
type=PATH msg=audit(1705312200.123:456): item=0 name='/etc/shadow'
  ouid=0 ogid=0 rdev=0:0 nametype=NORMAL

Jan 15 11:30:00 srv01 sudo: user : TTY=pts/0 ; PWD=/home/user
  USER=root ; COMMAND=/bin/cat /etc/shadow`



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

export default function CybersecurityLinuxHardening() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Linux servers are the primary target of internet-facing attacks. A default
          Ubuntu installation is reasonably secure but leaves significant room for
          hardening. This lesson walks through the CIS Ubuntu Linux Benchmark Level 1
          controls — the industry-standard baseline used by security teams worldwide.
        </p>
        <Callout type="info" icon="🎯" title="This lesson vs the Linux Fundamentals hardening lesson">
          The Linux Fundamentals course covers hardening from a sysadmin perspective
          (keeping systems running). This lesson covers it from a security perspective —
          threat models, compliance frameworks, and defence-in-depth layering.
        </Callout>
      </section>

      <section>
        <h2>CIS Benchmark Controls — Priority Order</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="divide-y divide-surface-700">
            {[
              { area: 'Automatic Updates',      risk: 'Critical', control: 'unattended-upgrades', why: 'Closes the patch window — the #1 source of Linux compromises is unpatched CVEs' },
              { area: 'Filesystem Hardening',   risk: 'High',     control: '/tmp noexec nosuid nodev', why: 'Prevents execution of attacker-dropped binaries in world-writable directories' },
              { area: 'Kernel Parameters',      risk: 'High',     control: 'sysctl hardening', why: 'Prevents IP spoofing, SYN floods, ICMP redirect attacks, and information disclosure' },
              { area: 'Audit Logging',          risk: 'High',     control: 'auditd rules', why: 'Tamper-evident kernel-level audit trail for privileged actions and file access' },
              { area: 'Service Minimisation',   risk: 'Medium',   control: 'Remove unused packages', why: 'Every installed package is a potential attack surface — remove what you don\'t need' },
              { area: 'SSH Hardening',          risk: 'High',     control: 'sshd_config controls', why: 'SSH is the primary admin interface — its configuration directly impacts attack exposure' },
              { area: 'PAM Configuration',      risk: 'Medium',   control: 'Password quality, account lockout', why: 'Prevents brute-force and enforces credential standards' },
              { area: 'File Permissions',       risk: 'Medium',   control: 'World-writable file audit', why: 'World-writable files and SUID binaries are common privilege escalation vectors' },
            ].map(r => (
              <div key={r.area} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 items-start">
                <p className="font-semibold text-white text-sm">{r.area}</p>
                <span className={`tag text-[10px] w-fit ${r.risk === 'Critical' ? 'bg-accent-red/10 text-accent-red border-accent-red/20' : r.risk === 'High' ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20' : 'bg-brand-500/10 text-brand-300 border-brand-500/20'}`}>{r.risk}</span>
                <code className="font-mono text-xs text-slate-400">{r.control}</code>
                <p className="text-xs text-slate-500 leading-relaxed">{r.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2>Automatic Security Updates</h2>
        <CodeBlock title="Configure unattended-upgrades" language="bash"
          code={CODE_CYBERSECURITYLINUXHARDENING_1} />
      </section>

      <section>
        <h2>auditd — Kernel-Level Audit Trail</h2>
        <CodeBlock title="Install and configure auditd with security-focused rules" language="bash"
          code={CODE_CYBERSECURITYLINUXHARDENING_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB SEC-4</span>
            <span className="text-sm font-semibold text-white">Apply CIS Level 1 to Ubuntu Server</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~25 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Run a baseline audit to score the system before hardening."
              command={CODE_CYBERSECURITYLINUXHARDENING_3}
              output="[+] Hardening index : 56 [###########         ]"
            />
            <LabStep number={2}
              description="Apply sysctl hardening, automatic updates, and auditd."
              command={CODE_CYBERSECURITYLINUXHARDENING_4}
              output={CODE_CYBERSECURITYLINUXHARDENING_5}
            />
            <LabStep number={3}
              description="Audit privileged command usage with auditd."
              command={CODE_CYBERSECURITYLINUXHARDENING_6}
              output={CODE_CYBERSECURITYLINUXHARDENING_7}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
