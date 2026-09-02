import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_CYBERSECURITYADSECURITY_1 = `# Find accounts with SPNs (potential Kerberoasting targets)
Get-ADUser -Filter {ServicePrincipalName -like '*'} \`\`
  -Properties ServicePrincipalName, PasswordLastSet, PasswordNeverExpires |
  Select-Object Name, SamAccountName, PasswordLastSet, PasswordNeverExpires,
    ServicePrincipalName |
  Format-Table -AutoSize

# HIGH RISK: SPNs on accounts with PasswordNeverExpires=True
# These are the weakest Kerberoasting targets
Get-ADUser -Filter {ServicePrincipalName -like '*' -and PasswordNeverExpires -eq $true} \`\`
  -Properties ServicePrincipalName, PasswordLastSet

# Monitor for Kerberoasting: Event ID 4769 with ticket encryption type 0x17 (RC4)
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4769} -MaxEvents 50 |
  Where-Object { $_.Properties[8].Value -eq '0x17' } |
  Select-Object TimeCreated,
    @{N='Account'; E={$_.Properties[0].Value}},
    @{N='Service'; E={$_.Properties[2].Value}}`
const CODE_CYBERSECURITYADSECURITY_2 = `# Protected Users group prevents:
# - NTLM authentication (forces Kerberos)
# - DES/RC4 Kerberos encryption (forces AES)
# - Credential caching on workstations
# - Kerberos delegation

# Add a user to Protected Users
Add-ADGroupMember -Identity 'Protected Users' -Members 'Administrator'

# See current members
Get-ADGroupMember -Identity 'Protected Users' | Select-Object Name

# WARNING: Test before applying to service accounts
# Protected Users breaks NTLM-dependent services`
const CODE_CYBERSECURITYADSECURITY_3 = `# Check for Kerberoastable accounts
$kerberoastable = Get-ADUser -Filter {ServicePrincipalName -like '*'} \`\`
  -Properties ServicePrincipalName, PasswordNeverExpires

Write-Host "Kerberoastable accounts: $($kerberoastable.Count)"
$kerberoastable | Select-Object Name, PasswordNeverExpires | Format-Table

# Check Domain Admins
Write-Host "\`n=== Domain Admins ==="
Get-ADGroupMember 'Domain Admins' -Recursive |
  Get-ADUser -Properties LastLogonDate |
  Select-Object Name, SamAccountName, LastLogonDate | Format-Table

# Check for stale admin accounts (no logon in 90 days)
$cutoff = (Get-Date).AddDays(-90)
Get-ADGroupMember 'Domain Admins' |
  Get-ADUser -Properties LastLogonDate |
  Where-Object { $_.LastLogonDate -lt $cutoff -or -not $_.LastLogonDate } |
  Select-Object Name, LastLogonDate`
const CODE_CYBERSECURITYADSECURITY_4 = `Kerberoastable accounts: 0  <- good, no SPNs on user accounts

=== Domain Admins ===
Name           SamAccountName  LastLogonDate
Administrator  Administrator   01/15/2025`



function LabStep({ number, description, command, language='powershell', output }) {
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

export default function CybersecurityADSecurity() {
  return (
    <>
      <section><h2>Overview</h2><p>Active Directory is the highest-value target in a Windows enterprise environment. Compromising it means game over — every user, every server, every resource is accessible. This lesson covers the attack techniques defenders must understand to protect AD effectively.</p></section>
      <section>
        <h2>Kerberoasting Detection & Prevention</h2>
        <CodeBlock title="Find Kerberoastable service accounts" language="powershell"
          code={CODE_CYBERSECURITYADSECURITY_1} />
      </section>
      <section>
        <h2>Protected Users Security Group</h2>
        <CodeBlock title="Add privileged accounts to Protected Users" language="powershell"
          code={CODE_CYBERSECURITYADSECURITY_2} />
      </section>
      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header"><span className="lab-badge">LAB SEC-10</span><span className="text-sm font-semibold text-white">AD Security Audit on DC01</span><span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span></div>
          <div className="lab-body space-y-8">
            <LabStep number={1} description="Run a comprehensive AD security audit."
              command={CODE_CYBERSECURITYADSECURITY_3}
              output={CODE_CYBERSECURITYADSECURITY_4} />
          </div>
        </div>
      </section>
      
    </>
  )
}
