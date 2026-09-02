import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_UNIXPERMISSIONS_1 = `# Octal notation: chmod ugo
chmod 755 script.sh   # rwxr-xr-x
chmod 644 file.txt    # rw-r--r--
chmod 600 key.pem     # rw-------
chmod 1777 /tmp       # sticky + world-writable
chmod 4755 program    # SUID + rwxr-xr-x
chmod 2775 /shared    # SGID + rwxrwxr-x

# POSIX ACLs
getfacl /project/data
setfacl -m u:alice:rwx /project/data
setfacl -m g:devteam:rx /project/data
setfacl -R -m u:bob:r-x /project/    # recursive
getfacl /project/data | setfacl --set-file=- /project/archive  # copy ACLs`
const CODE_UNIXPERMISSIONS_2 = `sudo apt install acl -y
mkdir -p ~/project-test

# Set base permissions
chmod 750 ~/project-test

# Add per-user ACLs
setfacl -m u:root:rwx ~/project-test
setfacl -m o::--- ~/project-test

getfacl ~/project-test`
const CODE_UNIXPERMISSIONS_3 = `# file: project-test
# owner: user
# group: user
user::rwx
user:root:rwx
group::r-x
mask::rwx
other::---`



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

export default function UnixPermissions() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>Unix permissions are the original access control model — defined by POSIX and implemented identically across Linux, macOS, FreeBSD, and all Unix systems. Understanding them deeply means you can work on any Unix-like system without re-learning permission concepts.</p>
      </section>
      <section>
        <h2>Permission Reference</h2>
        <CodeBlock title="Complete permission operations" language="bash"
          code={CODE_UNIXPERMISSIONS_1} />
      </section>
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header"><span className="lab-badge">LAB UNIX-4</span><span className="text-sm font-semibold text-white">POSIX ACL Practice on Ubuntu</span><span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span></div>
          <div className="lab-body space-y-8">
            <LabStep number={1} description="Create a shared project directory with per-user ACLs."
              command={CODE_UNIXPERMISSIONS_2}
              output={CODE_UNIXPERMISSIONS_3} />
          </div>
        </div>
      </section>
      
    </>
  )
}
