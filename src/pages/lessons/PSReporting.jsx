import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_PSREPORTING_1 = `$css = @'
<style>
  body { font-family: Segoe UI, sans-serif; font-size: 13px; background: #f8f9fa; margin: 20px; }
  h1   { color: #1a237e; }
  h2   { color: #283593; margin-top: 30px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
  th   { background: #1a237e; color: white; padding: 8px 12px; text-align: left; }
  td   { padding: 7px 12px; border-bottom: 1px solid #dee2e6; }
  tr:nth-child(even) { background: #e8eaf6; }
  .warn { color: #e65100; font-weight: bold; }
  .ok   { color: #1b5e20; }
</style>
'@

# Collect data
$servers  = @('DC01')
$svcData  = Get-Service | Where-Object {$_.StartType -eq 'Automatic' -and $_.Status -ne 'Running'} |
              Select-Object Name, DisplayName, Status
$diskData = Get-PSDrive C | Select-Object Name,
              @{N='Free_GB'; E={[math]::Round($_.Free/1GB,1)}},
              @{N='Used_GB'; E={[math]::Round($_.Used/1GB,1)}}

# Build fragments
$svcTable  = $svcData  | ConvertTo-Html -Fragment -PreContent '<h2>Stopped Automatic Services</h2>'
$diskTable = $diskData | ConvertTo-Html -Fragment -PreContent '<h2>Disk Usage</h2>'

# Assemble report
$report = ConvertTo-Html \`\`
  -Head $css \`\`
  -Body "<h1>DC01 Daily Health Report — $(Get-Date -f 'dd MMM yyyy')</h1>$svcTable$diskTable"

$reportPath = 'C:\\Reports\\daily-health.html'
New-Item (Split-Path $reportPath) -ItemType Directory -Force | Out-Null
$report | Out-File $reportPath -Encoding utf8
Write-Host "Report saved: $reportPath" -ForegroundColor Green`
const CODE_PSREPORTING_2 = `$scriptPath = 'C:\\Scripts\\daily-report.ps1'

$action = New-ScheduledTaskAction \`\`
  -Execute 'powershell.exe' \`\`
  -Argument "-NonInteractive -NoProfile -ExecutionPolicy Bypass -File \`"$scriptPath\`""

$trigger = New-ScheduledTaskTrigger -Daily -At '06:00'

$settings = New-ScheduledTaskSettingsSet \`\`
  -ExecutionTimeLimit (New-TimeSpan -Hours 1) \`\`
  -RestartCount 2 \`\`
  -RestartInterval (New-TimeSpan -Minutes 5) \`\`
  -RunOnlyIfNetworkAvailable \`\`
  -StartWhenAvailable   # Run if missed

$principal = New-ScheduledTaskPrincipal \`\`
  -UserId 'SYSTEM' \`\`
  -LogonType ServiceAccount \`\`
  -RunLevel Highest

Register-ScheduledTask \`\`
  -TaskName 'Daily Health Report' \`\`
  -TaskPath '\\SysAdmin' \`\`
  -Action $action \`\`
  -Trigger $trigger \`\`
  -Settings $settings \`\`
  -Principal $principal \`\`
  -Description 'Generates daily server health HTML report' \`\`
  -Force

# Verify
Get-ScheduledTask -TaskPath '\\SysAdmin' | Format-Table TaskName, State`
const CODE_PSREPORTING_3 = `function Send-HtmlReport {
    param(
        [string]$To,
        [string]$Subject,
        [string]$BodyHtml,
        [string]$SmtpServer = 'smtp.lab.local',
        [string[]]$Attachments = @()
    )
    $msg = New-Object System.Net.Mail.MailMessage
    $msg.From       = 'reports@lab.local'
    $msg.To.Add($To)
    $msg.Subject    = $Subject
    $msg.Body       = $BodyHtml
    $msg.IsBodyHtml = $true

    foreach ($file in $Attachments) {
        if (Test-Path $file) {
            $msg.Attachments.Add((New-Object System.Net.Mail.Attachment($file)))
        }
    }

    $smtp = New-Object System.Net.Mail.SmtpClient($SmtpServer, 25)
    try {
        $smtp.Send($msg)
        Write-Host 'Report emailed successfully' -ForegroundColor Green
    }
    catch { Write-Warning "Email failed: $($_.Exception.Message)" }
    finally { $msg.Dispose() }
}

# Usage
Send-HtmlReport \`\`
  -To 'admin@lab.local' \`\`
  -Subject "DC01 Health Report — $(Get-Date -f 'dd MMM yyyy')" \`\`
  -BodyHtml (Get-Content C:\\Reports\\daily-health.html -Raw) \`\`
  -Attachments 'C:\\Reports\\daily-health.html'`
const CODE_PSREPORTING_4 = `# Quick HTML report
$services = Get-Service | Where-Object {$_.StartType -eq 'Automatic'} |
  Select-Object Name, Status | ConvertTo-Html -Fragment -Pre '<h2>Services</h2>'

$disks = Get-PSDrive -PSProvider FileSystem |
  Select-Object Name,
    @{N='Free_GB';  E={[math]::Round($_.Free/1GB, 1)}},
    @{N='Used_GB';  E={[math]::Round($_.Used/1GB, 1)}} |
  ConvertTo-Html -Fragment -Pre '<h2>Disk Usage</h2>'

$html = ConvertTo-Html -Body "<h1>DC01 Report — $(Get-Date -f 'dd MMM yyyy HH:mm')</h1>$services$disks"
New-Item C:\\Reports -ItemType Directory -Force | Out-Null
$html | Out-File C:\\Reports\\health.html -Encoding utf8
Write-Host 'Report created: C:\\Reports\\health.html' -ForegroundColor Green`
const CODE_PSREPORTING_5 = `# CSV export
Get-Service | Where-Object {$_.StartType -eq 'Automatic'} |
  Select-Object Name, DisplayName, Status, StartType |
  Export-Csv C:\\Reports\\services.csv -NoTypeInformation

Write-Host "Exported $(Import-Csv C:\\Reports\\services.csv | Measure-Object | Select-Object -Exp Count) services to CSV"`
const CODE_PSREPORTING_6 = `# Save the script first
Set-Content C:\\Scripts\\daily-report.ps1 -Value @'
Get-Service | Where-Object {$_.StartType -eq 'Automatic'} |
  Export-Csv C:\\Reports\\services-$(Get-Date -f yyyyMMdd).csv -NoTypeInformation
Write-Host 'Done'
'@

# Register scheduled task
Register-ScheduledTask \`\`
  -TaskName 'DailyHealthReport' \`\`
  -Action (New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-File C:\\Scripts\\daily-report.ps1') \`\`
  -Trigger (New-ScheduledTaskTrigger -Daily -At '06:00') \`\`
  -Principal (New-ScheduledTaskPrincipal -UserId SYSTEM -RunLevel Highest) \`\`
  -Force

Get-ScheduledTask -TaskName DailyHealthReport | Select-Object TaskName, State`
const CODE_PSREPORTING_7 = `TaskName           State
--------           -----
DailyHealthReport  Ready`



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

export default function PSReporting() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          The final step in automation is <em>visibility</em> — scheduled scripts that
          run silently and report results to stakeholders. This lesson covers building
          production HTML reports, exporting to CSV/JSON, scheduling with Task Scheduler,
          and email delivery — the full reporting pipeline.
        </p>
      </section>

      <section>
        <h2>HTML Reports with ConvertTo-Html</h2>
        <CodeBlock title="Professional HTML report generation" language="powershell"
          code={CODE_PSREPORTING_1} />
      </section>

      <section>
        <h2>Scheduling with Task Scheduler</h2>
        <CodeBlock title="Register a daily scheduled task" language="powershell"
          code={CODE_PSREPORTING_2} />
      </section>

      <section>
        <h2>Email Delivery</h2>
        <CodeBlock title="Send email with HTML report attached" language="powershell"
          code={CODE_PSREPORTING_3} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PS-8</span>
            <span className="text-sm font-semibold text-white">Generate and Schedule a Daily Health Report on DC01</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Generate a multi-section HTML report and save it to disk."
              command={CODE_PSREPORTING_4}
              output="Report created: C:\\Reports\\health.html"
            />
            <LabStep number={2}
              description="Export the same data to CSV for Excel consumption."
              command={CODE_PSREPORTING_5}
              output="Exported 67 services to CSV"
            />
            <LabStep number={3}
              description="Schedule the report to run daily at 06:00."
              command={CODE_PSREPORTING_6}
              output={CODE_PSREPORTING_7}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
