#!/usr/bin/env python3
"""Dependency-free structural checks; not a Markdown renderer or semantics proof."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []
paths = sorted(p for p in ROOT.rglob('*.md') if 'node_modules' not in p.parts and '.git' not in p.parts)
for path in paths:
    text = path.read_text(encoding='utf-8')
    rel = path.relative_to(ROOT)
    fences = re.findall(r'^```', text, re.M)
    if len(fences) % 2:
        errors.append(f'{rel}: unbalanced code fences')
    if len(re.findall(r'^\$\$$', text, re.M)) % 2:
        errors.append(f'{rel}: unbalanced display-math delimiters')
    without_fences = re.sub(r'^```[^\n]*\n.*?^```\s*$', '', text, flags=re.M | re.S)
    for target in re.findall(r'\]\(([^\s)]+)\)', without_fences):
        if target.startswith(('https://', 'http://', '#', 'mailto:')):
            continue
        local = target.split('#', 1)[0]
        if local and not (path.parent / local).exists():
            errors.append(f'{rel}: missing target {target}')
    for link in re.findall(r'https://github\.com/ReactiveX/rxjs/(?:blob|tree)/[^\s)]+', text):
        if not re.search(r'/(?:blob|tree)/7\.8\.2/', link):
            errors.append(f'{rel}: unpinned RxJS source link {link}')
    if rel.name != 'ROB-SN-CROSSWALK.md' and ('\\delta' in text or 'δ(' in text):
        errors.append(f'{rel}: combined notation outside the migration crosswalk')
for path in [*(ROOT / f'operators/{name}.md' for name in ('takeWhile', 'skipWhile', 'take', 'skip')), ROOT / 'templates/OPERATOR-ANALYSIS.md']:
    text = path.read_text(encoding='utf-8')
    required = ['1. State space', '2. Initial state', '3. Input alphabet', '4. Output alphabet', '5. Transition function', '6. Output function']
    positions = [text.find(heading) for heading in required]
    if -1 in positions or positions != sorted(positions):
        errors.append(f'{path.relative_to(ROOT)}: missing/out-of-order six-component headings')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'Checked {len(paths)} Markdown files: local targets, selected delimiters, source pins, and canonical vocabulary.')
print('Not checked: external link availability, full rendering, semantic correctness, or RxJS runtime parity.')
