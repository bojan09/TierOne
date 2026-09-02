import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WINDOWSPERMISSIONS_1 = `# ── View accounts ────────────────────────────────────────────
Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordRequired
Get-LocalGroup | Select-Object Name, Description
Get-LocalGroupMember -Group 'Administrators'

# ── Create a standard user ───────────────────────────────────
$pass = Read-Host 'Password' -AsSecureString
New-LocalUser -Name 'alice' -FullName 'Alice Smith' \`\`
  -Password $pass -PasswordNeverExpires $false \`\`
  -AccountNeverExpires

# Add to a group
Add-LocalGroupMember -Group 'Users' -Member 'alice'

# ── Disable built-in Administrator (security hardening) ───────
Disable-LocalUser -Name 'Administrator'

# ── Check current user's groups and privileges ────────────────
whoami /groups
whoami /priv`
const CODE_WINDOWSPERMISSIONS_2 = `# ── View current permissions ─────────────────────────────────
icacls C:\\Data

# PowerShell equivalent
(Get-Acl C:\\Data).Access | Select-Object IdentityReference,
  FileSystemRights, AccessControlType | Format-Table -AutoSize

# ── Grant permissions ────────────────────────────────────────
# Grant Users Modify on folder + contents
icacls C:\\Data /grant 'BUILTIN\\Users:(OI)(CI)M'

# Grant a specific user Read-only
icacls C:\\Reports /grant 'alice:R'

# ── Remove permissions ───────────────────────────────────────
icacls C:\\Data /remove alice

# ── Reset to inherited permissions ───────────────────────────
icacls C:\\Data /reset /T

# ── Audit effective permissions ──────────────────────────────
# Who can access this file and how?
(Get-Acl C:\\Data\\report.xlsx).Access |
  Where-Object { $_.AccessControlType -eq 'Allow' } |
  Select-Object IdentityReference, FileSystemRights`
const CODE_WINDOWSPERMISSIONS_3 = `# Create a standard user
$pass = ConvertTo-SecureString 'Lab@2025!' -AsPlainText -Force
New-LocalUser -Name 'testuser' -Password $pass -FullName 'Test User'
Add-LocalGroupMember -Group 'Users' -Member 'testuser'

# Create a department folder
New-Item -Path 'C:\\Departments\\IT' -ItemType Directory -Force

# Grant IT staff Modify access
icacls 'C:\\Departments\\IT' /grant 'BUILTIN\\Users:(OI)(CI)M'

# Verify
icacls 'C:\\Departments\\IT'`
const CODE_WINDOWSPERMISSIONS_4 = `C:\\Departments\\IT BUILTIN\\Administrators:(OI)(CI)(F)
                  NT AUTHORITY\\SYSTEM:(OI)(CI)(F)
                  BUILTIN\\Users:(OI)(CI)(M)
Successfully processed 1 files`
const CODE_WINDOWSPERMISSIONS_5 = `# Check UAC configuration
Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' |
  Select-Object EnableLUA, ConsentPromptBehaviorAdmin, ConsentPromptBehaviorUser

# List local admins
Get-LocalGroupMember -Group Administrators |
  Select-Object Name, ObjectClass, PrincipalSource`
const CODE_WINDOWSPERMISSIONS_6 = `EnableLUA ConsentPromptBehaviorAdmin ConsentPromptBehaviorUser
--------- --------------------------- --------------------------
1         5                           3
# 1=UAC enabled, 5=prompt for creds, 3=prompt for standard

Name                   ObjectClass PrincipalSource
----                   ----------- ---------------
DC01\\Administrator     User        Local
LAB\\Domain Admins      Group       ActiveDirectory`


function Callout({ type = 'info', icon, title, children }) {
  const s = { info:'callout-info', warning:'callout-warning', success:'callout-success', danger:'callout-danger' }
  return (
    <div className={`callout ${s[type]}`}>
      <span className="callout-icon">{icon}</span>
      <div className="callout-body">{title && <strong>{title}</strong>}{children}</div>
    </div>
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

export default function WindowsPermissions() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Windows access control is built on a layered model: accounts → groups →
          ACLs → effective permissions. Understanding this model lets you grant exactly
          the right access, troubleshoot permission problems quickly, and avoid the
          common mistake of granting everyone full control "to fix" an access issue.
        </p>
      </section>

      <section>
        <h2>Local User & Group Management</h2>
        <CodeBlock title="Manage local accounts with PowerShell" language="powershell"
          code={CODE_WINDOWSPERMISSIONS_1} />
      </section>

      <section>
        <h2>NTFS Permissions</h2>
        <div className="info-card mt-4 overflow-hidden">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-1">
            Standard NTFS permission levels — what each grants
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-700">
                <tr>{['Level','Read','Write','Execute','Delete','Change Perms'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {[
                  ['Full Control', '✓','✓','✓','✓','✓'],
                  ['Modify',       '✓','✓','✓','✓','✗'],
                  ['Read & Execute','✓','✗','✓','✗','✗'],
                  ['Read',         '✓','✗','✗','✗','✗'],
                  ['Write',        '✗','✓','✗','✗','✗'],
                  ['List Folder',  '✓','✗','✗','✗','✗'],
                ].map(row => (
                  <tr key={row[0]} className="hover:bg-surface-700/30">
                    <td className="px-3 py-2 font-semibold text-white text-xs">{row[0]}</td>
                    {row.slice(1).map((v, i) => (
                      <td key={i} className={`px-3 py-2 text-center font-bold ${v === '✓' ? 'text-accent-green' : 'text-slate-400'}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <CodeBlock className="mt-4" title="View and set permissions with icacls and PowerShell" language="powershell"
          code={CODE_WINDOWSPERMISSIONS_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WIN-2</span>
            <span className="text-sm font-semibold text-white">Configure Users and Permissions on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~15 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Create test users and a department folder with correct permissions."
              command={CODE_WINDOWSPERMISSIONS_3}
              output={CODE_WINDOWSPERMISSIONS_4}
            />
            <LabStep number={2}
              description="Check effective permissions and UAC status."
              command={CODE_WINDOWSPERMISSIONS_5}
              output={CODE_WINDOWSPERMISSIONS_6}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
