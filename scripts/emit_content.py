#!/usr/bin/env python3
"""Config-driven emitter: emit_content.py <phase>.
Turns /home/claude/<phase>_manifest.json into structured TS content, a spine
region, and seed migrations. Phase-agnostic index.ts (scans all area files),
so multiple phases coexist. Idempotent."""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
STRUCT = ROOT / 'src/content/lessons/structured'

PHASES = {
    'p18': dict(
        manifest='p18',
        spine='src/content/curriculum/sysadmin.ts', marker='P18-GENERATED', spine_style='sysadmin',
        track='sysadmin', sort_base=2000,
        lessons_mig='0029_seed_winserver_lessons.sql', quiz_mig='0030_seed_winserver_quizzes.sql',
        lessons_hdr='0029_seed_winserver_lessons.sql — P18 Windows Server expansion (curriculum_lessons XP authority). Idempotent.',
        quiz_hdr='0030_seed_winserver_quizzes.sql — P18 Windows Server quizzes. Idempotent.',
    ),
    'p19': dict(
        manifest='p19',
        spine='src/content/curriculum/sysadmin.ts', marker='P19-GENERATED', spine_style='sysadmin',
        track='sysadmin', sort_base=3000,
        lessons_mig='0032_seed_networking_lessons.sql', quiz_mig='0033_seed_networking_quizzes.sql',
        lessons_hdr='0032_seed_networking_lessons.sql — P19 Networking expansion (curriculum_lessons XP authority). Idempotent.',
        quiz_hdr='0033_seed_networking_quizzes.sql — P19 Networking quizzes. Idempotent.',
    ),
    'p29': dict(
        manifest='p29',
        spine='src/content/curriculum/scripting.ts', marker='P29-GENERATED', spine_style='sysadmin',
        track='scripting', sort_base=6000,
        lessons_mig='0048_seed_scripting_lessons.sql', quiz_mig='0049_seed_scripting_quizzes.sql',
        lessons_hdr='0048_seed_scripting_lessons.sql — P29 Scripting lessons. Idempotent.',
        quiz_hdr='0049_seed_scripting_quizzes.sql — P29 Scripting quizzes. Idempotent.',
    ),
    'p28': dict(
        manifest='p28',
        spine='src/content/curriculum/comptia.ts', marker='P28-GENERATED', spine_style='sysadmin',
        track='comptia', sort_base=5000,
        lessons_mig='0045_seed_comptia_lessons.sql', quiz_mig='0046_seed_comptia_quizzes.sql',
        lessons_hdr='0045_seed_comptia_lessons.sql — P28 CompTIA A+ lessons. Idempotent.',
        quiz_hdr='0046_seed_comptia_quizzes.sql — P28 CompTIA A+ quizzes. Idempotent.',
    ),
    'p33': dict(
        manifest='p33',
        spine='src/content/curriculum/helpdesk.ts', marker='P33-GENERATED', spine_style='helpdesk',
        track='helpdesk', sort_base=7000,
        lessons_mig='0054_seed_helpdesk_t01_lessons.sql', quiz_mig='0055_seed_helpdesk_t01_quizzes.sql',
        lessons_hdr='0054_seed_helpdesk_t01_lessons.sql — P33 Help Desk Tier 0/1 practical lessons. Idempotent.',
        quiz_hdr='0055_seed_helpdesk_t01_quizzes.sql — P33 Help Desk Tier 0/1 quizzes. Idempotent.',
    ),
    'p20': dict(
        manifest='p20',
        spine='src/content/curriculum/helpdesk.ts', marker='P20-GENERATED', spine_style='helpdesk',
        track='helpdesk', sort_base=4000,
        lessons_mig='0035_seed_helpdesk_tier2_lessons.sql', quiz_mig='0036_seed_helpdesk_tier2_quizzes.sql',
        lessons_hdr='0035_seed_helpdesk_tier2_lessons.sql — P20 Help Desk Tier 2 (curriculum_lessons XP authority). Idempotent.',
        quiz_hdr='0036_seed_helpdesk_tier2_quizzes.sql — P20 Help Desk Tier 2 quizzes. Idempotent.',
    ),
}

def var_for(area): return re.sub(r'[^a-zA-Z0-9]', '', area) + 'Lessons'

def emit(phase):
    cfg = PHASES[phase]
    man = json.loads((pathlib.Path(__file__).resolve().parent / 'manifests' / (cfg['manifest'] + '.json')).read_text())
    courses = man['courses']
    STRUCT.mkdir(parents=True, exist_ok=True)

    # 1) content TS file per course (this phase's areas)
    for c in courses:
        content_map = {les['id']: les['content'] for les in c['lessons']}
        body = json.dumps(content_map, ensure_ascii=False, indent=2)
        ts = ("import type { LessonContent } from '../model';\n\n"
              f"export const {var_for(c['area'])}: Record<string, LessonContent> = {body};\n")
        (STRUCT / f"{c['area']}.ts").write_text(ts)

    # 2) phase-agnostic index.ts: scan ALL area files present
    areas = sorted(p.stem for p in STRUCT.glob('*.ts') if p.stem != 'index')
    imports = [f"import {{ {var_for(a)} }} from './{a}';" for a in areas]
    spread = [f"  ...{var_for(a)}," for a in areas]
    (STRUCT / 'index.ts').write_text(
        "import type { LessonContent } from '../model';\n" + "\n".join(imports)
        + "\n\nexport const structuredLessons: Record<string, LessonContent> = {\n"
        + "\n".join(spread) + "\n};\n")

    # 3) spine region (this phase's marker)
    blocks = []
    for c in courses:
        seeds = ",\n".join(
            "    {{ id:'{id}', hasQuiz:true, slug:'{slug}', title:{title}, xp:{xp}, minutes:{minutes} }}".format(
                id=l['id'], slug=l['slug'], title=json.dumps(l['title'], ensure_ascii=False), xp=l['xp'], minutes=l['minutes'])
            for l in c['lessons'])
        diff = ", difficulty:'%s'" % c['difficulty'] if c.get('difficulty') else ''
        head = ("addCourse({{ id:'{cid}', slug:'{cslug}', title:{ctitle}, description:{cdesc}, icon:'{icon}', order:{order}{diff} }}".format(
            cid=c['id'], cslug=c['slug'], ctitle=json.dumps(c['title'], ensure_ascii=False),
            cdesc=json.dumps(c['description'], ensure_ascii=False), icon=c['icon'], order=c['order'], diff=diff))
        if cfg['spine_style'] == 'helpdesk':
            mslug = c.get('module_slug', c['module_id'])
            mtitle = json.dumps(c.get('module_title', c['title']), ensure_ascii=False)
            blocks.append(f"{head}, '{c['module_id']}', '{mslug}', {mtitle}, [\n{seeds}\n]);")
        else:
            blocks.append(f"{head}, '{c['module_id']}', [\n{seeds}\n]);")
    spine_path = ROOT / cfg['spine']; spine = spine_path.read_text()
    mk = cfg['marker']
    region = f"// {mk}-START\n" + "\n\n".join(blocks) + f"\n// {mk}-END"
    if f"// {mk}-START" not in spine:
        raise SystemExit(f"marker // {mk}-START not found in {cfg['spine']} — insert it once before export.")
    spine = re.sub(rf"// {mk}-START.*?// {mk}-END", region, spine, flags=re.S)
    spine_path.write_text(spine)

    # 4) seeds
    def esc(s): return s.replace("'", "''")
    lesson_rows, quiz_cfg, quiz_rows, all_ids = [], [], [], []
    sort = cfg['sort_base']
    for c in courses:
        for l in c['lessons']:
            sort += 1; all_ids.append(l['id'])
            lesson_rows.append("  ('{id}', '{slug}', '{title}', '{trk}', {xp}, {so})".format(
                id=l['id'], slug=l['slug'], title=esc(l['title']), trk=cfg['track'], xp=l['xp'], so=sort))
            quiz_cfg.append("  ('{id}', 70, 30)".format(id=l['id']))
            for i, q in enumerate(l['quiz'], 1):
                quiz_rows.append("  ('{id}', {i}, '{p}', '{o}'::jsonb, {ci}, '{ex}')".format(
                    id=l['id'], i=i, p=esc(q['p']), o=esc(json.dumps(q['o'])), ci=q['ci'], ex=esc(q['ex'])))
    mig = ROOT / 'supabase/migrations'
    (mig / cfg['lessons_mig']).write_text(
        f"-- {cfg['lessons_hdr']}\n"
        "insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values\n"
        + ",\n".join(lesson_rows)
        + "\non conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track, xp=excluded.xp, sort_order=excluded.sort_order;\n")
    ids_in = ", ".join("'%s'" % i for i in all_ids)
    (mig / cfg['quiz_mig']).write_text(
        f"-- {cfg['quiz_hdr']}\n"
        "insert into public.lesson_quizzes (lesson_id, pass_pct, bonus_xp) values\n"
        + ",\n".join(quiz_cfg)
        + "\non conflict (lesson_id) do update set pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;\n\n"
        + f"delete from public.quiz_questions where lesson_id in ({ids_in});\n\n"
        "insert into public.quiz_questions (lesson_id, sort, prompt, options, correct_index, explanation) values\n"
        + ",\n".join(quiz_rows) + ";\n")
    print(f"[{phase}] emitted: {len(courses)} courses, {sum(len(c['lessons']) for c in courses)} lessons, {len(quiz_rows)} quiz questions")

if __name__ == '__main__':
    ph = sys.argv[1] if len(sys.argv) > 1 else None
    if ph not in PHASES:
        raise SystemExit(f"usage: emit_content.py <{'|'.join(PHASES)}>")
    emit(ph)
