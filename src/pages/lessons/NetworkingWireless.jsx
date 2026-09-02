import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_NETWORKINGWIRELESS_1 = `# ── Scan for networks ────────────────────────────────────────
nmcli device wifi list
sudo iw dev wlan0 scan | grep -E 'SSID|signal|freq'

# ── Connect to a WPA2-Personal network ───────────────────────
nmcli device wifi connect 'OfficeWiFi' password 'SecurePass123'

# ── Connect to WPA2-Enterprise (802.1X EAP-PEAP) ────────────
nmcli connection add type wifi ssid 'CorpWiFi' \\
  wifi-sec.key-mgmt wpa-eap \\
  802-1x.eap peap \\
  802-1x.phase2-auth mschapv2 \\
  802-1x.identity 'jsmith@corp.com' \\
  802-1x.password 'DomainPass!'
nmcli connection up 'CorpWiFi'

# ── View signal strength and link quality ─────────────────────
iwconfig wlan0
watch -n 1 'cat /proc/net/wireless'

# ── Show connection details ───────────────────────────────────
nmcli connection show 'OfficeWiFi'
iw dev wlan0 link

# ── Disconnect ────────────────────────────────────────────────
nmcli device disconnect wlan0`
const CODE_NETWORKINGWIRELESS_2 = `# Check if wireless interfaces exist
ip link show | grep -E 'wlan|wifi'

# In VMware without a physical wireless adapter:
echo 'No wireless adapter in VM — using wired (ens33)'

# Check network manager status
nmcli general status

# List all connection profiles
nmcli connection show

# Show wireless capabilities of the system
lshw -class network 2>/dev/null | grep -A5 'Wireless\\|WiFi\\|802.11'`
const CODE_NETWORKINGWIRELESS_3 = `No wireless adapter in VM — using wired (ens33)

STATE      CONNECTIVITY  WIFI-HW   WIFI      WWAN-HW   WWAN
connected  full          enabled   enabled   enabled   enabled

NAME        UUID     TYPE      DEVICE
Lab-Network xxxxx    ethernet  ens33`
const CODE_NETWORKINGWIRELESS_4 = `# Show wpa_supplicant version
wpa_supplicant -v 2>&1 | head -2

# Show available EAP methods (for WPA-Enterprise)
wpa_supplicant -v 2>&1 | grep EAP | head -10

# Example wpa_supplicant.conf for WPA2-Enterprise
cat << 'EOF'
# /etc/wpa_supplicant/corp.conf
network={
    ssid="CorpWiFi"
    key_mgmt=WPA-EAP
    eap=PEAP
    identity="jsmith@corp.com"
    password="DomainPassword"
    phase2="auth=MSCHAPV2"
    ca_cert="/etc/ssl/certs/corp-ca.pem"
}
EOF`
const CODE_NETWORKINGWIRELESS_5 = `wpa_supplicant v2.10
EAP methods: EAP-TLS EAP-PEAP EAP-TTLS EAP-PWD EAP-SIM`



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

export default function NetworkingWireless() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Wireless networking is now the primary connectivity method for most end
          devices. Sysadmins need to understand Wi-Fi standards, security protocols,
          and common attack vectors — both to configure enterprise wireless properly
          and to troubleshoot the inevitable "Wi-Fi is slow" support tickets.
        </p>
        <Callout type="info" icon="📡" title="Wireless in the lab context">
          Our VMware lab uses wired connections — but understanding wireless is
          essential for real-world deployments. This lesson covers the concepts and
          tools you'll use when managing enterprise wireless infrastructure.
        </Callout>
      </section>

      <section>
        <h2>Wi-Fi Standards Evolution</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-700">
                <tr>{['Standard','Wi-Fi Name','Year','Max Speed','Bands','Key Feature'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {[
                  ['802.11n',  'Wi-Fi 4', '2009', '600 Mbps',   '2.4/5 GHz',    'MIMO antennas'],
                  ['802.11ac', 'Wi-Fi 5', '2013', '3.5 Gbps',   '5 GHz',         'MU-MIMO, beamforming'],
                  ['802.11ax', 'Wi-Fi 6', '2019', '9.6 Gbps',   '2.4/5 GHz',    'OFDMA, BSS Colouring, TWT — dense deployments'],
                  ['802.11ax', 'Wi-Fi 6E','2021', '9.6 Gbps',   '2.4/5/6 GHz',  '6 GHz band — no legacy interference'],
                  ['802.11be', 'Wi-Fi 7', '2024', '46 Gbps',    '2.4/5/6 GHz',  'Multi-Link Operation, 320 MHz channels'],
                ].map(r => (
                  <tr key={r[0]+r[1]} className="hover:bg-surface-700/30">
                    <td className="px-3 py-2 font-mono text-accent-cyan">{r[0]}</td>
                    <td className="px-3 py-2 font-bold text-white">{r[1]}</td>
                    <td className="px-3 py-2 text-slate-500">{r[2]}</td>
                    <td className="px-3 py-2 text-accent-green font-mono">{r[3]}</td>
                    <td className="px-3 py-2 text-slate-400">{r[4]}</td>
                    <td className="px-3 py-2 text-slate-400 text-[11px]">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2>Security Standards Comparison</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[
            {
              name: 'WPA2-Personal (PSK)',
              icon: '🏠',
              color: 'border-accent-amber/25 bg-accent-amber/5',
              text: 'text-accent-amber',
              use: 'Home / small office',
              how: 'Single pre-shared key for all users',
              pros: ['Simple setup — one password', 'No server infrastructure needed', 'Supported by all devices'],
              cons: ['Shared secret — one breach exposes all', 'No per-user identity or accountability', 'Password change requires updating all devices'],
            },
            {
              name: 'WPA2/3-Enterprise (802.1X)',
              icon: '🏢',
              color: 'border-brand-500/25 bg-brand-500/5',
              text: 'text-brand-300',
              use: 'Enterprise / regulated environments',
              how: 'Individual credentials via RADIUS server',
              pros: ['Per-user identity and audit trail', 'Revoke one user without changing password', 'Integrates with Active Directory'],
              cons: ['Requires RADIUS server infrastructure', 'More complex client configuration', 'Certificate management overhead'],
            },
          ].map(s => (
            <div key={s.name} className={`card p-5 border ${s.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className={`font-bold text-sm ${s.text}`}>{s.name}</p>
                  <span className="tag text-[10px]">{s.use}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3">{s.how}</p>
              <div className="space-y-1">
                {s.pros.map(p => <div key={p} className="flex gap-2 text-xs text-accent-green"><span>✓</span>{p}</div>)}
                {s.cons.map(c => <div key={c} className="flex gap-2 text-xs text-slate-500"><span>✗</span>{c}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Linux Wireless Management</h2>
        <CodeBlock title="nmcli and iw — wireless tools on Linux" language="bash"
          code={CODE_NETWORKINGWIRELESS_1} />
      </section>

      <section>
        <h2>Common Wireless Problems & Diagnosis</h2>
        <div className="space-y-3 mt-4">
          {[
            { symptom: 'Slow speeds despite good signal', checks: ['Check channel congestion: sudo iw dev wlan0 scan | grep -c DS', 'Verify band: is client on 2.4 GHz when 5 GHz is available?', 'Check for interference: other APs on same channel', 'Run: speedtest-cli and compare to wired'] },
            { symptom: 'Intermittent drops / disconnections', checks: ['Check signal strength: iwconfig wlan0 | grep Quality', 'Review /var/log/syslog for wpa_supplicant messages', 'Check for driver issues: dmesg | grep wlan', 'Verify DHCP lease time and renewal'] },
            { symptom: 'Cannot connect to WPA2-Enterprise', checks: ['Verify RADIUS server is reachable: Test-NetConnection radius-server -Port 1812', 'Check certificate trust: is the CA cert in the device trust store?', 'Review /var/log/auth.log on the RADIUS server', 'Try connecting with wpa_supplicant -d for debug output'] },
          ].map((p, i) => (
            <div key={i} className="rounded-xl border border-surface-700 overflow-hidden">
              <div className="px-4 py-3 bg-accent-amber/5 border-b border-surface-700">
                <p className="text-sm font-semibold text-white">⚠️ {p.symptom}</p>
              </div>
              <div className="px-4 py-3 space-y-1">
                {p.checks.map((c, j) => (
                  <p key={j} className="text-xs text-slate-400 font-mono">{j + 1}. {c}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB NET-8</span>
            <span className="text-sm font-semibold text-white">Wireless Concepts on Ubuntu</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Check wireless hardware and driver status on the Ubuntu VM."
              command={CODE_NETWORKINGWIRELESS_2}
              output={CODE_NETWORKINGWIRELESS_3}
            />
            <LabStep number={2}
              description="Explore wireless security configuration with wpa_supplicant (pre-installed)."
              command={CODE_NETWORKINGWIRELESS_4}
              output={CODE_NETWORKINGWIRELESS_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
