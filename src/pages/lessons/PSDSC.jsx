import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_PSDSC_1 = `# A configuration is a special function decorated with 'Configuration'
Configuration WebServerBaseline {
    param([string[]]$ComputerName = 'localhost')

    # Import required DSC resource modules
    Import-DscResource -ModuleName PSDesiredStateConfiguration

    Node $ComputerName {

        # Ensure IIS Web Server role is installed
        WindowsFeature IIS {
            Ensure = 'Present'
            Name   = 'Web-Server'
        }

        # Ensure IIS Management Tools are installed
        WindowsFeature IISMgmt {
            Ensure    = 'Present'
            Name      = 'Web-Mgmt-Tools'
            DependsOn = '[WindowsFeature]IIS'
        }

        # Ensure W3SVC service is running and starts automatically
        Service W3SVC {
            Name        = 'W3SVC'
            State       = 'Running'
            StartupType = 'Automatic'
            DependsOn   = '[WindowsFeature]IIS'
        }

        # Ensure default site has correct permissions
        File DefaultSitePath {
            DestinationPath = 'C:\\inetpub\\wwwroot'
            Type            = 'Directory'
            Ensure          = 'Present'
        }

        # Registry: disable directory browsing
        Registry DisableDirBrowse {
            Key       = 'HKLM:\\SOFTWARE\\Policies\\IIS'
            ValueName = 'DirectoryBrowsing'
            ValueData = '0'
            ValueType = 'DWord'
            Ensure    = 'Present'
        }
    }
}

# Compile to .mof file
WebServerBaseline -ComputerName 'WEB01'
# Creates: .\\WebServerBaseline\\WEB01.mof

# Apply the configuration
Start-DscConfiguration -Path .\\WebServerBaseline -Wait -Verbose -Force`
const CODE_PSDSC_2 = `[DSCLocalConfigurationManager()]
Configuration LCMConfig {
    Node 'localhost' {
        Settings {
            # ApplyOnly      — apply once, no monitoring
            # ApplyAndMonitor — apply + report drift (no auto-correct)
            # ApplyAndAutoCorrect — apply + auto-correct drift (recommended)
            ConfigurationMode              = 'ApplyAndAutoCorrect'
            RefreshFrequencyMins           = 30    # Check every 30 min
            ConfigurationModeFrequencyMins = 15    # Correct drift every 15 min
            RebootNodeIfNeeded             = $false
            AllowModuleOverwrite           = $true
        }
    }
}

# Compile and apply LCM settings
LCMConfig
Set-DscLocalConfigurationManager -Path .\\LCMConfig -Verbose

# Verify LCM settings
Get-DscLocalConfigurationManager | Select-Object ConfigurationMode,
  RefreshFrequencyMins, RebootNodeIfNeeded, LCMState`
const CODE_PSDSC_3 = `Configuration LabBaseline {
    Import-DscResource -ModuleName PSDesiredStateConfiguration

    Node 'localhost' {
        Service WinRM {
            Name        = 'WinRM'
            State       = 'Running'
            StartupType = 'Automatic'
        }
        Service DNS {
            Name        = 'DNS'
            State       = 'Running'
            StartupType = 'Automatic'
        }
    }
}

# Compile — creates ./LabBaseline/localhost.mof
LabBaseline
Write-Host 'Compiled:' (Get-ChildItem .\\LabBaseline\\*.mof | Select-Object -Exp Name)`
const CODE_PSDSC_4 = `# Apply
Start-DscConfiguration -Path .\\LabBaseline -Wait -Force -Verbose 2>&1 | Select-String 'resource|success'

# Test compliance
$result = Test-DscConfiguration -Detailed
Write-Host "In desired state: $($result.InDesiredState)"
$result.ResourcesInDesiredState | Select-Object ResourceId, InDesiredState`
const CODE_PSDSC_5 = `In desired state: True

ResourceId              InDesiredState
----------              --------------
[Service]WinRM          True
[Service]DNS            True`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info:'callout-info', warning:'callout-warning', success:'callout-success' }
  return (
    <div className={`callout ${s[type]}`}>
      <span className="callout-icon">{icon}</span>
      <div className="callout-body">{title && <strong>{title}</strong>}{children}</div>
    </div>
  )
}

function LabStep({ number, description, command, language='powershell', output }) {
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
          {output.split('\n').map((l,i)=><div key={i}>{l}</div>)}
        </div>
      )}
    </div>
  )
}

export default function PSDSC() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          DSC is PowerShell's answer to Ansible and Chef for Windows. Instead of writing
          a script full of imperative commands, you declare what the system <em>should
          look like</em> and let DSC figure out how to get there — and how to keep it
          there. This is the foundation of Infrastructure as Code on Windows.
        </p>
        <Callout type="info" icon="💡" title="DSC vs Ansible for Windows">
          DSC is built into Windows and requires no agent installation. Ansible can also
          configure Windows (via WinRM) and is often preferred for mixed Linux/Windows
          environments. For Windows-only shops, DSC + WinRM is a natural choice.
        </Callout>
      </section>

      <section>
        <h2>Writing Your First DSC Configuration</h2>
        <CodeBlock title="DSC configuration — web server baseline" language="powershell"
          code={CODE_PSDSC_1} />
      </section>

      <section>
        <h2>LCM Configuration</h2>
        <CodeBlock title="Configure the Local Configuration Manager" language="powershell"
          code={CODE_PSDSC_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PS-7</span>
            <span className="text-sm font-semibold text-white">Apply a DSC Configuration to DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Write and compile a simple DSC configuration ensuring key services are running."
              command={CODE_PSDSC_3}
              output="Compiled: localhost.mof"
            />
            <LabStep number={2}
              description="Apply the configuration and verify compliance."
              command={CODE_PSDSC_4}
              output={CODE_PSDSC_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
