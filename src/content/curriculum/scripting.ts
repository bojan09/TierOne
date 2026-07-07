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
    { id:'sc-ps-06', hasQuiz:true, slug:'automation', title:"Practical Automation", xp:65, minutes:22 }
]);

addCourse({ id:'sc-python-scripting', slug:'sc-python-scripting', title:"Scripting: Python", description:"Learn Python for IT: from syntax and data structures to files, errors, and real automation scripts.", icon:'🐍', order:2, difficulty:'beginner' }, 'sc-py-m1', [
    { id:'sc-py-01', hasQuiz:true, slug:'basics', title:"Python Basics", xp:55, minutes:20 },
    { id:'sc-py-02', hasQuiz:true, slug:'data-structures', title:"Data Types & Structures", xp:60, minutes:22 },
    { id:'sc-py-03', hasQuiz:true, slug:'control-flow', title:"Control Flow & Loops", xp:55, minutes:20 },
    { id:'sc-py-04', hasQuiz:true, slug:'functions-modules', title:"Functions & Modules", xp:60, minutes:22 },
    { id:'sc-py-05', hasQuiz:true, slug:'files-errors', title:"Files & Error Handling", xp:60, minutes:22 },
    { id:'sc-py-06', hasQuiz:true, slug:'automation', title:"IT Automation with Python", xp:65, minutes:22 }
]);
// P29-GENERATED-END

export const scriptingCourses = courses;
export const scriptingModules = modules;
export const scriptingLessons = lessons;
