#!/usr/bin/env python3
"""Scaffold a new content phase.

Usage:  python scripts/new_phase.py <phase> <track>
        e.g. python scripts/new_phase.py p23 sysadmin

Creates scripts/manifests/<phase>.json (empty) and prints the exact
emit_content.py config block + spine marker you need to add.
"""
import json, sys, pathlib

if len(sys.argv) < 3:
    print(__doc__)
    sys.exit(1)

phase, track = sys.argv[1], sys.argv[2]
if track not in ('helpdesk', 'sysadmin'):
    sys.exit("track must be 'helpdesk' or 'sysadmin'")

spine = 'helpdesk.ts' if track == 'helpdesk' else 'sysadmin.ts'
style = track
marker = f"{phase.upper()}-GENERATED"
num = int(''.join(filter(str.isdigit, phase)) or 0)
lessons_mig = f"{2000 + num*3:04d}_seed_{phase}_lessons.sql"
quiz_mig = f"{2000 + num*3 + 1:04d}_seed_{phase}_quizzes.sql"
sort_base = num * 1000

mpath = pathlib.Path(__file__).resolve().parent / 'manifests' / f'{phase}.json'
if mpath.exists():
    sys.exit(f"{mpath} already exists — refusing to overwrite")
mpath.write_text(json.dumps({"courses": []}, indent=2))
print(f"created {mpath}\n")

print("1) Add this to PHASES in scripts/emit_content.py:\n")
print(f"""    '{phase}': dict(
        manifest='{phase}',
        spine='src/content/curriculum/{spine}', marker='{marker}', spine_style='{style}',
        track='{track}', sort_base={sort_base},
        lessons_mig='{lessons_mig}', quiz_mig='{quiz_mig}',
        lessons_hdr='{lessons_mig} — {phase} lessons. Idempotent.',
        quiz_hdr='{quiz_mig} — {phase} quizzes. Idempotent.',
    ),""")

print(f"\n2) Insert the marker region into src/content/curriculum/{spine} before the export:\n")
print(f"// {marker}-START\n// {marker}-END\n")

print("3) Author courses into the manifest (see docs/CONTENT-PIPELINE.md), then:")
print(f"     python scripts/validate_content.py {phase}")
print(f"     python scripts/emit_content.py {phase}")
print("     npm run typecheck && npm run build")
