import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_UNIXBSD_1 = `# Bootstrap pkg if first run
pkg bootstrap

# Update package catalogue
pkg update

# Install packages
pkg install nginx python39 vim

# Upgrade all installed packages
pkg upgrade

# Search for packages
pkg search webserver

# Show package info
pkg info nginx

# List installed packages
pkg list

# Remove a package
pkg delete nginx

# Audit for known vulnerabilities
pkg audit -F`
const CODE_UNIXBSD_2 = `uname -a           # Linux kernel info
uname -s           # OS name: Linux (vs FreeBSD, Darwin)

# On Linux, check if any BSD tools are installed
which pkg 2>/dev/null || echo 'pkg not available (Linux system)'

# macOS/BSD users have 'sw_vers' for version info
# sw_vers          # on macOS only`



function LabStep({ number, description, command, language='bash', output }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 rounded-full bg-accent-amber/20 border border-accent-amber/30 text-accent-amber text-[11px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">{number}</span>
        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
      </div>
      {command && <div className="ml-9"><CodeBlock code={command} language={language} showCopy /></div>}
      {output && (<div className="ml-9 rounded-xl bg-surface-950 border border-surface-700 px-4 py-3 font-mono text-xs text-accent-green leading-6">{output.split('\n').map((l,i)=><div key={i}>{l}</div>)}</div>)}
    </div>
  )
}

export default function UnixBSD() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>BSD Unix systems power some of the world's most critical infrastructure: Netflix uses FreeBSD for CDN servers, Apple's macOS is BSD-derived, and OpenBSD is the security gold standard. Understanding BSD is essential context for any serious Unix/Linux professional.</p>
      </section>
      <section>
        <h2>BSD Comparison</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {[
            { name:'FreeBSD', icon:'🟠', tagline:'Performance & Features', color:'border-accent-amber/25 bg-accent-amber/5', text:'text-accent-amber', uses:['Netflix CDN','PlayStation OS','WhatsApp servers','High-performance networking','ZFS storage systems'] },
            { name:'OpenBSD', icon:'🔴', tagline:'Security First', color:'border-accent-red/25 bg-accent-red/5', text:'text-accent-red', uses:['Firewall/router platforms','Origin of OpenSSH','High-assurance systems','Security research','Embedded security devices'] },
            { name:'NetBSD', icon:'🔵', tagline:'Maximum Portability', color:'border-brand-500/25 bg-brand-500/5', text:'text-brand-300', uses:['Embedded systems','Exotic hardware (toasters!!)','Research platforms','Legacy hardware support','IoT devices'] },
          ].map(b=>(
            <div key={b.name} className={`card p-5 border ${b.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{b.icon}</span>
                <div><p className={`font-bold ${b.text}`}>{b.name}</p><p className="text-[11px] text-slate-500">{b.tagline}</p></div>
              </div>
              {b.uses.map(u=>(<div key={u} className="flex gap-2 text-xs text-slate-400 mb-1"><span className={`flex-shrink-0 ${b.text}`}>▸</span>{u}</div>))}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>FreeBSD Package Management</h2>
        <CodeBlock title="pkg — FreeBSD binary package manager" language="bash"
          code={CODE_UNIXBSD_1} />
      </section>
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header"><span className="lab-badge">LAB UNIX-3</span><span className="text-sm font-semibold text-white">Explore BSD Concepts on Ubuntu</span><span className="ml-auto text-xs text-slate-500 font-mono">~10 min</span></div>
          <div className="lab-body space-y-8">
            <LabStep number={1} description="Compare Linux and BSD uname output to understand system identification."
              command={CODE_UNIXBSD_2}
              output={"Linux srv01 5.15.0 #1 SMP x86_64 GNU/Linux\nLinux\npkg not available (Linux system)"} />
          </div>
        </div>
      </section>
      
    </>
  )
}
