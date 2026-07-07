#!/usr/bin/env python3
"""Validate a content manifest before emitting.

Usage:  python scripts/validate_content.py [p18 p19 p20 ...]
        (no args = validate every manifest in scripts/manifests/)

Checks: required fields, quiz shape, difficulty enum, and — critically —
lesson/course id uniqueness WITHIN and ACROSS manifests (collision detection),
plus unique sort_order projection. Exits non-zero on any error.
"""
import json, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
MANI = ROOT / 'manifests'
DIFF = {'beginner', 'intermediate', 'advanced'}
SORT_BASE = {'p18': 2000, 'p19': 3000, 'p20': 4000}

errors: list[str] = []
warnings: list[str] = []
seen_ids: dict[str, str] = {}   # id -> "phase/course"
seen_sort: dict[int, str] = {}


def err(m): errors.append(m)
def warn(m): warnings.append(m)


def check_course(phase, c, sort_counter):
    where = f"{phase}/{c.get('id','?')}"
    for f in ('id', 'slug', 'title', 'description', 'icon', 'order', 'module_id', 'lessons'):
        if f not in c:
            err(f"{where}: course missing '{f}'")
    if c.get('difficulty') and c['difficulty'] not in DIFF:
        err(f"{where}: bad difficulty '{c['difficulty']}' (expected {DIFF})")
    if c['id'] in seen_ids:
        err(f"{where}: duplicate course id (also {seen_ids[c['id']]})")
    seen_ids[c['id']] = where

    for l in c.get('lessons', []):
        lw = f"{where}/{l.get('id','?')}"
        for f in ('id', 'slug', 'title', 'minutes', 'xp', 'content', 'quiz'):
            if f not in l:
                err(f"{lw}: lesson missing '{f}'")
        if l['id'] in seen_ids:
            err(f"{lw}: DUPLICATE lesson id (also {seen_ids[l['id']]})")
        seen_ids[l['id']] = lw
        # sort_order projection (mirrors emitter: base + running index)
        sort_counter[0] += 1
        so = SORT_BASE.get(phase, 0) + sort_counter[0]
        if so in seen_sort:
            err(f"{lw}: sort_order {so} collides with {seen_sort[so]}")
        seen_sort[so] = lw
        # content
        content = l.get('content', {})
        if not content.get('intro'):
            err(f"{lw}: content.intro empty")
        if not content.get('sections'):
            err(f"{lw}: content.sections empty")
        if not content.get('practice'):
            warn(f"{lw}: no practice task (depth guideline)")
        # quiz
        quiz = l.get('quiz', [])
        if len(quiz) < 1:
            err(f"{lw}: no quiz questions")
        for i, q in enumerate(quiz):
            qw = f"{lw} Q{i+1}"
            for f in ('p', 'o', 'ci', 'ex'):
                if f not in q:
                    err(f"{qw}: missing '{f}'")
            opts = q.get('o', [])
            if len(opts) < 2:
                err(f"{qw}: needs >=2 options")
            if not isinstance(q.get('ci'), int) or not (0 <= q.get('ci', -1) < len(opts)):
                err(f"{qw}: correct_index {q.get('ci')} out of range")


def main(phases):
    files = ([MANI / f"{p}.json" for p in phases] if phases
             else sorted(MANI.glob('*.json')))
    for f in files:
        if not f.exists():
            err(f"manifest not found: {f}")
            continue
        phase = f.stem
        man = json.loads(f.read_text())
        counter = [0]
        for c in man.get('courses', []):
            check_course(phase, c, counter)
        n_l = sum(len(c.get('lessons', [])) for c in man.get('courses', []))
        n_q = sum(len(l.get('quiz', [])) for c in man.get('courses', []) for l in c.get('lessons', []))
        print(f"  {phase}: {len(man.get('courses', []))} courses, {n_l} lessons, {n_q} quiz questions")

    for w in warnings:
        print(f"WARN  {w}")
    if errors:
        for e in errors:
            print(f"ERROR {e}")
        print(f"\n✗ {len(errors)} error(s), {len(warnings)} warning(s)")
        sys.exit(1)
    print(f"\n✓ valid — {len(seen_ids)} unique ids, {len(warnings)} warning(s)")


if __name__ == '__main__':
    main(sys.argv[1:])
