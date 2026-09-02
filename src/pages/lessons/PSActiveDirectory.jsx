import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_PSACTIVEDIRECTORY_1 = `# ── Users ───────────────────────────────────────────────────
# Get a single user
Get-ADUser -Identity jsmith
Get-ADUser -Identity jsmith -Properties Department, Manager, LastLogonDate

# Filter users — server-side (fast)
Get-ADUser -Filter { Department -eq 'IT' } -Properties Department
Get-ADUser -Filter { Enabled -eq $false }
Get-ADUser -Filter { PasswordNeverExpires -eq $true } -Properties PasswordNeverExpires

# LDAP filter (for complex queries)
Get-ADUser -LDAPFilter '(department=IT)(title=*admin*)' -Properties Title

# All users in an OU
Get-ADUser -Filter * -SearchBase 'OU=Staff,DC=lab,DC=local'

# ── Groups ───────────────────────────────────────────────────
Get-ADGroup -Filter { GroupCategory -eq 'Security' }
Get-ADGroupMember -Identity 'Domain Admins' | Select-Object Name, SamAccountName
Get-ADPrincipalGroupMembership -Identity jsmith | Select-Object Name

# ── Computers ────────────────────────────────────────────────
Get-ADComputer -Filter * | Select-Object Name, OperatingSystem
Get-ADComputer -Filter { OperatingSystem -like '*Server*' }

# ── OUs ───────────────────────────────────────────────────────
Get-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName`
const CODE_PSACTIVEDIRECTORY_2 = `# Create a single user
New-ADUser \`
  -Name 'Alice Smith' \`
  -GivenName 'Alice' \`
  -Surname 'Smith' \`
  -SamAccountName 'asmith' \`
  -UserPrincipalName 'asmith@lab.local' \`
  -Path 'OU=Staff,DC=lab,DC=local' \`
  -AccountPassword (Read-Host 'Password' -AsSecureString) \`
  -ChangePasswordAtLogon $true \`
  -Enabled $true \`
  -Department 'IT' \`
  -Title 'SysAdmin'

# Modify user attributes
Set-ADUser -Identity asmith -Department 'Infrastructure' -Title 'Senior SysAdmin'
Set-ADUser -Identity asmith -Manager (Get-ADUser -Identity jdoe)

# Bulk update from a list
Get-ADUser -Filter { Department -eq 'OldDept' } |
  Set-ADUser -Department 'NewDept'

# Enable / disable / unlock
Disable-ADAccount -Identity asmith
Enable-ADAccount  -Identity asmith
Unlock-ADAccount  -Identity asmith

# Force password reset
Set-ADAccountPassword -Identity asmith \`
  -NewPassword (Read-Host 'New Password' -AsSecureString) \`
  -Reset
Set-ADUser -Identity asmith -ChangePasswordAtLogon $true`
const CODE_PSACTIVEDIRECTORY_3 = `# users.csv format:
# FirstName,LastName,Department,Title,OU
# Alice,Smith,IT,SysAdmin,OU=IT,DC=lab,DC=local
# Bob,Jones,Finance,Analyst,OU=Finance,DC=lab,DC=local

$defaultPassword = ConvertTo-SecureString 'Welcome1!' -AsPlainText -Force

Import-Csv 'C:\\users.csv' | ForEach-Object {
    $sam = ($_.FirstName[0] + $_.LastName).ToLower()
    $upn = "$sam@lab.local"

    try {
        New-ADUser \`
            -Name "$($_.FirstName) $($_.LastName)" \`
            -GivenName $_.FirstName \`
            -Surname $_.LastName \`
            -SamAccountName $sam \`
            -UserPrincipalName $upn \`
            -Path $_.OU \`
            -Department $_.Department \`
            -Title $_.Title \`
            -AccountPassword $defaultPassword \`
            -ChangePasswordAtLogon $true \`
            -Enabled $true \`
            -ErrorAction Stop
        Write-Host "Created: $sam" -ForegroundColor Green
    }
    catch {
        Write-Warning "Failed $sam\`: $($_.Exception.Message)"
    }
}`
const CODE_PSACTIVEDIRECTORY_4 = `# ── Stale accounts (no logon in 90 days) ─────────────────────
$cutoff = (Get-Date).AddDays(-90)
Get-ADUser -Filter { Enabled -eq $true -and LastLogonDate -lt $cutoff } \`
    -Properties LastLogonDate, Department |
    Select-Object Name, SamAccountName, Department, LastLogonDate |
    Sort-Object LastLogonDate |
    Export-Csv 'C:\\Reports\\StaleUsers.csv' -NoTypeInformation

# ── Password never expires ────────────────────────────────────
Get-ADUser -Filter { PasswordNeverExpires -eq $true -and Enabled -eq $true } \`
    -Properties PasswordNeverExpires, Department |
    Select-Object Name, SamAccountName, Department |
    Format-Table -AutoSize

# ── Domain Admins audit ───────────────────────────────────────
Get-ADGroupMember -Identity 'Domain Admins' -Recursive |
    Get-ADUser -Properties LastLogonDate, PasswordLastSet |
    Select-Object Name, SamAccountName, LastLogonDate, PasswordLastSet |
    Format-Table -AutoSize

# ── Accounts locked out right now ────────────────────────────
Search-ADAccount -LockedOut |
    Select-Object Name, SamAccountName, LockedOut |
    Format-Table -AutoSize

# ── Users whose passwords expire in < 7 days ─────────────────
Get-ADUser -Filter { Enabled -eq $true } \`
    -Properties PasswordExpired, PasswordLastSet, msDS-UserPasswordExpiryTimeComputed |
    Where-Object { $_.'msDS-UserPasswordExpiryTimeComputed' -ne 9223372036854775807 } |
    Select-Object Name,
        @{N='ExpiresOn';E={[datetime]::FromFileTime($_.'msDS-UserPasswordExpiryTimeComputed')}} |
    Where-Object { $_.ExpiresOn -lt (Get-Date).AddDays(7) -and $_.ExpiresOn -gt (Get-Date) } |
    Sort-Object ExpiresOn`
const CODE_PSACTIVEDIRECTORY_5 = `# Verify module
Get-Module -ListAvailable -Name ActiveDirectory |
  Select-Object Name, Version

# Domain summary
Get-ADDomain | Select-Object Name, NetBIOSName, DomainMode,
  PDCEmulator, RIDMaster

# Count objects
Write-Host "Users:    $((Get-ADUser -Filter *).Count)"
Write-Host "Groups:   $((Get-ADGroup -Filter *).Count)"
Write-Host "Computers:$((Get-ADComputer -Filter *).Count)"`
const CODE_PSACTIVEDIRECTORY_6 = `Name              Version
----              -------
ActiveDirectory   1.0.0.0

Name        : lab
NetBIOSName : LAB
DomainMode  : Windows2016Domain

Users:     6
Groups:    48
Computers: 1`
const CODE_PSACTIVEDIRECTORY_7 = `# Create OUs
New-ADOrganizationalUnit -Name 'LabUsers' -Path 'DC=lab,DC=local'
New-ADOrganizationalUnit -Name 'IT' -Path 'OU=LabUsers,DC=lab,DC=local'

# Create users
$pass = ConvertTo-SecureString 'Lab@2025!' -AsPlainText -Force
$users = @(
    @{First='Alice'; Last='Smith'; Dept='IT'; Title='SysAdmin'}
    @{First='Bob';   Last='Jones'; Dept='IT'; Title='Network Engineer'}
    @{First='Carol'; Last='White'; Dept='IT'; Title='Security Analyst'}
)

foreach ($u in $users) {
    $sam = ($u.First[0] + $u.Last).ToLower()
    New-ADUser -Name "$($u.First) $($u.Last)" \`\`
        -SamAccountName $sam -UserPrincipalName "$sam@lab.local" \`\`
        -Path 'OU=IT,OU=LabUsers,DC=lab,DC=local' \`\`
        -Department $u.Dept -Title $u.Title \`\`
        -AccountPassword $pass -Enabled $true
    Write-Host "+ Created $sam"
}`
const CODE_PSACTIVEDIRECTORY_8 = `+ Created asmith
+ Created bjones
+ Created cwhite`
const CODE_PSACTIVEDIRECTORY_9 = `# Find all users — check last logon
Get-ADUser -Filter * -Properties LastLogonDate, Department, Title |
  Select-Object Name, SamAccountName, Department, Title,
    @{N='LastLogon'; E={ if ($_.LastLogonDate) {$_.LastLogonDate} else {'Never'} }} |
  Sort-Object LastLogon |
  Format-Table -AutoSize

# Export full report
Get-ADUser -Filter * -Properties LastLogonDate, Department, Title, Enabled |
  Select-Object Name, SamAccountName, Enabled, Department, Title, LastLogonDate |
  Export-Csv 'C:\\ADReport.csv' -NoTypeInformation
Write-Host 'Report: C:\\ADReport.csv'`
const CODE_PSACTIVEDIRECTORY_10 = `Name          SamAccountName  Department  Title              LastLogon
----          --------------  ----------  -----              ---------
Alice Smith   asmith          IT          SysAdmin           Never
Bob Jones     bjones          IT          Network Engineer   Never
Carol White   cwhite          IT          Security Analyst   Never
Administrator Administrator                                  01/15/2025

Report: C:\\ADReport.csv`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info: 'callout-info', warning: 'callout-warning', success: 'callout-success', danger: 'callout-danger' }
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

export default function PSActiveDirectory() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          The ActiveDirectory PowerShell module is one of the most powerful tools in a
          Windows sysadmin's toolkit. Tasks that take hours clicking through ADUC — bulk
          user creation, group membership audits, stale account cleanup, password policy
          reporting — become 10-line scripts that run in seconds.
        </p>
        <Callout type="info" icon="💡" title="Run everything on DC01">
          All commands in this lesson should be run on DC01, which has the AD DS role
          and the ActiveDirectory module installed. From a remote machine you'd need RSAT.
        </Callout>
      </section>

      <section>
        <h2>Querying Active Directory</h2>
        <CodeBlock title="Get-ADUser, Get-ADGroup, Get-ADComputer" language="powershell"
          code={CODE_PSACTIVEDIRECTORY_1} />
      </section>

      <section>
        <h2>Creating & Managing Users</h2>
        <CodeBlock title="New-ADUser, Set-ADUser, Remove-ADUser" language="powershell"
          code={CODE_PSACTIVEDIRECTORY_2} />
      </section>

      <section>
        <h2>Bulk Operations from CSV</h2>
        <CodeBlock title="Bulk user creation from CSV file" language="powershell"
          code={CODE_PSACTIVEDIRECTORY_3} />
      </section>

      <section>
        <h2>Security Auditing Scripts</h2>
        <CodeBlock title="AD audit reports every sysadmin should run regularly" language="powershell"
          code={CODE_PSACTIVEDIRECTORY_4} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PS-4</span>
            <span className="text-sm font-semibold text-white">Build an AD User Management Script on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~25 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Confirm the AD module is available and explore your domain."
              command={CODE_PSACTIVEDIRECTORY_5}
              output={CODE_PSACTIVEDIRECTORY_6}
            />
            <LabStep number={2}
              description="Create a test OU and several users programmatically."
              command={CODE_PSACTIVEDIRECTORY_7}
              output={CODE_PSACTIVEDIRECTORY_8}
            />
            <LabStep number={3}
              description="Run the stale account audit and export the report."
              command={CODE_PSACTIVEDIRECTORY_9}
              output={CODE_PSACTIVEDIRECTORY_10}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
