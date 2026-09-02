import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_CYBERSECURITYFIREWALL_1 = `# ── Initial secure setup ─────────────────────────────────────
sudo ufw default deny incoming      # Block everything in by default
sudo ufw default allow outgoing     # Allow all outbound (tighten later)
sudo ufw default deny forward       # Not a router

# ── Allow specific services ──────────────────────────────────
# SSH — restrict to management network only (best practice)
sudo ufw allow from 192.168.100.0/24 to any port 22 proto tcp

# Web server (open to internet)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow a range of ports
sudo ufw allow 8000:8100/tcp

# ── Enable and verify ────────────────────────────────────────
sudo ufw enable
sudo ufw status verbose
sudo ufw status numbered    # Numbered list for easy deletion

# ── Manage rules ─────────────────────────────────────────────
sudo ufw delete 3            # Delete rule number 3
sudo ufw delete allow 80     # Delete by rule specification
sudo ufw reload              # Reload after changes
sudo ufw reset               # Remove all rules (dangerous!)

# ── Logging ──────────────────────────────────────────────────
sudo ufw logging on          # Enable logging
sudo ufw logging high        # Log all packets (verbose)
tail -f /var/log/ufw.log     # Watch blocked attempts in real time`
const CODE_CYBERSECURITYFIREWALL_2 = `# ── View current rules ───────────────────────────────────────
sudo iptables -L -v -n --line-numbers    # Filter table
sudo iptables -t nat -L -v -n            # NAT table

# ── Basic rule management ────────────────────────────────────
# Allow SSH from specific subnet
sudo iptables -A INPUT -s 192.168.100.0/24 -p tcp --dport 22 -j ACCEPT

# Allow established/related connections (stateful — critical)
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Allow ICMP (ping) from internal only
sudo iptables -A INPUT -s 192.168.0.0/16 -p icmp -j ACCEPT

# DROP everything else at the end
sudo iptables -A INPUT -j DROP

# ── Save and restore ─────────────────────────────────────────
sudo iptables-save > /etc/iptables/rules.v4
sudo iptables-restore < /etc/iptables/rules.v4

# Persist across reboots:
sudo apt install iptables-persistent
sudo netfilter-persistent save`
const CODE_CYBERSECURITYFIREWALL_3 = `sudo ufw status verbose

# Apply hardened defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH from lab management subnet only
sudo ufw allow from 192.168.100.0/24 to any port 22 proto tcp comment 'SSH from lab'

sudo ufw --force enable
sudo ufw status numbered`
const CODE_CYBERSECURITYFIREWALL_4 = `Status: inactive

Status: active
     To                     Action    From
     --                     ------    ----
[ 1] 22/tcp                 ALLOW IN  192.168.100.0/24  # SSH from lab`
const CODE_CYBERSECURITYFIREWALL_5 = `# From Ubuntu VM — test SSH to localhost (should work from 192.168.100.x)
ssh -o ConnectTimeout=3 user@127.0.0.1 'echo connected'

# Check UFW log for blocked connection attempts
sudo ufw logging on
sudo tail -5 /var/log/ufw.log

# Show what iptables rules UFW created
sudo iptables -L INPUT -v -n | head -20`
const CODE_CYBERSECURITYFIREWALL_6 = `connected

Jan 15 11:00:00 srv01 kernel: [UFW BLOCK] IN=ens33 OUT=
  SRC=10.0.2.2 DST=192.168.100.20 PROTO=TCP DPT=22
  <- blocked connection attempt from outside the allowed subnet`



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

export default function CybersecurityFirewall() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          A firewall is your network's access control list. Without one, every service
          running on your server is reachable by anyone on the internet. With a correctly
          configured firewall, you expose only what is necessary, block everything else,
          and dramatically reduce your attack surface.
        </p>
        <Callout type="info" icon="🎯" title="Default-deny is the only sane policy">
          Never configure a firewall with default-allow (block known-bad). You cannot
          enumerate all attack patterns. Default-deny (allow only known-good) means
          that even attacks you've never seen before are blocked unless they happen
          to use a port you've explicitly opened.
        </Callout>
      </section>

      <section>
        <h2>UFW — Ubuntu's Firewall Interface</h2>
        <CodeBlock title="UFW configuration — production hardening" language="bash"
          code={CODE_CYBERSECURITYFIREWALL_1} />
      </section>

      <section>
        <h2>iptables — Direct Rule Management</h2>
        <CodeBlock title="iptables — understand what UFW does under the hood" language="bash"
          code={CODE_CYBERSECURITYFIREWALL_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB SEC-5</span>
            <span className="text-sm font-semibold text-white">Harden Ubuntu Server Firewall</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Check current firewall state and apply default-deny policy."
              command={CODE_CYBERSECURITYFIREWALL_3}
              output={CODE_CYBERSECURITYFIREWALL_4}
            />
            <LabStep number={2}
              description="Test the firewall is working — verify SSH still works from the lab, and blocked from outside."
              command={CODE_CYBERSECURITYFIREWALL_5}
              output={CODE_CYBERSECURITYFIREWALL_6}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
