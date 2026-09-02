import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_WS2025FILESERVICES_1 = `# Install File Services role
Install-WindowsFeature -Name FS-FileServer -IncludeManagementTools

# Create directory structure
New-Item -Path 'D:\\Shares\\Departments\\IT' -ItemType Directory -Force
New-Item -Path 'D:\\Shares\\Departments\\Finance' -ItemType Directory -Force
New-Item -Path 'D:\\Shares\\Departments\\HR' -ItemType Directory -Force

# Create SMB shares
New-SmbShare -Name 'IT$' -Path 'D:\\Shares\\Departments\\IT' \`\`
  -FullAccess 'Domain Admins' \`\`
  -ChangeAccess 'IT Staff' \`\`
  -Description 'IT Department Files'

# Set NTFS permissions (remove inherited, then set explicit)
$acl = Get-Acl 'D:\\Shares\\Departments\\IT'
$acl.SetAccessRuleProtection($true, $false)  # Disable inheritance

# Add permissions
$rule1 = New-Object System.Security.AccessControl.FileSystemAccessRule(
    'BUILTIN\\Administrators','FullControl','ContainerInherit,ObjectInherit','None','Allow')
$rule2 = New-Object System.Security.AccessControl.FileSystemAccessRule(
    'LAB\\IT Staff','Modify','ContainerInherit,ObjectInherit','None','Allow')

$acl.AddAccessRule($rule1)
$acl.AddAccessRule($rule2)
Set-Acl -Path 'D:\\Shares\\Departments\\IT' -AclObject $acl

# Verify
Get-SmbShare | Select-Object Name, Path, Description | Format-Table`
const CODE_WS2025FILESERVICES_2 = `# Enable shadow copies on D: drive
# GUI: Server Manager > File and Storage Services > Volumes > Shadow Copies

# PowerShell approach
$volume = 'D:'

# Create shadow copy NOW
(Get-WmiObject -Class Win32_ShadowCopy).Create($volume, 'ClientAccessible')

# List existing shadow copies
Get-WmiObject Win32_ShadowCopy | Select-Object ID, VolumeName, InstallDate |
  Format-Table

# Schedule automatic shadow copies (run as scheduled task)
# Recommended: 07:00 and 12:00 on weekdays
$taskParams = @{
    TaskName = 'Shadow Copy - D Drive'
    Action   = New-ScheduledTaskAction -Execute 'vssadmin' \`\`
                 -Argument 'create shadow /for=D:'
    Trigger  = @(
        $(New-ScheduledTaskTrigger -Daily -At '07:00'),
        $(New-ScheduledTaskTrigger -Daily -At '12:00')
    )
    Principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -RunLevel Highest
    Settings  = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
}
Register-ScheduledTask @taskParams | Out-Null
Write-Host 'Shadow copies scheduled: 07:00 and 12:00 daily'`
const CODE_WS2025FILESERVICES_3 = `# Install File Services
Install-WindowsFeature FS-FileServer, FS-DFS-Namespace -IncludeManagementTools

# Create directories
'IT','Finance','HR','All Staff' | ForEach-Object {
    New-Item -Path "C:\\Shares\\$_" -ItemType Directory -Force | Out-Null
    Write-Host "Created: C:\\Shares\\$_"
}

# Create the All Staff share with simple permissions
New-SmbShare -Name 'AllStaff' -Path 'C:\\Shares\\All Staff' \`\`
  -FullAccess 'Domain Admins' \`\`
  -ChangeAccess 'Domain Users' \`\`
  -Description 'Company-wide file share'

Write-Host 'File Server configured' -ForegroundColor Green`
const CODE_WS2025FILESERVICES_4 = `Created: C:\\Shares\\IT
Created: C:\\Shares\\Finance
Created: C:\\Shares\\HR
Created: C:\\Shares\\All Staff
File Server configured`
const CODE_WS2025FILESERVICES_5 = `# On Ubuntu VM
sudo apt install smbclient -y

# List shares on DC01
smbclient -L //192.168.100.10 -U 'LAB\\Administrator'

# Connect to the AllStaff share
smbclient //192.168.100.10/AllStaff -U 'LAB\\Administrator'
# Inside smbclient: ls, put testfile.txt, get testfile.txt, exit`
const CODE_WS2025FILESERVICES_6 = `Sharename   Type  Comment
---------   ----  -------
AllStaff    Disk  Company-wide file share
NETLOGON    Disk  Logon server share
SYSVOL      Disk  Logon server share
IPC$        IPC   Remote IPC`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info: 'callout-info', warning: 'callout-warning', success: 'callout-success' }
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

export default function WS2025FileServices() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          File Services is one of the most widely deployed Windows Server roles —
          virtually every organisation has file servers. Getting permissions, DFS, and
          shadow copies right from the start prevents the most common helpdesk headaches:
          users who can't access their files, accidentally deleted files with no recovery
          path, and disorganised share structures that take years to untangle.
        </p>
      </section>

      <section>
        <h2>Creating Shares with Correct Permissions</h2>
        <Callout type="info" icon="💡" title="Best practice permission model">
          Set Share permissions to "Everyone: Full Control" and use NTFS permissions for
          access control. This avoids the double-permission headache while giving you
          fine-grained NTFS control. Only use Share permissions to lock down access
          when NTFS is not available (e.g. old non-NTFS shares).
        </Callout>
        <CodeBlock title="Create and configure file shares" language="powershell"
          code={CODE_WS2025FILESERVICES_1} />
      </section>

      <section>
        <h2>Shadow Copies — Self-Service Recovery</h2>
        <CodeBlock title="Configure Volume Shadow Copies" language="powershell"
          code={CODE_WS2025FILESERVICES_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB WS-7</span>
            <span className="text-sm font-semibold text-white">Configure File Server and DFS on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~25 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Install the File Server role and create the department share structure."
              command={CODE_WS2025FILESERVICES_3}
              output={CODE_WS2025FILESERVICES_4}
            />
            <LabStep number={2}
              description="Test share access from the Ubuntu VM using smbclient."
              command={CODE_WS2025FILESERVICES_5}
              language="bash"
              output={CODE_WS2025FILESERVICES_6}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
