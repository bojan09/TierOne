import React from 'react'
import CodeBlock from '../../components/CodeBlock.jsx'

// ── Code snippet constants (extracted from JSX props) ──
const CODE_PYTHONNETWORKING_1 = `import socket
from concurrent.futures import ThreadPoolExecutor

COMMON_PORTS = {
    22: 'SSH', 80: 'HTTP', 443: 'HTTPS', 3389: 'RDP',
    445: 'SMB', 389: 'LDAP', 636: 'LDAPS', 53: 'DNS',
    25: 'SMTP', 5985: 'WinRM',
}

def check_port(host: str, port: int, timeout: float = 2.0) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False

def scan_host(host: str, ports=None) -> dict:
    ports = ports or list(COMMON_PORTS.keys())
    results = {'host': host, 'open': [], 'closed': []}
    for port in ports:
        if check_port(host, port):
            results['open'].append(f'{port}/{COMMON_PORTS.get(port, "?")}',)
        else:
            results['closed'].append(port)
    return results

# Scan multiple hosts in parallel
hosts = ['192.168.100.10', '192.168.100.20']
with ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(scan_host, hosts))

for r in results:
    print(f"  {r['host']}:  {', '.join(r['open']) or 'no common ports open'}")`
const CODE_PYTHONNETWORKING_2 = `import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ── Resilient session with retries ───────────────────────────
def make_session(retries=3, backoff=0.5) -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=retries,
        backoff_factor=backoff,
        status_forcelist=[500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

# ── Simple REST API calls ─────────────────────────────────────
session = make_session()

# GET request with error handling
try:
    resp = session.get('https://api.example.com/health', timeout=10)
    resp.raise_for_status()   # raises on 4xx/5xx
    data = resp.json()
    print(f'Status: {data["status"]}')
except requests.exceptions.ConnectionError:
    print('Cannot reach API server')
except requests.exceptions.HTTPError as e:
    print(f'HTTP error: {e.response.status_code}')
except requests.exceptions.Timeout:
    print('Request timed out')

# POST request (e.g. Slack webhook alert)
def send_slack(webhook_url: str, message: str) -> bool:
    try:
        resp = requests.post(webhook_url,
                            json={'text': message},
                            timeout=10)
        resp.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f'Slack alert failed: {e}')
        return False`
const CODE_PYTHONNETWORKING_3 = `import paramiko

def run_ssh_command(host: str, username: str, key_path: str,
                    command: str, timeout: int = 30) -> dict:
    """Run a command via SSH and return stdout, stderr, and exit code."""
    client = paramiko.SSHClient()
    # Production: use RejectPolicy + known_hosts file
    # Lab: AutoAddPolicy is acceptable
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            hostname=host,
            username=username,
            key_filename=key_path,
            timeout=10
        )
        stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
        exit_code = stdout.channel.recv_exit_status()
        return {
            'host':      host,
            'stdout':    stdout.read().decode().strip(),
            'stderr':    stderr.read().decode().strip(),
            'exit_code': exit_code,
            'success':   exit_code == 0,
        }
    except paramiko.AuthenticationException:
        return {'host': host, 'error': 'Authentication failed', 'success': False}
    except Exception as e:
        return {'host': host, 'error': str(e), 'success': False}
    finally:
        client.close()

# Run on multiple servers
SERVERS = ['192.168.100.20']
KEY = '/home/user/.ssh/id_ed25519_lab'

for server in SERVERS:
    result = run_ssh_command(server, 'user', KEY, 'df -h /')
    if result['success']:
        print(f'{server}: {result["stdout"].split(chr(10))[-1]}')
    else:
        print(f'{server}: ERROR — {result.get("error", result.get("stderr"))}')`
const CODE_PYTHONNETWORKING_4 = `pip install requests paramiko

python3 << 'EOF'
import socket

PORTS = {22:'SSH', 80:'HTTP', 443:'HTTPS', 389:'LDAP', 3389:'RDP', 5985:'WinRM'}
HOSTS = ['192.168.100.10', '192.168.100.20']

for host in HOSTS:
    open_ports = []
    for port, name in PORTS.items():
        try:
            with socket.create_connection((host, port), timeout=1):
                open_ports.append(f'{port}/{name}')
        except Exception:
            pass
    status = 'ONLINE' if open_ports else 'OFFLINE'
    print(f'{host} [{status}]: {chr(32).join(open_ports) or "no ports open"}')
EOF`
const CODE_PYTHONNETWORKING_5 = `192.168.100.10 [ONLINE]: 389/LDAP 3389/RDP 5985/WinRM
192.168.100.20 [ONLINE]: 22/SSH`



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

export default function PythonNetworking() {
  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Python's networking modules transform manual connectivity checks, REST API
          calls, and SSH commands into automated, repeatable scripts. This lesson
          covers the three most common networking tasks in sysadmin automation:
          port checking with sockets, HTTP API calls with requests, and SSH
          automation with paramiko.
        </p>
      </section>

      <section>
        <h2>Socket — TCP Port Testing</h2>
        <CodeBlock title="Port connectivity testing" language="bash"
          code={CODE_PYTHONNETWORKING_1} />
      </section>

      <section>
        <h2>requests — HTTP API Integration</h2>
        <CodeBlock title="HTTP requests for infrastructure APIs" language="bash"
          code={CODE_PYTHONNETWORKING_2} />
      </section>

      <section>
        <h2>paramiko — SSH Automation</h2>
        <CodeBlock title="SSH automation with paramiko" language="bash"
          code={CODE_PYTHONNETWORKING_3} />
      </section>

      <section>
        <h2>VMware Lab Exercise</h2>
        <div className="lab-block">
          <div className="lab-header">
            <span className="lab-badge">LAB PY-4</span>
            <span className="text-sm font-semibold text-white">Build a Lab Network Health Checker</span>
            <span className="ml-auto text-xs text-slate-500 font-mono">~20 min</span>
          </div>
          <div className="lab-body space-y-8">
            <LabStep number={1}
              description="Install required libraries and run a port scan of the lab."
              command={CODE_PYTHONNETWORKING_4}
              language="bash"
              output={CODE_PYTHONNETWORKING_5}
            />
          </div>
        </div>
      </section>

      
    </>
  )
}
