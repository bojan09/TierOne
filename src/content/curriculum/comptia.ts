import type { Course, Lesson, LockRule, Module } from '@/shared/types';

// CompTIA A+ certification track. Content is generated via scripts/emit_content.py (p28).

const courses: Course[] = [];
const modules: Module[] = [];
const lessons: Lesson[] = [];

function addCourse(course: Omit<Course,'moduleIds'|'track'|'difficulty'> & { difficulty?: Course['difficulty'] }, moduleId: string, seeds: {id:string;slug:string;title:string;xp:number;minutes:number;hasQuiz?:boolean}[]) {
  const level = course.difficulty ?? 'beginner';
  const built: Lesson[] = seeds.map((s,i)=>({ id:s.id, slug:s.slug, title:s.title, courseId:course.id, moduleId, order:i+1, xp:s.xp, track:'comptia', difficulty:level, estimatedMinutes:s.minutes, lockRule:{type:'none'} as LockRule, hasQuiz:Boolean(s.hasQuiz) }));
  lessons.push(...built);
  modules.push({ id:moduleId, slug:moduleId, title:course.title, courseId:course.id, order:1, lessonIds:built.map(l=>l.id) });
  courses.push({ ...course, track:'comptia', difficulty:level, moduleIds:[moduleId] });
}

// P28-GENERATED-START
addCourse({ id:'ca-hardware', slug:'ca-hardware', title:"CompTIA A+: PC Hardware", description:"Core 1 hardware: the CPU, motherboard, memory, storage, power, and the connectors that tie a PC together.", icon:'🧩', order:1, difficulty:'beginner' }, 'ca-hw-m1', [
    { id:'ca-hw-01', hasQuiz:true, slug:'cpu-motherboard', title:"CPUs & Motherboards", xp:50, minutes:20 },
    { id:'ca-hw-02', hasQuiz:true, slug:'memory-storage', title:"Memory & Storage", xp:50, minutes:20 },
    { id:'ca-hw-03', hasQuiz:true, slug:'power-connectors', title:"Power, Connectors & Peripherals", xp:50, minutes:20 },
    { id:'ca-hw-04', hasQuiz:true, slug:'display-video', title:"Display & Video", xp:50, minutes:18 },
    { id:'ca-hw-05', hasQuiz:true, slug:'printers', title:"Printers & Multifunction Devices", xp:55, minutes:20 },
    { id:'ca-hw-06', hasQuiz:true, slug:'custom-raid', title:"Custom Configurations & RAID", xp:50, minutes:18 },
    { id:'ca-hw-07', hasQuiz:true, slug:'bios-uefi', title:"BIOS/UEFI & Boot", xp:50, minutes:18 }
]);

addCourse({ id:'ca-net', slug:'ca-net', title:"CompTIA A+: Networking Basics", description:"Core 1 networking at A+ depth: addressing, ports and protocols, cabling, and small-office/home wireless.", icon:'🌐', order:2, difficulty:'beginner' }, 'ca-net-m1', [
    { id:'ca-net-01', hasQuiz:true, slug:'fundamentals', title:"Networking Fundamentals", xp:50, minutes:20 },
    { id:'ca-net-02', hasQuiz:true, slug:'cabling', title:"Cabling & Connectors", xp:50, minutes:18 },
    { id:'ca-net-03', hasQuiz:true, slug:'wireless-soho', title:"Wireless & SOHO Networks", xp:50, minutes:20 },
    { id:'ca-net-04', hasQuiz:true, slug:'devices', title:"Network Devices", xp:50, minutes:18 },
    { id:'ca-net-05', hasQuiz:true, slug:'tcpip-services', title:"TCP/IP & Network Services", xp:55, minutes:20 },
    { id:'ca-net-06', hasQuiz:true, slug:'internet-types', title:"Internet Connection Types", xp:50, minutes:16 },
    { id:'ca-net-07', hasQuiz:true, slug:'ports-protocols', title:"Ports & Protocols (Deep)", xp:50, minutes:18 }
]);

addCourse({ id:'ca-mc', slug:'ca-mc', title:"CompTIA A+: Mobile, Virtualization & Cloud", description:"Mobile device support plus the virtualization and cloud concepts now core to Core 1.", icon:'📱', order:3, difficulty:'beginner' }, 'ca-mc-m1', [
    { id:'ca-mc-01', hasQuiz:true, slug:'mobile', title:"Mobile Devices", xp:50, minutes:18 },
    { id:'ca-mc-02', hasQuiz:true, slug:'virtualization', title:"Virtualization", xp:50, minutes:18 },
    { id:'ca-mc-03', hasQuiz:true, slug:'cloud', title:"Cloud Concepts", xp:50, minutes:18 },
    { id:'ca-mc-04', hasQuiz:true, slug:'mobile-connectivity', title:"Mobile Connectivity & Email", xp:50, minutes:18 },
    { id:'ca-mc-05', hasQuiz:true, slug:'mobile-sync-security', title:"Mobile Sync & Security", xp:50, minutes:18 },
    { id:'ca-mc-06', hasQuiz:true, slug:'laptop-hardware', title:"Laptop Hardware", xp:50, minutes:18 },
    { id:'ca-mc-07', hasQuiz:true, slug:'cloud-models-deep', title:"Cloud Models (Deep)", xp:50, minutes:18 }
]);

addCourse({ id:'ca-os', slug:'ca-os', title:"CompTIA A+: Operating Systems", description:"Core 2 operating systems: types, installation, Windows configuration, and the command line.", icon:'🪟', order:4, difficulty:'beginner' }, 'ca-os-m1', [
    { id:'ca-os-01', hasQuiz:true, slug:'types-install', title:"OS Types & Installation", xp:50, minutes:20 },
    { id:'ca-os-02', hasQuiz:true, slug:'windows-config', title:"Windows Configuration", xp:50, minutes:20 },
    { id:'ca-os-03', hasQuiz:true, slug:'command-line', title:"Command-Line Basics", xp:50, minutes:20 },
    { id:'ca-os-04', hasQuiz:true, slug:'macos-linux', title:"macOS & Linux Basics", xp:50, minutes:18 },
    { id:'ca-os-05', hasQuiz:true, slug:'windows-networking', title:"Windows Networking Configuration", xp:50, minutes:18 },
    { id:'ca-os-06', hasQuiz:true, slug:'users-security', title:"OS Security & User Management", xp:50, minutes:18 },
    { id:'ca-os-07', hasQuiz:true, slug:'windows-tools', title:"Windows Tools & Utilities", xp:50, minutes:18 }
]);

addCourse({ id:'ca-sec', slug:'ca-sec', title:"CompTIA A+: Security", description:"Core 2 security: threats and malware, best practices, and protecting devices and data.", icon:'🛡️', order:5, difficulty:'beginner' }, 'ca-sec-m1', [
    { id:'ca-sec-01', hasQuiz:true, slug:'threats-malware', title:"Security Threats & Malware", xp:55, minutes:20 },
    { id:'ca-sec-02', hasQuiz:true, slug:'best-practices', title:"Security Best Practices", xp:55, minutes:20 },
    { id:'ca-sec-03', hasQuiz:true, slug:'physical-data', title:"Physical & Data Security", xp:55, minutes:18 },
    { id:'ca-sec-04', hasQuiz:true, slug:'wireless-auth', title:"Wireless Security & Authentication", xp:55, minutes:18 },
    { id:'ca-sec-05', hasQuiz:true, slug:'malware-removal', title:"Malware Removal Process", xp:55, minutes:18 },
    { id:'ca-sec-06', hasQuiz:true, slug:'social-engineering', title:"Social Engineering & Common Threats", xp:55, minutes:18 },
    { id:'ca-sec-07', hasQuiz:true, slug:'access-control', title:"Authentication & Access Control", xp:55, minutes:18 }
]);

addCourse({ id:'ca-ts', slug:'ca-ts', title:"CompTIA A+: Troubleshooting", description:"The A+ troubleshooting methodology plus the most common hardware and software issues.", icon:'🔧', order:6, difficulty:'beginner' }, 'ca-ts-m1', [
    { id:'ca-ts-01', hasQuiz:true, slug:'methodology', title:"Troubleshooting Methodology", xp:55, minutes:18 },
    { id:'ca-ts-02', hasQuiz:true, slug:'hardware-issues', title:"Common Hardware Issues", xp:55, minutes:18 },
    { id:'ca-ts-03', hasQuiz:true, slug:'software-issues', title:"Common OS & Software Issues", xp:55, minutes:18 },
    { id:'ca-ts-04', hasQuiz:true, slug:'network-ts', title:"Network Troubleshooting", xp:55, minutes:18 },
    { id:'ca-ts-05', hasQuiz:true, slug:'printer-ts', title:"Printer Troubleshooting", xp:50, minutes:16 },
    { id:'ca-ts-06', hasQuiz:true, slug:'mobile-security-ts', title:"Mobile & Security Troubleshooting", xp:50, minutes:16 },
    { id:'ca-ts-07', hasQuiz:true, slug:'boot-recovery', title:"Boot & OS Recovery", xp:55, minutes:18 }
]);
// P28-GENERATED-END

export const comptiaCourses = courses;
export const comptiaModules = modules;
export const comptiaLessons = lessons;
