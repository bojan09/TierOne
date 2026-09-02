import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_LINUXPACKAGES_1 = `# ── Package index ────────────────────────────────────────────
sudo apt update                    # Refresh package lists (always first)
sudo apt list --upgradable         # Show packages with updates available

# ── Install / remove ─────────────────────────────────────────
sudo apt install nginx             # Install a package
sudo apt install nginx=1.24.0-1    # Install specific version
sudo apt install -y nginx          # Non-interactive (no prompts)
sudo apt remove nginx              # Remove (keep config files)
sudo apt purge nginx               # Remove + delete config files
sudo apt autoremove                # Remove orphaned dependencies

# ── Upgrade ──────────────────────────────────────────────────
sudo apt upgrade                   # Upgrade installed packages
sudo apt full-upgrade              # Upgrade + remove obsolete packages
sudo apt dist-upgrade              # Handle dependency changes (use carefully)

# ── Search & info ────────────────────────────────────────────
apt search nginx                   # Search package names/descriptions
apt show nginx                     # Package details, version, deps
apt list --installed               # All installed packages
apt list --installed | grep nginx  # Check if specific package is installed

# ── Version pinning ──────────────────────────────────────────
sudo apt-mark hold nginx           # Prevent upgrades/removal
sudo apt-mark unhold nginx         # Release the hold
apt-mark showhold                  # List held packages

# ── Cache management ─────────────────────────────────────────
sudo apt clean                     # Remove downloaded .deb files
sudo apt autoclean                 # Remove outdated .deb files only`
const CODE_LINUXPACKAGES_2 = `# View configured repositories
cat /etc/apt/sources.list
ls /etc/apt/sources.list.d/

# Format of a sources.list entry:
# deb [arch=amd64] http://archive.ubuntu.com/ubuntu jammy main restricted universe
# |   |            |                               |     |    components
# |   options      repository URL                  |     suite (release name)
# type (deb=binary, deb-src=source)

# Add a PPA (Personal Package Archive)
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.3

# Add a third-party repo (e.g. Docker official)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update

# Remove a PPA
sudo add-apt-repository --remove ppa:ondrej/php`
const CODE_LINUXPACKAGES_3 = `# Install a .deb file directly
sudo dpkg -i package.deb
sudo apt install -f             # Fix broken deps after dpkg install

# Query installed packages
dpkg -l                         # List all installed packages
dpkg -l nginx                   # Is nginx installed?
dpkg -L nginx                   # Files installed by nginx
dpkg -S /usr/bin/nmap           # Which package owns this file?

# Package info
dpkg -p nginx                   # Show package info from apt cache
dpkg --print-architecture       # System architecture

# Fix broken packages
sudo dpkg --configure -a        # Configure any partially-installed packages
sudo apt install -f             # Fix dependency problems`
const CODE_LINUXPACKAGES_4 = `sudo apt update
apt list --upgradable 2>/dev/null | head -10

# Count upgradable packages
apt list --upgradable 2>/dev/null | grep -c upgradable`
const CODE_LINUXPACKAGES_5 = `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Reading package lists... Done
Building dependency tree... Done
3 packages can be upgraded.`
const CODE_LINUXPACKAGES_6 = `sudo apt install -y htop ncdu tree nmap net-tools

# Verify installed
dpkg -l htop ncdu tree | grep ^ii

# Find what package owns a binary
dpkg -S $(which nmap)`
const CODE_LINUXPACKAGES_7 = `ii  htop  3.2.2-1  amd64  interactive processes viewer
ii  ncdu  1.17-1   amd64  ncurses disk usage viewer
ii  tree  2.0.2-1  amd64  displays directory tree
nmap: /usr/bin/nmap`
const CODE_LINUXPACKAGES_8 = `# Pin nginx to current version (useful for production)
sudo apt install -y nginx
sudo apt-mark hold nginx

# Verify the hold
apt-mark showhold

# Try to upgrade — it will skip nginx
sudo apt upgrade --dry-run 2>&1 | grep -E 'hold|nginx'`
const CODE_LINUXPACKAGES_9 = `nginx
The following packages have been kept back:
  nginx`



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

export default function LinuxPackages() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Linux package managers solve the dependency problem — installing a single package
          can require dozens of libraries. Rather than manually tracking and installing
          each dependency, the package manager handles the full dependency tree automatically.
        </p>
        <p className="mt-4">
          This lesson focuses on <strong>apt</strong> (Debian/Ubuntu) and covers the
          dpkg layer beneath it. We also briefly compare with <strong>yum/dnf</strong>
          for RHEL/CentOS environments you'll encounter in enterprise.
        </p>
      </section>

      <section>
        <h2>APT — The Daily Driver</h2>
        <CodeBlock title="apt — complete reference" language="bash"
          code={CODE_LINUXPACKAGES_1} />
      </section>

      <section>
        <h2>Repositories & sources.list</h2>
        <CodeBlock title="Managing repositories" language="bash"
          code={CODE_LINUXPACKAGES_2} />
      </section>

      <section>
        <h2>dpkg — Under the Hood</h2>
        <CodeBlock title="dpkg — low-level package tool" language="bash"
          code={CODE_LINUXPACKAGES_3} />
      </section>

      <section>
        <h2>yum / dnf — RHEL, CentOS, Rocky Linux</h2>
        <div className="info-card mt-4 overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-surface-700">
            <div className="p-4">
              <p className="text-xs font-semibold text-accent-green uppercase tracking-widest mb-3">apt (Debian/Ubuntu)</p>
              <div className="space-y-1 font-mono text-xs text-slate-400">
                {['apt update','apt install pkg','apt remove pkg','apt search pkg','apt show pkg','apt upgrade','apt list --installed'].map(c => (
                  <div key={c} className="text-accent-green">{c}</div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-brand-300 uppercase tracking-widest mb-3">dnf (RHEL/CentOS/Rocky)</p>
              <div className="space-y-1 font-mono text-xs text-slate-400">
                {['dnf check-update','dnf install pkg','dnf remove pkg','dnf search pkg','dnf info pkg','dnf upgrade','dnf list installed'].map(c => (
                  <div key={c} className="text-brand-300">{c}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB LINUX-4</span>
            <span className="text-sm font-semibold text-white">Install and Manage Packages on Ubuntu Server</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Update the package index and check what needs upgrading."
              command={CODE_LINUXPACKAGES_4}
              output={CODE_LINUXPACKAGES_5}
            />
            <LabStep number={2}
              description="Install useful sysadmin tools and verify with dpkg."
              command={CODE_LINUXPACKAGES_6}
              output={CODE_LINUXPACKAGES_7}
            />
            <LabStep number={3}
              description="Pin a package version to prevent accidental upgrades."
              command={CODE_LINUXPACKAGES_8}
              output={CODE_LINUXPACKAGES_9}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
