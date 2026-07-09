import type { Course, Lesson, LockRule, Module } from '@/shared/types';

// Scripting & Automation track (PowerShell + Python). Generated via scripts/emit_content.py (p29).

const courses: Course[] = [];
const modules: Module[] = [];
const lessons: Lesson[] = [];

function addCourse(course: Omit<Course,'moduleIds'|'track'|'difficulty'> & { difficulty?: Course['difficulty'] }, moduleId: string, seeds: {id:string;slug:string;title:string;xp:number;minutes:number;hasQuiz?:boolean}[]) {
  const level = course.difficulty ?? 'beginner';
  const built: Lesson[] = seeds.map((s,i)=>({ id:s.id, slug:s.slug, title:s.title, courseId:course.id, moduleId, order:i+1, xp:s.xp, track:'scripting', difficulty:level, estimatedMinutes:s.minutes, lockRule:(i===0?{type:'none'}:{type:'sequential'}) as LockRule, hasQuiz:Boolean(s.hasQuiz) }));
  lessons.push(...built);
  modules.push({ id:moduleId, slug:moduleId, title:course.title, courseId:course.id, order:1, lessonIds:built.map(l=>l.id) });
  courses.push({ ...course, track:'scripting', difficulty:level, moduleIds:[moduleId] });
}

// P29-GENERATED-START
addCourse({ id:'sc-powershell-scripting', slug:'sc-powershell-scripting', title:"Scripting: PowerShell", description:"Learn PowerShell from the console to real automation — cmdlets, the object pipeline, scripts, and practical admin tasks.", icon:'⚡', order:1, difficulty:'beginner' }, 'sc-ps-m1', [
    { id:'sc-ps-01', hasQuiz:true, slug:'basics', title:"PowerShell Basics", xp:55, minutes:20 },
    { id:'sc-ps-02', hasQuiz:true, slug:'objects-pipeline', title:"Objects & the Pipeline", xp:60, minutes:22 },
    { id:'sc-ps-03', hasQuiz:true, slug:'variables-data', title:"Variables, Operators & Data", xp:55, minutes:20 },
    { id:'sc-ps-04', hasQuiz:true, slug:'flow-loops', title:"Flow Control & Loops", xp:55, minutes:20 },
    { id:'sc-ps-05', hasQuiz:true, slug:'functions-scripts', title:"Functions & Scripts", xp:60, minutes:22 },
    { id:'sc-ps-06', hasQuiz:true, slug:'automation', title:"Practical Automation", xp:65, minutes:22 },
    { id:'sc-ps-07', hasQuiz:true, slug:'error-handling', title:"Error Handling & Debugging", xp:60, minutes:22 },
    { id:'sc-ps-08', hasQuiz:true, slug:'remoting-modules', title:"Remoting & Modules", xp:60, minutes:22 },
    { id:'sc-ps-09', hasQuiz:true, slug:'real-scripts', title:"Real-World Scripts", xp:70, minutes:24 },
    { id:'sc-ps-10', hasQuiz:true, slug:'files-folders', title:"Files & Folder Automation", xp:60, minutes:22 },
    { id:'sc-ps-11', hasQuiz:true, slug:'services-processes', title:"Services & Processes", xp:60, minutes:20 },
    { id:'sc-ps-12', hasQuiz:true, slug:'events-registry', title:"Event Logs & Registry", xp:60, minutes:20 },
    { id:'sc-ps-13', hasQuiz:true, slug:'networking', title:"Networking with PowerShell", xp:60, minutes:20 },
    { id:'sc-ps-14', hasQuiz:true, slug:'ad-users', title:"Active Directory & User Management", xp:65, minutes:22 },
    { id:'sc-ps-15', hasQuiz:true, slug:'scheduled-wmi', title:"Scheduled Tasks & WMI/CIM", xp:60, minutes:20 },
    { id:'sc-ps-16', hasQuiz:true, slug:'data-formats', title:"CSV, JSON & XML", xp:60, minutes:20 },
    { id:'sc-ps-17', hasQuiz:true, slug:'capstone', title:"Capstone: Automated Health Report", xp:80, minutes:26 },
    { id:'sc-ps-18', hasQuiz:true, slug:'rest-apis', title:"REST APIs with PowerShell", xp:60, minutes:20 },
    { id:'sc-ps-19', hasQuiz:true, slug:'log-analysis', title:"Log Analysis", xp:60, minutes:20 },
    { id:'sc-ps-20', hasQuiz:true, slug:'monitoring', title:"Monitoring Scripts", xp:60, minutes:20 },
    { id:'sc-ps-21', hasQuiz:true, slug:'backup-automation', title:"Backup Automation", xp:60, minutes:20 },
    { id:'sc-ps-22', hasQuiz:true, slug:'group-policy', title:"Group Policy Automation", xp:60, minutes:18 },
    { id:'sc-ps-23', hasQuiz:true, slug:'troubleshooting', title:"Troubleshooting Toolkit", xp:60, minutes:18 },
    { id:'sc-ps-24', hasQuiz:true, slug:'modules', title:"Building Reusable Modules", xp:65, minutes:20 },
    { id:'sc-ps-25', hasQuiz:true, slug:'capstone-onboarding', title:"Capstone: Onboarding Automation", xp:85, minutes:26 }
]);

addCourse({ id:'sc-python-scripting', slug:'sc-python-scripting', title:"Scripting: Python", description:"Learn Python for IT: from syntax and data structures to files, errors, and real automation scripts.", icon:'🐍', order:2, difficulty:'beginner' }, 'sc-py-m1', [
    { id:'sc-py-01', hasQuiz:true, slug:'basics', title:"Python Basics", xp:55, minutes:20 },
    { id:'sc-py-02', hasQuiz:true, slug:'data-structures', title:"Data Types & Structures", xp:60, minutes:22 },
    { id:'sc-py-03', hasQuiz:true, slug:'control-flow', title:"Control Flow & Loops", xp:55, minutes:20 },
    { id:'sc-py-04', hasQuiz:true, slug:'functions-modules', title:"Functions & Modules", xp:60, minutes:22 },
    { id:'sc-py-05', hasQuiz:true, slug:'files-errors', title:"Files & Error Handling", xp:60, minutes:22 },
    { id:'sc-py-06', hasQuiz:true, slug:'automation', title:"IT Automation with Python", xp:65, minutes:22 },
    { id:'sc-py-07', hasQuiz:true, slug:'regex', title:"Regular Expressions", xp:60, minutes:22 },
    { id:'sc-py-08', hasQuiz:true, slug:'apis', title:"Working with APIs", xp:60, minutes:22 },
    { id:'sc-py-09', hasQuiz:true, slug:'log-parsing', title:"Log Parsing & a Mini-Project", xp:70, minutes:24 },
    { id:'sc-py-10', hasQuiz:true, slug:'lists-comprehensions', title:"Lists & Comprehensions", xp:60, minutes:20 },
    { id:'sc-py-11', hasQuiz:true, slug:'dicts-sets', title:"Dictionaries & Sets", xp:60, minutes:20 },
    { id:'sc-py-12', hasQuiz:true, slug:'csv', title:"Working with CSV", xp:60, minutes:20 },
    { id:'sc-py-13', hasQuiz:true, slug:'json', title:"Working with JSON", xp:55, minutes:18 },
    { id:'sc-py-14', hasQuiz:true, slug:'xml', title:"Working with XML", xp:55, minutes:18 },
    { id:'sc-py-15', hasQuiz:true, slug:'apis-advanced', title:"REST APIs: Auth, Pagination & Errors", xp:65, minutes:22 },
    { id:'sc-py-16', hasQuiz:true, slug:'ssh-paramiko', title:"SSH Automation with Paramiko", xp:65, minutes:22 },
    { id:'sc-py-17', hasQuiz:true, slug:'networking', title:"Network Automation", xp:60, minutes:20 },
    { id:'sc-py-18', hasQuiz:true, slug:'monitoring', title:"Monitoring with psutil", xp:60, minutes:20 },
    { id:'sc-py-19', hasQuiz:true, slug:'email-automation', title:"Email Automation", xp:60, minutes:20 },
    { id:'sc-py-20', hasQuiz:true, slug:'file-automation', title:"File & Folder Automation", xp:60, minutes:20 },
    { id:'sc-py-21', hasQuiz:true, slug:'report-generation', title:"Report Generation", xp:60, minutes:20 },
    { id:'sc-py-22', hasQuiz:true, slug:'ticket-automation', title:"Ticket Automation", xp:65, minutes:22 },
    { id:'sc-py-23', hasQuiz:true, slug:'helpdesk-automation', title:"Help Desk Automation Projects", xp:65, minutes:22 },
    { id:'sc-py-24', hasQuiz:true, slug:'sysadmin-project', title:"System Administration Project", xp:70, minutes:22 },
    { id:'sc-py-25', hasQuiz:true, slug:'capstone', title:"Capstone: Server Health Monitor", xp:85, minutes:26 }
]);
// P29-GENERATED-END

export const scriptingCourses = courses;
export const scriptingModules = modules;
export const scriptingLessons = lessons;
