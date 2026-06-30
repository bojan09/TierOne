import type { Course, Lesson, LockRule, Module } from '@/shared/types';

// AUTO-GENERATED (P5.5) from migrated legacy lessons. Bodies are the former
// legacy pages, now stripped to pure content. Server XP authority seeded by
// supabase/migrations/0004_seed_sysadmin.sql.

const courses: Course[] = [];
const modules: Module[] = [];
const lessons: Lesson[] = [];

function addCourse(course: Omit<Course,'moduleIds'|'track'|'difficulty'>, moduleId: string, seeds: {id:string;slug:string;title:string;xp:number;minutes:number;hasQuiz?:boolean}[]) {
  const built: Lesson[] = seeds.map((s,i)=>({ id:s.id, slug:s.slug, title:s.title, courseId:course.id, moduleId, order:i+1, xp:s.xp, track:'sysadmin', difficulty:'intermediate', estimatedMinutes:s.minutes, lockRule:(i===0?{type:'none'}:{type:'sequential'}) as LockRule, hasQuiz:Boolean(s.hasQuiz) }));
  lessons.push(...built);
  modules.push({ id:moduleId, slug:moduleId, title:course.title, courseId:course.id, order:1, lessonIds:built.map(l=>l.id) });
  courses.push({ ...course, track:'sysadmin', difficulty:'intermediate', moduleIds:[moduleId] });
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

export const sysadminCourses = courses;
export const sysadminModules = modules;
export const sysadminLessons = lessons;
