import type { Course, Lesson, LockRule, Module } from '@/shared/types';

// AUTO-GENERATED (P5.5) from migrated legacy lessons. Bodies are the former
// legacy pages, now stripped to pure content. Server XP authority seeded by
// supabase/migrations/0004_seed_sysadmin.sql.

const courses: Course[] = [];
const modules: Module[] = [];
const lessons: Lesson[] = [];

function addCourse(course: Omit<Course,'moduleIds'|'track'|'difficulty'> & { difficulty?: Course['difficulty'] }, moduleId: string, seeds: {id:string;slug:string;title:string;xp:number;minutes:number;hasQuiz?:boolean}[]) {
  const level = course.difficulty ?? 'intermediate';
  const built: Lesson[] = seeds.map((s,i)=>({ id:s.id, slug:s.slug, title:s.title, courseId:course.id, moduleId, order:i+1, xp:s.xp, track:'sysadmin', difficulty:level, estimatedMinutes:s.minutes, lockRule:{type:'none'} as LockRule, hasQuiz:Boolean(s.hasQuiz) }));
  lessons.push(...built);
  modules.push({ id:moduleId, slug:moduleId, title:course.title, courseId:course.id, order:1, lessonIds:built.map(l=>l.id) });
  courses.push({ ...course, track:'sysadmin', difficulty:level, moduleIds:[moduleId] });
}

addCourse({ id:'windows', slug:'windows', title:"Windows Desktop Administration", description:"Advanced Windows Desktop Administration content, migrated from the original curriculum.", icon:'🖥️', order:1 }, 'windows-m1', [
    { id:'windows-01', hasQuiz:true, slug:'architecture', title:"Windows 10/11 Architecture", xp:50, minutes:20 },
    { id:'windows-02', hasQuiz:true, slug:'permissions', title:"User Accounts & Permissions", xp:60, minutes:25 },
    { id:'windows-03', hasQuiz:true, slug:'registry', title:"Windows Registry Deep Dive", xp:70, minutes:30 },
    { id:'windows-04', hasQuiz:true, slug:'processes', title:"Task Manager, Services & Processes", xp:70, minutes:30 },
    { id:'windows-05', hasQuiz:true, slug:'networking', title:"Networking in Windows", xp:70, minutes:30 },
    { id:'windows-06', hasQuiz:true, slug:'event-viewer', title:"Windows Event Viewer & Logging", xp:80, minutes:30 },
]);

addCourse({ id:'windows-server-2025', slug:'windows-server-2025', title:"Windows Server 2025", description:"Advanced Windows Server 2025 content, migrated from the original curriculum.", icon:'🗄️', order:2 }, 'windows-server-2025-m1', [
    { id:'windows-server-2025-01', hasQuiz:true, slug:'intro', title:"Introduction to Windows Server 2025", xp:50, minutes:20 },
    { id:'windows-server-2025-02', hasQuiz:true, slug:'active-directory', title:"Active Directory & Domain Services", xp:100, minutes:45 },
    { id:'windows-server-2025-03', hasQuiz:true, slug:'dhcp', title:"DHCP Server Configuration", xp:80, minutes:30 },
    { id:'windows-server-2025-04', hasQuiz:true, slug:'dns', title:"DNS Server Configuration", xp:80, minutes:30 },
    { id:'windows-server-2025-05', hasQuiz:true, slug:'group-policy', title:"Group Policy Management", xp:120, minutes:40 },
    { id:'windows-server-2025-06', hasQuiz:true, slug:'hyper-v', title:"Hyper-V Virtualisation", xp:100, minutes:35 },
    { id:'windows-server-2025-07', hasQuiz:true, slug:'file-services', title:"File Services & DFS", xp:80, minutes:35 },
    { id:'windows-server-2025-08', hasQuiz:true, slug:'firewall', title:"Windows Firewall & Security", xp:100, minutes:35 },
    { id:'windows-server-2025-09', hasQuiz:true, slug:'rds', title:"Remote Desktop Services", xp:90, minutes:35 },
    { id:'windows-server-2025-10', hasQuiz:true, slug:'backup', title:"Server Backup & Recovery", xp:80, minutes:35 },
    { id:'windows-server-2025-11', hasQuiz:true, slug:'wac', title:"Windows Admin Center", xp:60, minutes:25 },
    { id:'windows-server-2025-12', hasQuiz:true, slug:'hardening', title:"Server Hardening & Best Practices", xp:120, minutes:45 },
]);

addCourse({ id:'linux', slug:'linux', title:"Linux Administration", description:"Advanced Linux Administration content, migrated from the original curriculum.", icon:'🐧', order:3 }, 'linux-m1', [
    { id:'linux-01', hasQuiz:true, slug:'filesystem', title:"Linux File System Hierarchy", xp:50, minutes:20 },
    { id:'linux-02', hasQuiz:true, slug:'shell', title:"Shell Basics & Command Line", xp:60, minutes:25 },
    { id:'linux-03', hasQuiz:true, slug:'permissions', title:"Users, Groups & Permissions", xp:70, minutes:30 },
    { id:'linux-04', hasQuiz:true, slug:'packages', title:"Package Management", xp:60, minutes:20 },
    { id:'linux-05', hasQuiz:true, slug:'systemd', title:"systemd & Service Management", xp:80, minutes:35 },
    { id:'linux-06', hasQuiz:true, slug:'networking', title:"Linux Networking", xp:80, minutes:35 },
    { id:'linux-07', hasQuiz:true, slug:'ssh', title:"SSH & Remote Access", xp:70, minutes:25 },
    { id:'linux-08', hasQuiz:true, slug:'firewall', title:"Firewall with iptables & ufw", xp:90, minutes:35 },
    { id:'linux-09', hasQuiz:true, slug:'disk', title:"Disk Management & LVM", xp:80, minutes:35 },
    { id:'linux-10', hasQuiz:true, slug:'hardening', title:"Linux Server Hardening", xp:100, minutes:45 },
]);

addCourse({ id:'unix', slug:'unix', title:"Unix Foundations", description:"Advanced Unix Foundations content, migrated from the original curriculum.", icon:'🧩', order:4 }, 'unix-m1', [
    { id:'unix-01', hasQuiz:true, slug:'philosophy', title:"Unix Philosophy & History", xp:40, minutes:15 },
    { id:'unix-02', hasQuiz:true, slug:'posix-shell', title:"POSIX Shell Scripting", xp:70, minutes:30 },
    { id:'unix-03', hasQuiz:true, slug:'bsd', title:"BSD Unix Systems", xp:60, minutes:25 },
    { id:'unix-04', hasQuiz:true, slug:'permissions', title:"Unix File Permissions & ACLs", xp:70, minutes:25 },
    { id:'unix-05', hasQuiz:true, slug:'processes', title:"Process & Signal Management", xp:70, minutes:25 },
]);

addCourse({ id:'networking', slug:'networking', title:"Networking (Advanced)", description:"Advanced Networking (Advanced) content, migrated from the original curriculum.", icon:'🌐', order:5 }, 'networking-m1', [
    { id:'networking-01', hasQuiz:true, slug:'osi-model', title:"The OSI Model", xp:60, minutes:25 },
    { id:'networking-02', hasQuiz:true, slug:'tcp-ip', title:"TCP/IP & the Internet Protocol Suite", xp:70, minutes:30 },
    { id:'networking-03', hasQuiz:true, slug:'subnetting', title:"Subnetting & CIDR", xp:90, minutes:40 },
    { id:'networking-04', hasQuiz:true, slug:'vlans', title:"VLANs & Switching", xp:80, minutes:35 },
    { id:'networking-05', hasQuiz:true, slug:'routing', title:"Routing Fundamentals", xp:90, minutes:40 },
    { id:'networking-06', hasQuiz:true, slug:'dns', title:"DNS Deep Dive", xp:70, minutes:30 },
    { id:'networking-07', hasQuiz:true, slug:'wireless', title:"Wireless Networking", xp:80, minutes:35 },
]);

addCourse({ id:'powershell', slug:'powershell', title:"PowerShell Automation", description:"Advanced PowerShell Automation content, migrated from the original curriculum.", icon:'⚡', order:6 }, 'powershell-m1', [
    { id:'powershell-01', hasQuiz:true, slug:'fundamentals', title:"PowerShell Fundamentals", xp:50, minutes:25 },
    { id:'powershell-02', hasQuiz:true, slug:'pipeline', title:"Working with Objects & the Pipeline", xp:70, minutes:30 },
    { id:'powershell-03', hasQuiz:true, slug:'scripting', title:"Scripts, Functions & Modules", xp:80, minutes:35 },
    { id:'powershell-04', hasQuiz:true, slug:'active-directory', title:"Active Directory Automation", xp:100, minutes:45 },
    { id:'powershell-05', hasQuiz:true, slug:'remoting', title:"Remote Management with PSRemoting", xp:80, minutes:30 },
    { id:'powershell-06', hasQuiz:true, slug:'filesystem', title:"File System & Registry Automation", xp:70, minutes:30 },
    { id:'powershell-07', hasQuiz:true, slug:'dsc', title:"Desired State Configuration", xp:100, minutes:40 },
    { id:'powershell-08', hasQuiz:true, slug:'reporting', title:"Reporting & Scheduled Automation", xp:80, minutes:35 },
]);

addCourse({ id:'python', slug:'python', title:"Python for SysAdmins", description:"Advanced Python for SysAdmins content, migrated from the original curriculum.", icon:'🐍', order:7 }, 'python-m1', [
    { id:'python-01', hasQuiz:true, slug:'basics', title:"Python Basics for SysAdmins", xp:50, minutes:25 },
    { id:'python-02', hasQuiz:true, slug:'filesystem', title:"File System Automation", xp:70, minutes:30 },
    { id:'python-03', hasQuiz:true, slug:'subprocess', title:"Working with Subprocess", xp:70, minutes:30 },
    { id:'python-04', hasQuiz:true, slug:'networking', title:"Network Automation with Python", xp:80, minutes:35 },
    { id:'python-05', hasQuiz:true, slug:'log-parsing', title:"Parsing Logs & Text Processing", xp:80, minutes:35 },
    { id:'python-06', hasQuiz:true, slug:'scheduling', title:"Scheduled Tasks & Cron Automation", xp:70, minutes:30 },
    { id:'python-07', hasQuiz:true, slug:'monitoring', title:"Infrastructure Monitoring Scripts", xp:90, minutes:35 },
    { id:'python-08', hasQuiz:true, slug:'ansible', title:"Python + Ansible Integration", xp:90, minutes:40 },
    { id:'python-09', hasQuiz:true, slug:'cli-tool', title:"Building a SysAdmin CLI Tool", xp:90, minutes:40 },
]);

addCourse({ id:'cybersecurity', slug:'cybersecurity', title:"Cybersecurity & Hardening", description:"Advanced Cybersecurity & Hardening content, migrated from the original curriculum.", icon:'🛡️', order:8 }, 'cybersecurity-m1', [
    { id:'cybersecurity-01', hasQuiz:true, slug:'cia-triad', title:"The CIA Triad & Security Models", xp:50, minutes:20 },
    { id:'cybersecurity-02', hasQuiz:true, slug:'threat-modelling', title:"Threat Modelling", xp:70, minutes:30 },
    { id:'cybersecurity-03', hasQuiz:true, slug:'windows-hardening', title:"Windows Server Hardening", xp:100, minutes:40 },
    { id:'cybersecurity-04', hasQuiz:true, slug:'linux-hardening', title:"Linux Server Hardening", xp:100, minutes:40 },
    { id:'cybersecurity-05', hasQuiz:true, slug:'firewall', title:"Firewall Configuration", xp:80, minutes:35 },
    { id:'cybersecurity-06', hasQuiz:true, slug:'pki', title:"PKI, SSL/TLS & Certificates", xp:80, minutes:35 },
    { id:'cybersecurity-07', hasQuiz:true, slug:'ids-siem', title:"Intrusion Detection & SIEM", xp:100, minutes:40 },
    { id:'cybersecurity-08', hasQuiz:true, slug:'vuln-scanning', title:"Vulnerability Scanning", xp:90, minutes:35 },
    { id:'cybersecurity-09', hasQuiz:true, slug:'incident-response', title:"Incident Response", xp:100, minutes:40 },
    { id:'cybersecurity-10', hasQuiz:true, slug:'ad-security', title:"Active Directory Security", xp:120, minutes:50 },
]);

addCourse({ id:'troubleshooting', slug:'troubleshooting', title:"Advanced Troubleshooting", description:"Advanced Advanced Troubleshooting content, migrated from the original curriculum.", icon:'🔧', order:9 }, 'troubleshooting-m1', [
    { id:'troubleshooting-01', hasQuiz:true, slug:'methodology', title:"The Troubleshooting Methodology", xp:50, minutes:20 },
    { id:'troubleshooting-02', hasQuiz:true, slug:'windows', title:"Windows Troubleshooting", xp:80, minutes:35 },
    { id:'troubleshooting-03', hasQuiz:true, slug:'linux', title:"Linux Troubleshooting", xp:80, minutes:35 },
    { id:'troubleshooting-04', hasQuiz:true, slug:'networking', title:"Network Troubleshooting", xp:80, minutes:35 },
    { id:'troubleshooting-05', hasQuiz:true, slug:'active-directory', title:"Active Directory Issues", xp:90, minutes:40 },
    { id:'troubleshooting-06', hasQuiz:true, slug:'performance', title:"Performance & Capacity Issues", xp:80, minutes:35 },
]);

// P18-GENERATED-START
addCourse({ id:'ws-active-directory', slug:'ws-active-directory', title:"Active Directory Deep Dive", description:"Master Active Directory Domain Services end to end — architecture, domains and forests, OUs, groups, FSMO roles, replication, trusts, and health maintenance.", icon:'🏛️', order:20, difficulty:'advanced' }, 'ws-ad-m1', [
    { id:'ws-ad-01', hasQuiz:true, slug:'architecture', title:"AD DS Architecture & Installation", xp:90, minutes:30 },
    { id:'ws-ad-02', hasQuiz:true, slug:'domains-forests', title:"Domains, Trees & Forests", xp:90, minutes:30 },
    { id:'ws-ad-03', hasQuiz:true, slug:'ous-delegation', title:"Organizational Units & Delegation", xp:90, minutes:28 },
    { id:'ws-ad-04', hasQuiz:true, slug:'groups-scopes', title:"Users, Groups & Group Scopes", xp:90, minutes:30 },
    { id:'ws-ad-05', hasQuiz:true, slug:'fsmo', title:"FSMO Roles", xp:95, minutes:28 },
    { id:'ws-ad-06', hasQuiz:true, slug:'sites-replication', title:"Sites, Subnets & Replication", xp:95, minutes:30 },
    { id:'ws-ad-07', hasQuiz:true, slug:'trusts', title:"Trusts", xp:90, minutes:26 },
    { id:'ws-ad-08', hasQuiz:true, slug:'maintenance', title:"AD Maintenance & Health", xp:95, minutes:28 }
]);

addCourse({ id:'ws-group-policy', slug:'ws-group-policy', title:"Group Policy Mastery", description:"Control Windows at scale with Group Policy — architecture, processing order, security settings, preferences, deployment, and troubleshooting.", icon:'⚙️', order:21, difficulty:'advanced' }, 'ws-gp-m1', [
    { id:'ws-gp-01', hasQuiz:true, slug:'architecture', title:"Group Policy Architecture", xp:85, minutes:26 },
    { id:'ws-gp-02', hasQuiz:true, slug:'processing-order', title:"Processing Order & Precedence", xp:90, minutes:28 },
    { id:'ws-gp-03', hasQuiz:true, slug:'security-settings', title:"Security Settings & Admin Templates", xp:90, minutes:28 },
    { id:'ws-gp-04', hasQuiz:true, slug:'preferences', title:"Group Policy Preferences", xp:85, minutes:26 },
    { id:'ws-gp-05', hasQuiz:true, slug:'deployment', title:"Folder Redirection & Software Deployment", xp:90, minutes:26 },
    { id:'ws-gp-06', hasQuiz:true, slug:'troubleshooting', title:"Troubleshooting Group Policy", xp:90, minutes:26 }
]);

addCourse({ id:'ws-dns-dhcp', slug:'ws-dns-dhcp', title:"DNS & DHCP In Depth", description:"Run the two services every Windows network depends on — authoritative DNS (zones, records, forwarding, security) and DHCP (scopes, high availability, troubleshooting).", icon:'🌐', order:22, difficulty:'intermediate' }, 'ws-dns-m1', [
    { id:'ws-dns-01', hasQuiz:true, slug:'dns-zones', title:"DNS Fundamentals & Zones", xp:90, minutes:28 },
    { id:'ws-dns-02', hasQuiz:true, slug:'dns-records', title:"DNS Record Types", xp:85, minutes:26 },
    { id:'ws-dns-03', hasQuiz:true, slug:'forwarders', title:"Forwarders, Conditional Forwarders & Recursion", xp:90, minutes:26 },
    { id:'ws-dns-04', hasQuiz:true, slug:'dns-security', title:"DNS Security & Maintenance", xp:90, minutes:26 },
    { id:'ws-dhcp-01', hasQuiz:true, slug:'dhcp-scopes', title:"DHCP Fundamentals & Scopes", xp:85, minutes:26 },
    { id:'ws-dhcp-02', hasQuiz:true, slug:'dhcp-ha', title:"DHCP High Availability", xp:90, minutes:26 },
    { id:'ws-dhcp-03', hasQuiz:true, slug:'dhcp-troubleshooting', title:"DHCP Management & Troubleshooting", xp:85, minutes:24 }
]);

addCourse({ id:'ws-file-storage', slug:'ws-file-storage', title:"File & Storage Services", description:"Deliver reliable file services — NTFS and share permissions, DFS, quotas and file screening, Storage Spaces, iSCSI, deduplication, and shadow copies.", icon:'🗂️', order:23, difficulty:'intermediate' }, 'ws-fs-m1', [
    { id:'ws-fs-01', hasQuiz:true, slug:'permissions', title:"NTFS & Share Permissions", xp:90, minutes:28 },
    { id:'ws-fs-02', hasQuiz:true, slug:'dfs', title:"DFS Namespaces & Replication", xp:90, minutes:26 },
    { id:'ws-fs-03', hasQuiz:true, slug:'fsrm', title:"File Server Resource Manager (Quotas & Screening)", xp:85, minutes:24 },
    { id:'ws-fs-04', hasQuiz:true, slug:'storage-spaces', title:"Storage Spaces & Resiliency", xp:90, minutes:26 },
    { id:'ws-fs-05', hasQuiz:true, slug:'iscsi', title:"iSCSI & Shared Storage", xp:85, minutes:24 },
    { id:'ws-fs-06', hasQuiz:true, slug:'dedup-vss', title:"Deduplication & Shadow Copies", xp:85, minutes:24 }
]);

addCourse({ id:'ws-hyperv', slug:'ws-hyperv', title:"Hyper-V & Virtualization", description:"Virtualise workloads with Hyper-V — the hypervisor, virtual switches, VM and virtual-disk configuration, checkpoints, and live migration and replication for availability and DR.", icon:'🧱', order:24, difficulty:'advanced' }, 'ws-hv-m1', [
    { id:'ws-hv-01', hasQuiz:true, slug:'basics', title:"Hyper-V Basics & Installation", xp:90, minutes:26 },
    { id:'ws-hv-02', hasQuiz:true, slug:'virtual-switches', title:"Virtual Switches & Networking", xp:90, minutes:26 },
    { id:'ws-hv-03', hasQuiz:true, slug:'vm-config', title:"Creating & Configuring VMs", xp:90, minutes:26 },
    { id:'ws-hv-04', hasQuiz:true, slug:'virtual-disks', title:"Virtual Disks & Storage", xp:85, minutes:24 },
    { id:'ws-hv-05', hasQuiz:true, slug:'checkpoints', title:"Checkpoints & VM Management", xp:85, minutes:22 },
    { id:'ws-hv-06', hasQuiz:true, slug:'live-migration', title:"Live Migration & Replica", xp:90, minutes:24 }
]);

addCourse({ id:'ws-security', slug:'ws-security', title:"Server Security & Hardening", description:"Harden Windows Server for the enterprise — least-privilege and tiered admin, LAPS, Defender and firewall, BitLocker and Credential Guard, patching, auditing, and hardening baselines.", icon:'🛡️', order:25, difficulty:'advanced' }, 'ws-sec-m1', [
    { id:'ws-sec-01', hasQuiz:true, slug:'principles', title:"Security Principles & Tiered Admin", xp:90, minutes:24 },
    { id:'ws-sec-02', hasQuiz:true, slug:'laps', title:"Local Admin Passwords & LAPS", xp:85, minutes:22 },
    { id:'ws-sec-03', hasQuiz:true, slug:'defender-firewall', title:"Windows Defender & Firewall", xp:85, minutes:24 },
    { id:'ws-sec-04', hasQuiz:true, slug:'bitlocker', title:"BitLocker & Credential Guard", xp:85, minutes:22 },
    { id:'ws-sec-05', hasQuiz:true, slug:'patching', title:"Patching & Update Management", xp:85, minutes:22 },
    { id:'ws-sec-06', hasQuiz:true, slug:'auditing', title:"Auditing & Security Logging", xp:85, minutes:22 },
    { id:'ws-sec-07', hasQuiz:true, slug:'hardening', title:"Attack Surface Reduction & Baselines", xp:90, minutes:22 }
]);

addCourse({ id:'ws-powershell', slug:'ws-powershell', title:"PowerShell Automation for Windows Server", description:"Automate Windows Server with PowerShell — cmdlets and the object pipeline, remoting, bulk administration, scheduled reporting, and an introduction to Desired State Configuration.", icon:'⌨️', order:26, difficulty:'advanced' }, 'ws-ps-m1', [
    { id:'ws-ps-01', hasQuiz:true, slug:'fundamentals', title:"PowerShell for Server Admins", xp:90, minutes:24 },
    { id:'ws-ps-02', hasQuiz:true, slug:'pipeline', title:"Filtering, Formatting & the Pipeline", xp:85, minutes:24 },
    { id:'ws-ps-03', hasQuiz:true, slug:'managing', title:"Managing Servers with Cmdlets", xp:90, minutes:24 },
    { id:'ws-ps-04', hasQuiz:true, slug:'remoting', title:"PowerShell Remoting", xp:90, minutes:24 },
    { id:'ws-ps-05', hasQuiz:true, slug:'bulk', title:"Bulk Administration & Scripting", xp:95, minutes:26 },
    { id:'ws-ps-06', hasQuiz:true, slug:'dsc-reporting', title:"Scheduling, Reporting & DSC", xp:90, minutes:24 }
]);

addCourse({ id:'ws-backup-ha', slug:'ws-backup-ha', title:"Backup, Recovery & High Availability", description:"Keep services running and data recoverable — backup fundamentals, Windows Server Backup, restore scenarios, failover clustering, and disaster-recovery planning.", icon:'💾', order:27, difficulty:'advanced' }, 'ws-bk-m1', [
    { id:'ws-bk-01', hasQuiz:true, slug:'fundamentals', title:"Backup Fundamentals", xp:85, minutes:22 },
    { id:'ws-bk-02', hasQuiz:true, slug:'windows-server-backup', title:"Windows Server Backup", xp:85, minutes:22 },
    { id:'ws-bk-03', hasQuiz:true, slug:'restore', title:"Restore & Recovery Scenarios", xp:90, minutes:22 },
    { id:'ws-bk-04', hasQuiz:true, slug:'clustering', title:"Failover Clustering Basics", xp:90, minutes:24 },
    { id:'ws-bk-05', hasQuiz:true, slug:'dr-planning', title:"Disaster Recovery Planning", xp:90, minutes:22 }
]);

addCourse({ id:'ws-foundations', slug:'ws-foundations', title:"Foundations & Deployment", description:"Start strong with Windows Server — editions and licensing, Server Core vs Desktop, initial configuration, modern management tools, roles and features, and deployment at scale.", icon:'🏗️', order:19, difficulty:'intermediate' }, 'ws-fnd-m1', [
    { id:'ws-fnd-01', hasQuiz:true, slug:'editions', title:"Editions, Licensing & Installation", xp:85, minutes:24 },
    { id:'ws-fnd-02', hasQuiz:true, slug:'server-core', title:"Server Core vs Desktop Experience", xp:90, minutes:24 },
    { id:'ws-fnd-03', hasQuiz:true, slug:'initial-config', title:"Initial Server Configuration", xp:85, minutes:22 },
    { id:'ws-fnd-04', hasQuiz:true, slug:'management-tools', title:"Server Manager & Windows Admin Center", xp:85, minutes:22 },
    { id:'ws-fnd-05', hasQuiz:true, slug:'roles-features', title:"Roles & Features", xp:85, minutes:22 },
    { id:'ws-fnd-06', hasQuiz:true, slug:'deployment', title:"Deployment at Scale", xp:90, minutes:24 }
]);

addCourse({ id:'ws-remote-access', slug:'ws-remote-access', title:"Networking & Remote Access", description:"Connect and extend the network with Windows Server — host networking, RRAS and VPN, RADIUS/NPS, modern Always On VPN, and Remote Desktop Services.", icon:'🔌', order:28, difficulty:'intermediate' }, 'ws-ras-m1', [
    { id:'ws-ras-01', hasQuiz:true, slug:'server-networking', title:"Server Networking Configuration", xp:85, minutes:22 },
    { id:'ws-ras-02', hasQuiz:true, slug:'rras-vpn', title:"Routing & Remote Access (VPN)", xp:90, minutes:24 },
    { id:'ws-ras-03', hasQuiz:true, slug:'nps-radius', title:"Network Policy Server & RADIUS", xp:90, minutes:22 },
    { id:'ws-ras-04', hasQuiz:true, slug:'always-on-vpn', title:"Always On VPN & Modern Remote Access", xp:90, minutes:22 },
    { id:'ws-ras-05', hasQuiz:true, slug:'rds', title:"Remote Desktop Services Basics", xp:85, minutes:22 }
]);

addCourse({ id:'ws-monitoring', slug:'ws-monitoring', title:"Monitoring & Troubleshooting", description:"Keep servers healthy and fix them fast — Event Viewer, Performance Monitor, services and startup, a systematic troubleshooting method, and the most common server failures.", icon:'📈', order:29, difficulty:'intermediate' }, 'ws-mon-m1', [
    { id:'ws-mon-01', hasQuiz:true, slug:'event-viewer', title:"Event Viewer & Logs", xp:85, minutes:22 },
    { id:'ws-mon-02', hasQuiz:true, slug:'perfmon', title:"Performance Monitor & Baselines", xp:90, minutes:22 },
    { id:'ws-mon-03', hasQuiz:true, slug:'services-startup', title:"Services, Processes & Startup", xp:80, minutes:20 },
    { id:'ws-mon-04', hasQuiz:true, slug:'methodology', title:"Troubleshooting Methodology", xp:90, minutes:22 },
    { id:'ws-mon-05', hasQuiz:true, slug:'common-problems', title:"Common Server Problems", xp:90, minutes:22 }
]);
// P18-GENERATED-END

// P19-GENERATED-START
addCourse({ id:'nw-fundamentals', slug:'nw-fundamentals', title:"Network Fundamentals", description:"Build a rock-solid mental model of networking — network types and topologies, the OSI and TCP/IP models, encapsulation, protocols and ports, and the physical media that carry the data.", icon:'🕸️', order:6, difficulty:'beginner' }, 'nw-fund-m1', [
    { id:'nw-fund-01', hasQuiz:true, slug:'what-is-a-network', title:"What Is a Network?", xp:60, minutes:22 },
    { id:'nw-fund-02', hasQuiz:true, slug:'osi-model', title:"The OSI Model", xp:75, minutes:26 },
    { id:'nw-fund-03', hasQuiz:true, slug:'tcp-ip-encapsulation', title:"TCP/IP & Encapsulation", xp:80, minutes:26 },
    { id:'nw-fund-04', hasQuiz:true, slug:'protocols-ports', title:"Protocols & Ports", xp:75, minutes:24 },
    { id:'nw-fund-05', hasQuiz:true, slug:'cabling-media', title:"Cabling & Media", xp:70, minutes:22 }
]);

addCourse({ id:'nw-ipv4', slug:'nw-ipv4', title:"IPv4 Addressing & Subnetting", description:"Master IPv4 the way the job demands — addressing and private ranges, subnet masks and CIDR, subnetting by hand, VLSM, and designing an addressing scheme that scales.", icon:'🔢', order:7, difficulty:'intermediate' }, 'nw-ip-m1', [
    { id:'nw-ip-01', hasQuiz:true, slug:'ipv4-basics', title:"IPv4 Addressing Basics", xp:75, minutes:24 },
    { id:'nw-ip-02', hasQuiz:true, slug:'subnet-masks-cidr', title:"Subnet Masks & CIDR", xp:85, minutes:26 },
    { id:'nw-ip-03', hasQuiz:true, slug:'subnetting', title:"Subnetting: Splitting a Network", xp:90, minutes:28 },
    { id:'nw-ip-04', hasQuiz:true, slug:'subnetting-practice', title:"Subnetting Practice", xp:90, minutes:26 },
    { id:'nw-ip-05', hasQuiz:true, slug:'vlsm', title:"VLSM: Variable-Length Subnet Masks", xp:85, minutes:24 },
    { id:'nw-ip-06', hasQuiz:true, slug:'addressing-scheme', title:"Planning an Addressing Scheme", xp:80, minutes:22 }
]);

addCourse({ id:'nw-ipv6', slug:'nw-ipv6', title:"IPv6 Essentials", description:"Understand the address space that's replacing IPv4 — 128-bit addressing and notation, address types and autoconfiguration, and how IPv6 coexists with IPv4.", icon:'🌍', order:8, difficulty:'intermediate' }, 'nw-ip6-m1', [
    { id:'nw-ip6-01', hasQuiz:true, slug:'ipv6-addressing', title:"Why IPv6 & Addressing", xp:80, minutes:24 },
    { id:'nw-ip6-02', hasQuiz:true, slug:'ipv6-types-slaac', title:"Address Types & SLAAC", xp:80, minutes:24 },
    { id:'nw-ip6-03', hasQuiz:true, slug:'ipv6-transition', title:"IPv6 Transition & Coexistence", xp:75, minutes:22 }
]);

addCourse({ id:'nw-switching', slug:'nw-switching', title:"Switching & VLANs", description:"How local networks really move frames — Ethernet and MAC addressing, VLAN segmentation, 802.1Q trunking, spanning tree, and switch security.", icon:'🔀', order:9, difficulty:'intermediate' }, 'nw-sw-m1', [
    { id:'nw-sw-01', hasQuiz:true, slug:'ethernet-mac', title:"Ethernet & MAC Addressing", xp:80, minutes:24 },
    { id:'nw-sw-02', hasQuiz:true, slug:'vlans', title:"VLANs", xp:90, minutes:26 },
    { id:'nw-sw-03', hasQuiz:true, slug:'trunking', title:"Trunking (802.1Q)", xp:85, minutes:24 },
    { id:'nw-sw-04', hasQuiz:true, slug:'spanning-tree', title:"Spanning Tree Protocol", xp:85, minutes:24 },
    { id:'nw-sw-05', hasQuiz:true, slug:'port-security', title:"Port Security & Switch Hardening", xp:85, minutes:22 }
]);

addCourse({ id:'nw-routing', slug:'nw-routing', title:"Routing", description:"Move traffic between networks — routing tables and decisions, static and dynamic routing, inter-VLAN routing, and NAT/PAT.", icon:'🧭', order:10, difficulty:'advanced' }, 'nw-rt-m1', [
    { id:'nw-rt-01', hasQuiz:true, slug:'routing-concepts', title:"Routing Concepts", xp:85, minutes:24 },
    { id:'nw-rt-02', hasQuiz:true, slug:'static-routing', title:"Static Routing", xp:80, minutes:22 },
    { id:'nw-rt-03', hasQuiz:true, slug:'dynamic-routing', title:"Dynamic Routing", xp:85, minutes:24 },
    { id:'nw-rt-04', hasQuiz:true, slug:'inter-vlan', title:"Inter-VLAN Routing", xp:85, minutes:22 },
    { id:'nw-rt-05', hasQuiz:true, slug:'nat-pat', title:"NAT & PAT", xp:85, minutes:22 }
]);

addCourse({ id:'nw-wireless', slug:'nw-wireless', title:"Wireless Networking", description:"Deliver reliable Wi-Fi — the 802.11 standards and bands, wireless security, and designing and troubleshooting coverage.", icon:'📶', order:11, difficulty:'intermediate' }, 'nw-wifi-m1', [
    { id:'nw-wifi-01', hasQuiz:true, slug:'standards-bands', title:"Wi-Fi Standards & Bands", xp:75, minutes:22 },
    { id:'nw-wifi-02', hasQuiz:true, slug:'wireless-security', title:"Wireless Security", xp:80, minutes:22 },
    { id:'nw-wifi-03', hasQuiz:true, slug:'wireless-design', title:"Wireless Design & Troubleshooting", xp:80, minutes:22 }
]);

addCourse({ id:'nw-security', slug:'nw-security', title:"Network Security & Services", description:"Protect and serve the network — firewalls and ACLs, VPNs and IPsec, segmentation and zero-trust, and the DNS/DHCP services every network relies on.", icon:'🔒', order:12, difficulty:'advanced' }, 'nw-sec-m1', [
    { id:'nw-sec-01', hasQuiz:true, slug:'firewalls-acls', title:"Firewalls & ACLs", xp:85, minutes:24 },
    { id:'nw-sec-02', hasQuiz:true, slug:'vpns-ipsec', title:"VPNs & IPsec", xp:85, minutes:24 },
    { id:'nw-sec-03', hasQuiz:true, slug:'segmentation-zero-trust', title:"Segmentation & Zero Trust", xp:85, minutes:22 },
    { id:'nw-sec-04', hasQuiz:true, slug:'dhcp-dns-network', title:"DHCP & DNS on the Network", xp:80, minutes:22 }
]);

addCourse({ id:'nw-troubleshooting', slug:'nw-troubleshooting', title:"Monitoring, Tools & Troubleshooting", description:"Find and fix network problems fast — essential CLI tools, a repeatable OSI-based method, packet analysis, and monitoring at scale.", icon:'🛠️', order:13, difficulty:'intermediate' }, 'nw-tsh-m1', [
    { id:'nw-tsh-01', hasQuiz:true, slug:'cli-tools', title:"Essential CLI Tools", xp:85, minutes:24 },
    { id:'nw-tsh-02', hasQuiz:true, slug:'method', title:"A Troubleshooting Method", xp:85, minutes:22 },
    { id:'nw-tsh-03', hasQuiz:true, slug:'packet-analysis', title:"Packet Analysis", xp:85, minutes:22 },
    { id:'nw-tsh-04', hasQuiz:true, slug:'monitoring', title:"Monitoring at Scale", xp:80, minutes:22 }
]);
// P19-GENERATED-END

export const sysadminCourses = courses;
export const sysadminModules = modules;
export const sysadminLessons = lessons;
