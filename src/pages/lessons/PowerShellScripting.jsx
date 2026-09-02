import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_POWERSHELLSCRIPTING_1 = `<#
.SYNOPSIS
    Tests connectivity to a list of servers and reports status.

.DESCRIPTION
    Pings each server and optionally tests a specific TCP port.
    Returns structured objects suitable for Export-Csv or further pipeline processing.

.PARAMETER ComputerName
    One or more server names or IP addresses to test.

.PARAMETER Port
    Optional TCP port to test. If omitted, only ICMP ping is performed.

.EXAMPLE
    Test-ServerConnectivity -ComputerName DC01,SRV01

.EXAMPLE
    'DC01','SRV01','WEB01' | Test-ServerConnectivity -Port 443
#>
function Test-ServerConnectivity {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline, ValueFromPipelineByPropertyName)]
        [ValidateNotNullOrEmpty()]
        [string[]]$ComputerName,

        [Parameter()]
        [ValidateRange(1, 65535)]
        [int]$Port
    )

    process {
        foreach ($computer in $ComputerName) {
            Write-Verbose "Testing $computer..."

            $result = [PSCustomObject]@{
                ComputerName = $computer
                PingStatus   = 'Unknown'
                PortStatus   = 'NotTested'
                Timestamp    = Get-Date
            }

            # Test ICMP
            try {
                $ping = Test-Connection $computer -Count 1 -ErrorAction Stop
                $result.PingStatus = 'Online'
                Write-Verbose "  Ping OK: $($ping.Latency)ms"
            }
            catch {
                $result.PingStatus = 'Offline'
                Write-Warning "Cannot reach $computer: $($_.Exception.Message)"
            }

            # Test TCP port if requested
            if ($Port -and $result.PingStatus -eq 'Online') {
                $tcp = Test-NetConnection -ComputerName $computer -Port $Port -WarningAction SilentlyContinue
                $result.PortStatus = if ($tcp.TcpTestSucceeded) { "Open" } else { "Closed" }
            }

            # Emit to pipeline
            $result
        }
    }
}`
const CODE_POWERSHELLSCRIPTING_2 = `# Pattern 1: Catch specific error types
try {
    $user = Get-ADUser -Identity 'jsmith' -ErrorAction Stop
    Set-ADUser -Identity $user -Description 'Updated'
}
catch [Microsoft.ActiveDirectory.Management.ADIdentityNotFoundException] {
    Write-Warning "User jsmith not found in AD"
}
catch {
    # Catch-all for unexpected errors
    Write-Error "Unexpected error: $($_.Exception.Message)"
    Write-Error "Stack trace: $($_.ScriptStackTrace)"
}
finally {
    # Runs whether error occurred or not — good for cleanup
    Write-Verbose "Operation complete"
}

# Pattern 2: Retry logic for transient failures
function Invoke-WithRetry {
    param([scriptblock]$ScriptBlock, [int]$MaxAttempts = 3, [int]$DelaySeconds = 5)

    $attempt = 0
    do {
        $attempt++
        try {
            & $ScriptBlock
            return  # Success — exit
        }
        catch {
            if ($attempt -ge $MaxAttempts) { throw }
            Write-Warning "Attempt $attempt failed. Retrying in \${DelaySeconds}s..."
            Start-Sleep -Seconds $DelaySeconds
        }
    } while ($attempt -lt $MaxAttempts)
}`
const CODE_POWERSHELLSCRIPTING_3 = `# Module directory structure:
# C:\\Users\\Admin\\Documents\\PowerShell\\Modules\\ServerTools\\
#   ServerTools.psm1    <- module functions
#   ServerTools.psd1   <- module manifest (metadata)

# ── ServerTools.psm1 ─────────────────────────────────────────
function Get-ServerHealth {
    [CmdletBinding()]
    param([string]$ComputerName = $env:COMPUTERNAME)

    [PSCustomObject]@{
        ComputerName = $ComputerName
        CPU_Pct      = (Get-WmiObject Win32_Processor -ComputerName $ComputerName |
                           Measure-Object LoadPercentage -Average).Average
        FreeRAM_GB   = [math]::Round(
                           (Get-WmiObject Win32_OperatingSystem -ComputerName $ComputerName).FreePhysicalMemory / 1MB, 2)
        FreeDisk_GB  = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
    }
}

function Restart-ServiceSafely {
    [CmdletBinding(SupportsShouldProcess)]
    param([Parameter(Mandatory)][string]$Name)

    if ($PSCmdlet.ShouldProcess($Name, 'Restart service')) {
        Restart-Service -Name $Name -Force
        Write-Output "Service '$Name' restarted successfully"
    }
}

# Only export these functions (hide internal helpers)
Export-ModuleMember -Function Get-ServerHealth, Restart-ServiceSafely

# ── Create manifest ───────────────────────────────────────────
New-ModuleManifest -Path ServerTools.psd1 \\
  -RootModule 'ServerTools.psm1' \\
  -ModuleVersion '1.0.0' \\
  -Author 'SysAdmin' \\
  -Description 'Server health and management utilities' \\
  -FunctionsToExport 'Get-ServerHealth','Restart-ServiceSafely'

# ── Using the module ──────────────────────────────────────────
Import-Module ServerTools
Get-ServerHealth -ComputerName DC01
Restart-ServiceSafely -Name Spooler -WhatIf`
const CODE_POWERSHELLSCRIPTING_4 = `$modulePath = '$env:USERPROFILE\\Documents\\PowerShell\\Modules\\ServerAudit'
New-Item -Path $modulePath -ItemType Directory -Force
Write-Host "Module path: $modulePath"`
const CODE_POWERSHELLSCRIPTING_5 = `$moduleContent = @'
function Get-SystemSummary {
    [CmdletBinding()]
    param([string]$ComputerName = $env:COMPUTERNAME)
    $os  = Get-WmiObject Win32_OperatingSystem -ComputerName $ComputerName
    $cpu = Get-WmiObject Win32_Processor -ComputerName $ComputerName
    [PSCustomObject]@{
        Computer   = $ComputerName
        OS         = $os.Caption
        Uptime_hrs = [math]::Round(($os.ConvertToDateTime($os.LocalDateTime) -
                       $os.ConvertToDateTime($os.LastBootUpTime)).TotalHours, 1)
        CPU_Model  = $cpu.Name.Trim()
        RAM_GB     = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1)
        FreeRAM_GB = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
    }
}

function Get-FailedServices {
    [CmdletBinding()]
    param([string]$ComputerName = $env:COMPUTERNAME)
    Get-Service -ComputerName $ComputerName |
        Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped' } |
        Select-Object Name, DisplayName, Status, StartType
}

Export-ModuleMember -Function Get-SystemSummary, Get-FailedServices
'@

Set-Content -Path "$modulePath\\ServerAudit.psm1" -Value $moduleContent
Write-Host 'Module file written'`
const CODE_POWERSHELLSCRIPTING_6 = `Import-Module ServerAudit -Force

# Test Get-SystemSummary
Get-SystemSummary | Format-List

# Test Get-FailedServices
Get-FailedServices | Format-Table -AutoSize`
const CODE_POWERSHELLSCRIPTING_7 = `Computer   : DC01
OS         : Windows Server 2025 Standard Evaluation
Uptime_hrs : 4.2
CPU_Model  : Intel(R) Core(TM) i7-10700 CPU
RAM_GB     : 4
FreeRAM_GB : 1.82`
const CODE_POWERSHELLSCRIPTING_8 = `$servers = @('DC01')

$report = $servers | ForEach-Object {
    try {
        Get-SystemSummary -ComputerName $_ -ErrorAction Stop
    }
    catch {
        [PSCustomObject]@{ Computer=$_; OS='UNREACHABLE'; Error=$_.Exception.Message }
    }
}

$report | Export-Csv 'C:\\ServerAudit.csv' -NoTypeInformation
$report | Format-Table -AutoSize
Write-Host "Report saved to C:\\ServerAudit.csv"`



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

export default function PowerShellScripting() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Moving from interactive commands to reusable scripts and modules is the step that
          transforms a PowerShell user into a PowerShell developer. Production scripts need
          robust parameter handling, proper error management, and clear documentation — not
          just a list of commands that work on your machine.
        </p>
        <Callout type="info" icon="💡" title="The golden rule">
          Every script you write should be readable and runnable by someone who has never
          seen it before. Parameters over hard-coded values. Comment-based help over guesswork.
          -WhatIf over regret.
        </Callout>
      </section>

      <section>
        <h2>Advanced Functions — The Production Standard</h2>
        <p>
          The difference between a basic function and an advanced function is
          <code className="font-mono text-accent-cyan text-sm mx-1">[CmdletBinding()]</code>.
          This single attribute gives you the full cmdlet experience.
        </p>
        <CodeBlock title="Production-quality advanced function template" language="powershell"
          code={CODE_POWERSHELLSCRIPTING_1} />
      </section>

      <section>
        <h2>Error Handling Patterns</h2>
        <CodeBlock title="try/catch — the right way" language="powershell"
          code={CODE_POWERSHELLSCRIPTING_2} />
      </section>

      <section>
        <h2>Building a PowerShell Module</h2>
        <p>
          A module bundles related functions so you can
          <code className="font-mono text-accent-cyan text-sm mx-1">Import-Module ServerTools</code>
          and have all your utility functions available — in any script, any session.
        </p>
        <CodeBlock title="Module structure and creation" language="powershell"
          code={CODE_POWERSHELLSCRIPTING_3} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PS-3</span>
            <span className="text-sm font-semibold text-white">Build and Deploy a Server Audit Module</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~25 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Create the module directory structure on DC01."
              command={CODE_POWERSHELLSCRIPTING_4}
              output="Module path: C:\\Users\\Administrator\\Documents\\PowerShell\\Modules\\ServerAudit"
            />
            <LabStep number={2}
              description="Write the module file with three audit functions."
              command={CODE_POWERSHELLSCRIPTING_5}
              output="Module file written"
            />
            <LabStep number={3}
              description="Import and test the module."
              command={CODE_POWERSHELLSCRIPTING_6}
              output={CODE_POWERSHELLSCRIPTING_7}
            />
            <LabStep number={4}
              description="Run the full audit across multiple servers and export to CSV."
              command={CODE_POWERSHELLSCRIPTING_8}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
