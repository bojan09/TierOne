import type { Course, Lesson, LockRule, Module } from '@/shared/types';

// AUTO-GENERATED (P5.5) from migrated legacy lessons. Bodies are the former
// legacy pages, now stripped to pure content. Server XP authority seeded by
// supabase/migrations/0004_seed_sysadmin.sql.

const courses: Course[] = [];
const modules: Module[] = [];
const lessons: Lesson[] = [];

function addCourse(course: Omit<Course,'moduleIds'|'track'|'difficulty'>, moduleId: string, seeds: {id:string;slug:string;title:string;xp:number;minutes:number}[]) {
  const built: Lesson[] = seeds.map((s,i)=>({ id:s.id, slug:s.slug, title:s.title, courseId:course.id, moduleId, order:i+1, xp:s.xp, track:'sysadmin', difficulty:'intermediate', estimatedMinutes:s.minutes, lockRule:(i===0?{type:'none'}:{type:'sequential'}) as LockRule, hasQuiz:false }));
  lessons.push(...built);
  modules.push({ id:moduleId, slug:moduleId, title:course.title, courseId:course.id, order:1, lessonIds:built.map(l=>l.id) });
  courses.push({ ...course, track:'sysadmin', difficulty:'intermediate', moduleIds:[moduleId] });
}

addCourse({ id:'windows', slug:'windows', title:"Windows Desktop Administration", description:"Advanced Windows Desktop Administration content, migrated from the original curriculum.", icon:'🖥️', order:1 }, 'windows-m1', [
    { id:'windows-01', slug:'architecture', title:"Windows 10/11 Architecture", xp:50, minutes:20 },
    { id:'windows-02', slug:'permissions', title:"User Accounts & Permissions", xp:60, minutes:25 },
    { id:'windows-03', slug:'registry', title:"Windows Registry Deep Dive", xp:70, minutes:30 },
    { id:'windows-04', slug:'processes', title:"Task Manager, Services & Processes", xp:70, minutes:30 },
    { id:'windows-05', slug:'networking', title:"Networking in Windows", xp:70, minutes:30 },
    { id:'windows-06', slug:'event-viewer', title:"Windows Event Viewer & Logging", xp:80, minutes:30 },
]);

addCourse({ id:'windows-server-2025', slug:'windows-server-2025', title:"Windows Server 2025", description:"Advanced Windows Server 2025 content, migrated from the original curriculum.", icon:'🗄️', order:2 }, 'windows-server-2025-m1', [
    { id:'windows-server-2025-01', slug:'intro', title:"Introduction to Windows Server 2025", xp:50, minutes:20 },
    { id:'windows-server-2025-02', slug:'active-directory', title:"Active Directory & Domain Services", xp:100, minutes:45 },
    { id:'windows-server-2025-03', slug:'dhcp', title:"DHCP Server Configuration", xp:80, minutes:30 },
    { id:'windows-server-2025-04', slug:'dns', title:"DNS Server Configuration", xp:80, minutes:30 },
    { id:'windows-server-2025-05', slug:'group-policy', title:"Group Policy Management", xp:120, minutes:40 },
    { id:'windows-server-2025-06', slug:'hyper-v', title:"Hyper-V Virtualisation", xp:100, minutes:35 },
    { id:'windows-server-2025-07', slug:'file-services', title:"File Services & DFS", xp:80, minutes:35 },
    { id:'windows-server-2025-08', slug:'firewall', title:"Windows Firewall & Security", xp:100, minutes:35 },
    { id:'windows-server-2025-09', slug:'rds', title:"Remote Desktop Services", xp:90, minutes:35 },
    { id:'windows-server-2025-10', slug:'backup', title:"Server Backup & Recovery", xp:80, minutes:35 },
    { id:'windows-server-2025-11', slug:'wac', title:"Windows Admin Center", xp:60, minutes:25 },
    { id:'windows-server-2025-12', slug:'hardening', title:"Server Hardening & Best Practices", xp:120, minutes:45 },
]);

addCourse({ id:'linux', slug:'linux', title:"Linux Administration", description:"Advanced Linux Administration content, migrated from the original curriculum.", icon:'🐧', order:3 }, 'linux-m1', [
    { id:'linux-01', slug:'filesystem', title:"Linux File System Hierarchy", xp:50, minutes:20 },
    { id:'linux-02', slug:'shell', title:"Shell Basics & Command Line", xp:60, minutes:25 },
    { id:'linux-03', slug:'permissions', title:"Users, Groups & Permissions", xp:70, minutes:30 },
    { id:'linux-04', slug:'packages', title:"Package Management", xp:60, minutes:20 },
    { id:'linux-05', slug:'systemd', title:"systemd & Service Management", xp:80, minutes:35 },
    { id:'linux-06', slug:'networking', title:"Linux Networking", xp:80, minutes:35 },
    { id:'linux-07', slug:'ssh', title:"SSH & Remote Access", xp:70, minutes:25 },
    { id:'linux-08', slug:'firewall', title:"Firewall with iptables & ufw", xp:90, minutes:35 },
    { id:'linux-09', slug:'disk', title:"Disk Management & LVM", xp:80, minutes:35 },
    { id:'linux-10', slug:'hardening', title:"Linux Server Hardening", xp:100, minutes:45 },
]);

addCourse({ id:'unix', slug:'unix', title:"Unix Foundations", description:"Advanced Unix Foundations content, migrated from the original curriculum.", icon:'🧩', order:4 }, 'unix-m1', [
    { id:'unix-01', slug:'philosophy', title:"Unix Philosophy & History", xp:40, minutes:15 },
    { id:'unix-02', slug:'posix-shell', title:"POSIX Shell Scripting", xp:70, minutes:30 },
    { id:'unix-03', slug:'bsd', title:"BSD Unix Systems", xp:60, minutes:25 },
    { id:'unix-04', slug:'permissions', title:"Unix File Permissions & ACLs", xp:70, minutes:25 },
    { id:'unix-05', slug:'processes', title:"Process & Signal Management", xp:70, minutes:25 },
]);

addCourse({ id:'networking', slug:'networking', title:"Networking (Advanced)", description:"Advanced Networking (Advanced) content, migrated from the original curriculum.", icon:'🌐', order:5 }, 'networking-m1', [
    { id:'networking-01', slug:'osi-model', title:"The OSI Model", xp:60, minutes:25 },
    { id:'networking-02', slug:'tcp-ip', title:"TCP/IP & the Internet Protocol Suite", xp:70, minutes:30 },
    { id:'networking-03', slug:'subnetting', title:"Subnetting & CIDR", xp:90, minutes:40 },
    { id:'networking-04', slug:'vlans', title:"VLANs & Switching", xp:80, minutes:35 },
    { id:'networking-05', slug:'routing', title:"Routing Fundamentals", xp:90, minutes:40 },
    { id:'networking-06', slug:'dns', title:"DNS Deep Dive", xp:70, minutes:30 },
    { id:'networking-07', slug:'wireless', title:"Wireless Networking", xp:80, minutes:35 },
]);

addCourse({ id:'powershell', slug:'powershell', title:"PowerShell Automation", description:"Advanced PowerShell Automation content, migrated from the original curriculum.", icon:'⚡', order:6 }, 'powershell-m1', [
    { id:'powershell-01', slug:'fundamentals', title:"PowerShell Fundamentals", xp:50, minutes:25 },
    { id:'powershell-02', slug:'pipeline', title:"Working with Objects & the Pipeline", xp:70, minutes:30 },
    { id:'powershell-03', slug:'scripting', title:"Scripts, Functions & Modules", xp:80, minutes:35 },
    { id:'powershell-04', slug:'active-directory', title:"Active Directory Automation", xp:100, minutes:45 },
    { id:'powershell-05', slug:'remoting', title:"Remote Management with PSRemoting", xp:80, minutes:30 },
    { id:'powershell-06', slug:'filesystem', title:"File System & Registry Automation", xp:70, minutes:30 },
    { id:'powershell-07', slug:'dsc', title:"Desired State Configuration", xp:100, minutes:40 },
    { id:'powershell-08', slug:'reporting', title:"Reporting & Scheduled Automation", xp:80, minutes:35 },
]);

addCourse({ id:'python', slug:'python', title:"Python for SysAdmins", description:"Advanced Python for SysAdmins content, migrated from the original curriculum.", icon:'🐍', order:7 }, 'python-m1', [
    { id:'python-01', slug:'basics', title:"Python Basics for SysAdmins", xp:50, minutes:25 },
    { id:'python-02', slug:'filesystem', title:"File System Automation", xp:70, minutes:30 },
    { id:'python-03', slug:'subprocess', title:"Working with Subprocess", xp:70, minutes:30 },
    { id:'python-04', slug:'networking', title:"Network Automation with Python", xp:80, minutes:35 },
    { id:'python-05', slug:'log-parsing', title:"Parsing Logs & Text Processing", xp:80, minutes:35 },
    { id:'python-06', slug:'scheduling', title:"Scheduled Tasks & Cron Automation", xp:70, minutes:30 },
    { id:'python-07', slug:'monitoring', title:"Infrastructure Monitoring Scripts", xp:90, minutes:35 },
    { id:'python-08', slug:'ansible', title:"Python + Ansible Integration", xp:90, minutes:40 },
    { id:'python-09', slug:'cli-tool', title:"Building a SysAdmin CLI Tool", xp:90, minutes:40 },
]);

addCourse({ id:'cybersecurity', slug:'cybersecurity', title:"Cybersecurity & Hardening", description:"Advanced Cybersecurity & Hardening content, migrated from the original curriculum.", icon:'🛡️', order:8 }, 'cybersecurity-m1', [
    { id:'cybersecurity-01', slug:'cia-triad', title:"The CIA Triad & Security Models", xp:50, minutes:20 },
    { id:'cybersecurity-02', slug:'threat-modelling', title:"Threat Modelling", xp:70, minutes:30 },
    { id:'cybersecurity-03', slug:'windows-hardening', title:"Windows Server Hardening", xp:100, minutes:40 },
    { id:'cybersecurity-04', slug:'linux-hardening', title:"Linux Server Hardening", xp:100, minutes:40 },
    { id:'cybersecurity-05', slug:'firewall', title:"Firewall Configuration", xp:80, minutes:35 },
    { id:'cybersecurity-06', slug:'pki', title:"PKI, SSL/TLS & Certificates", xp:80, minutes:35 },
    { id:'cybersecurity-07', slug:'ids-siem', title:"Intrusion Detection & SIEM", xp:100, minutes:40 },
    { id:'cybersecurity-08', slug:'vuln-scanning', title:"Vulnerability Scanning", xp:90, minutes:35 },
    { id:'cybersecurity-09', slug:'incident-response', title:"Incident Response", xp:100, minutes:40 },
    { id:'cybersecurity-10', slug:'ad-security', title:"Active Directory Security", xp:120, minutes:50 },
]);

addCourse({ id:'troubleshooting', slug:'troubleshooting', title:"Advanced Troubleshooting", description:"Advanced Advanced Troubleshooting content, migrated from the original curriculum.", icon:'🔧', order:9 }, 'troubleshooting-m1', [
    { id:'troubleshooting-01', slug:'methodology', title:"The Troubleshooting Methodology", xp:50, minutes:20 },
    { id:'troubleshooting-02', slug:'windows', title:"Windows Troubleshooting", xp:80, minutes:35 },
    { id:'troubleshooting-03', slug:'linux', title:"Linux Troubleshooting", xp:80, minutes:35 },
    { id:'troubleshooting-04', slug:'networking', title:"Network Troubleshooting", xp:80, minutes:35 },
    { id:'troubleshooting-05', slug:'active-directory', title:"Active Directory Issues", xp:90, minutes:40 },
    { id:'troubleshooting-06', slug:'performance', title:"Performance & Capacity Issues", xp:80, minutes:35 },
]);

export const sysadminCourses = courses;
export const sysadminModules = modules;
export const sysadminLessons = lessons;
