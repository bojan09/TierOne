import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_PYTHONCLITOOL_1 = `#!/usr/bin/env python3
"""sysutil — SysAdmin utility CLI tool."""
import argparse, sys

def cmd_check(args):
    """sysutil check <host> [--port PORT] [--all]"""
    import socket
    ports = list(range(1, 1025)) if args.all else [args.port]
    for port in ports:
        try:
            with socket.create_connection((args.host, port), timeout=1):
                print(f'  {port}/tcp  OPEN')
        except Exception:
            if not args.all:
                print(f'  {port}/tcp  CLOSED')

def cmd_disk(args):
    """sysutil disk [--threshold PCT] [--json]"""
    import psutil, json
    results = []
    for part in psutil.disk_partitions():
        try:
            u = psutil.disk_usage(part.mountpoint)
            results.append({'mount': part.mountpoint,
                           'pct': u.percent, 'free_gb': round(u.free/1e9,1)})
        except PermissionError:
            pass
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        for r in results:
            warn = ' ⚠ HIGH' if r['pct'] >= args.threshold else ''
            print(f"  {r['mount']:20s} {r['pct']:5.1f}%  free:{r['free_gb']}GB{warn}")

def main():
    parser = argparse.ArgumentParser(
        prog='sysutil', description='SysAdmin utility CLI')
    parser.add_argument('--version', action='version', version='1.0.0')
    sub = parser.add_subparsers(dest='command', required=True)

    # 'check' subcommand
    p_check = sub.add_parser('check', help='Check host port connectivity')
    p_check.add_argument('host', help='Host to check')
    p_check.add_argument('--port', type=int, default=22)
    p_check.add_argument('--all', action='store_true', help='Scan top 1024 ports')
    p_check.set_defaults(func=cmd_check)

    # 'disk' subcommand
    p_disk = sub.add_parser('disk', help='Show disk usage')
    p_disk.add_argument('--threshold', type=int, default=80)
    p_disk.add_argument('--json', action='store_true')
    p_disk.set_defaults(func=cmd_disk)

    args = parser.parse_args()
    try:
        args.func(args)
    except KeyboardInterrupt:
        sys.exit(130)   # Standard exit code for Ctrl+C
    except Exception as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()`
const CODE_PYTHONCLITOOL_2 = `from rich.console import Console
from rich.table import Table
from rich.progress import track
from rich.panel import Panel

console = Console()

# ── Styled text ───────────────────────────────────────────────
console.print('[bold green]✓ Connection successful[/bold green]')
console.print('[bold red]✗ Service unreachable[/bold red]')
console.print(f'[yellow]WARNING:[/yellow] Disk at 87%')

# ── Tables ───────────────────────────────────────────────────
def show_server_table(servers: list):
    table = Table(title='Server Status')
    table.add_column('Server',  style='cyan',  no_wrap=True)
    table.add_column('Status',  justify='center')
    table.add_column('Disk %',  justify='right')
    table.add_column('CPU %',   justify='right')

    for s in servers:
        status = '[green]ONLINE[/]' if s['online'] else '[red]OFFLINE[/]'
        disk_color = 'red' if s['disk'] > 85 else 'yellow' if s['disk'] > 70 else 'green'
        table.add_row(
            s['name'], status,
            f'[{disk_color}]{s["disk"]}[/]',
            str(s['cpu'])
        )
    console.print(table)

# ── Progress bar ─────────────────────────────────────────────
servers = ['srv01', 'srv02', 'srv03']
for server in track(servers, description='Checking servers...'):
    import time; time.sleep(0.5)   # simulate work

# ── Panels ───────────────────────────────────────────────────
console.print(Panel(
    '[bold]3 servers checked[/bold]\\
2 online, 1 offline',
    title='[blue]Summary[/blue]',
    border_style='blue'
))`
const CODE_PYTHONCLITOOL_3 = `pip install rich psutil

# Create the tool
cat > ~/sysutil.py << 'PYEOF'
#!/usr/bin/env python3
import argparse, socket, sys, psutil
from rich.console import Console
from rich.table import Table

console = Console()

def cmd_check(args):
    PORTS = {22:'SSH',80:'HTTP',443:'HTTPS',389:'LDAP',3389:'RDP'}
    table = Table(title=f'Port Check: {args.host}')
    table.add_column('Port'); table.add_column('Service'); table.add_column('Status')
    for port, name in PORTS.items():
        try:
            with socket.create_connection((args.host, port), timeout=1):
                table.add_row(str(port), name, '[green]OPEN[/]')
        except Exception:
            table.add_row(str(port), name, '[red]CLOSED[/]')
    console.print(table)

def cmd_disk(args):
    table = Table(title='Disk Usage')
    table.add_column('Mount'); table.add_column('Used %'); table.add_column('Free GB')
    for p in psutil.disk_partitions():
        try:
            u = psutil.disk_usage(p.mountpoint)
            color = 'red' if u.percent > 85 else 'yellow' if u.percent > 70 else 'green'
            table.add_row(p.mountpoint, f'[{color}]{u.percent}[/]', str(round(u.free/1e9,1)))
        except: pass
    console.print(table)

parser = argparse.ArgumentParser(prog='sysutil')
sub = parser.add_subparsers(dest='cmd', required=True)
p = sub.add_parser('check'); p.add_argument('host'); p.set_defaults(func=cmd_check)
p = sub.add_parser('disk'); p.set_defaults(func=cmd_disk)
args = parser.parse_args()
args.func(args)
PYEOF
chmod +x ~/sysutil.py`
const CODE_PYTHONCLITOOL_4 = `python3 ~/sysutil.py disk

python3 ~/sysutil.py check 192.168.100.10

# Install globally
sudo cp ~/sysutil.py /usr/local/bin/sysutil
sysutil disk`
const CODE_PYTHONCLITOOL_5 = `      Disk Usage
 Mount    Used %   Free GB
 /        [green]15.3[/]     33.1

    Port Check: 192.168.100.10
 Port  Service  Status
 22    SSH      [red]CLOSED[/]
 389   LDAP     [green]OPEN[/]
 3389  RDP      [green]OPEN[/]`



function Callout({ type = 'info', icon, title, children }) {
  const s = { info: 'callout-info', warning: 'callout-warning', success: 'callout-success' }
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

export default function PythonCLITool() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          The best sysadmin tools are ones you build yourself — tailored exactly to
          your environment, your team's workflow, and your specific needs. This lesson
          walks through building a production-quality CLI tool from scratch: argument
          parsing, subcommands, rich output, proper error handling, and packaging.
        </p>
        <Callout type="info" icon="💡" title="Why build your own tools?">
          Commercial tools solve 80% of the problem. Your custom 20% — the scripts
          specific to your environment, your naming conventions, your workflows — is
          where Python CLI tools shine. Build them right, and they become the most-used
          tools in your team's arsenal.
        </Callout>
      </section>

      <section>
        <h2>argparse — Subcommands & Flags</h2>
        <CodeBlock title="Professional CLI structure with subcommands" language="bash"
          code={CODE_PYTHONCLITOOL_1} />
      </section>

      <section>
        <h2>Rich — Professional Terminal Output</h2>
        <CodeBlock title="Using Rich for polished CLI output" language="bash"
          code={CODE_PYTHONCLITOOL_2} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PY-9</span>
            <span className="text-sm font-semibold text-white">Build and Deploy sysutil to the Lab</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~25 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Install Rich and create the sysutil script."
              command={CODE_PYTHONCLITOOL_3}
            />
            <LabStep number={2}
              description="Run the tool and see the Rich output."
              command={CODE_PYTHONCLITOOL_4}
              output={CODE_PYTHONCLITOOL_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
