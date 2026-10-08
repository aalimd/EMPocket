"""Refresh locally embedded Material Symbols Rounded from a pinned upstream revision.

No icon font, CDN, or runtime network dependency. Run with Python 3.
SVG geometry is preserved, with a group mapping Google's coordinates to 24×24.
"""
from pathlib import Path
import concurrent.futures
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
REVISION = '737e3324305806514d7909874fa1818ae1808232'
BASE = f'https://raw.githubusercontent.com/google/material-design-icons/{REVISION}'
SEMANTIC = {
    'cardio': 'cardiology', 'pulm': 'pulmonology', 'vascular': 'blood_pressure',
    'critical': 'emergency', 'neuro': 'neurology', 'gi': 'gastroenterology',
    'gu': 'urology', 'msk': 'orthopedics', 'airway': 'respiratory_rate',
    'ent': 'ent', 'derm': 'dermatology', 'peds': 'child_care', 'toxic': 'pill',
    'psych': 'psychology', 'endocrine': 'endocrinology', 'environ': 'device_thermostat',
    'trauma': 'emergency', 'obgyn': 'pregnancy', 'infect': 'thermometer',
    'generic': 'clinical_notes', 'home': 'library_books', 'learn': 'menu_book',
    'ecg': 'monitor_heart', 'practice': 'quiz', 'due': 'schedule', 'saved': 'bookmark',
    'check': 'check', 'completed': 'check_circle', 'chevron-right': 'chevron_right',
    'chevron-left': 'chevron_left', 'chevron-down': 'expand_more',
    'chest-pain': 'cardiology', 'dyspnea': 'pulmonology', 'hemoptysis': 'pulmonology',
    'cyanosis': 'bloodtype', 'shock': 'blood_pressure', 'palpitations': 'vital_signs',
    'edema': 'water_drop', 'limb-ischemia': 'footprint', 'headache': 'neurology',
    'dizziness': 'ent', 'ams': 'cognition', 'coma': 'airline_seat_flat',
    'seizures': 'neurology', 'weakness': 'accessibility_new', 'syncope': 'falling',
    'diplopia': 'visibility', 'focal-neurologic-deficit': 'neurology',
    'abdominal-pain': 'gastroenterology', 'gib': 'bloodtype',
    'nausea-vomiting': 'gastroenterology', 'diarrhea': 'gastroenterology',
    'constipation': 'gastroenterology', 'jaundice': 'gastroenterology',
    'pelvic-pain': 'gynecology', 'vaginal-bleeding': 'gynecology', 'scrotal-pain': 'urology',
    'flank-pain': 'nephrology', 'urinary-retention': 'urology', 'back-pain': 'orthopedics',
    'red-eye': 'visibility', 'joint-pain': 'rheumatology', 'sore-throat': 'ent',
    'airway-stridor': 'ent', 'anaphylaxis': 'allergy', 'rash': 'dermatology',
    'fever': 'thermometer', 'overdose': 'pill', 'suicidal': 'psychology',
    'hyperglycemia': 'glucose', 'heat-cold': 'device_thermostat', 'multiple-trauma': 'emergency',
    'falls-geriatric-trauma': 'elderly', 'pregnancy-emergency': 'pregnancy',
    'pediatric-fever': 'child_care', 'pediatric-respiratory-distress': 'child_care',
    'how-to-think': 'psychology', 'dont-miss': 'priority_high', 'red-flags': 'flag',
    'first-minutes': 'bolt', 'history': 'clinical_notes', 'exam': 'stethoscope',
    'workup': 'labs', 'disposition': 'move_up', 'pearls-pitfalls': 'lightbulb',
    'see-also': 'link', 'references': 'menu_book', 'study': 'edit_note',
    'ecg-patterns': 'monitor_heart', 'ecg-how': 'explore', 'ecg-red-flags': 'flag',
    'ecg-references': 'menu_book', 'ecg-related': 'link',
    'patient-all': 'groups', 'patient-pediatric': 'child_care', 'patient-pregnancy': 'pregnancy',
    'patient-geriatric': 'elderly', 'patient-immunocompromised': 'immunology', 'patient-trauma': 'healing',
    'rate-calibration': 'timer', 'rhythm-axis': 'explore', 'intervals': 'straighten',
    'hypertrophy': 'bar_chart', 'ischemia-map': 'grid_view', 'omi-equivalents': 'vital_signs',
    'toxic-metabolic-mimics': 'labs',
}
EXPLORER = {
    'ecg': 'monitor_heart', 'close': 'close', 'enlarge': 'open_in_full', 'practice': 'quiz',
    'highlights': 'ink_highlighter', 'notes': 'edit_note', 'search': 'search', 'idea': 'lightbulb',
    'target': 'my_location', 'focus': 'zoom_in', 'chart': 'show_chart', 'play': 'play_arrow',
    'bookmark': 'bookmark', 'compass': 'explore', 'shuffle': 'shuffle',
    'checklist': 'checklist', 'check': 'check', 'scale': 'balance',
}
SHELL = ['chevron_left', 'menu', 'library_books', 'menu_book', 'monitor_heart', 'bolt',
         'search', 'close', 'filter_list', 'expand_more', 'settings', 'dark_mode',
         'library_books', 'menu_book', 'monitor_heart', 'bolt', 'warning',
         'info', 'verified_user', 'menu_book']
EXTRA = ['bookmark_fill1', 'dark_mode', 'light_mode', 'chevron_left', 'expand_more']

def main():
    cache = Path(tempfile.gettempdir()) / ('em-pocket-material-' + REVISION)
    cache.mkdir(exist_ok=True)
    names = sorted(set(SEMANTIC.values()) | set(EXPLORER.values()) | set(SHELL) | set(EXTRA))
    def fetch(name):
        target = cache / (name + '.svg')
        if not target.exists():
            base_name = name.removesuffix('_fill1')
            url = f'{BASE}/symbols/web/{base_name}/materialsymbolsrounded/{name}_24px.svg'
            subprocess.run(['curl', '-fsS', '--retry', '2', url, '-o', str(target)], check=True)
        svg = target.read_text()
        assert 'viewBox="0 -960 960 960"' in svg, name
        body = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S)[1]
        assert not re.search(r'<(?:script|use|image)|\bon\w+=|https?://', body), name
        return name, '<g transform="translate(0 24) scale(.025)" fill="currentColor" stroke="none">' + body + '</g>'
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        shapes = dict(pool.map(fetch, names))
    def icon(name, cls='ui-icon'):
        return f'<svg class="{cls}" data-icon="{name}" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor" stroke="none">{shapes[name]}</svg>'
    def block(mapping, indent):
        return '\n'.join(f"{' ' * indent}'{key}': '{shapes[name]}'," for key, name in mapping.items()).rstrip(',')

    p = ROOT / 'assets/app.js'
    app = p.read_text()
    app = re.sub(r'const SEMANTIC_ICONS = \{.*?\n    \};',
                 'const SEMANTIC_ICONS = {\n' + block(SEMANTIC, 8) + '\n    };', app, count=1, flags=re.S)
    groups = {'generic':'clinical_notes', 'ecg':'monitor_heart', 'home':'library_books', 'bolt':'bolt', 'learn':'menu_book'}
    app = re.sub(r'const GROUP_SVG = \{.*?\n    \};', 'const GROUP_SVG = {\n' +
                 ',\n'.join(f"        {key}: monoSvg('{shapes[name]}')" for key,name in groups.items()) + '\n    };', app, count=1, flags=re.S)
    app = re.sub(r'const THEME_SVG = \{.*?\n    \};', 'const THEME_SVG = {\n' +
                 ',\n'.join(f"        {key}: monoSvg('{shapes[name]}')" for key,name in [('moon','dark_mode'),('sun','light_mode')]) + '\n    };', app, count=1, flags=re.S)
    app = re.sub(r'const STAR_SVG = \{.*?\n    \};', 'const STAR_SVG = {\n' +
                 "        outline: '" + icon('bookmark','save-ico bookmark-ico') + "',\n" +
                 "        filled: '" + icon('bookmark_fill1','save-ico bookmark-ico filled') + "'\n    };", app, count=1, flags=re.S)
    app = re.sub(r"const CHEVRON_BACK_SVG = '[^']*';", "const CHEVRON_BACK_SVG = '" + icon('chevron_left','ios-back-ico') + "';", app, count=1)
    app = app.replace('/* Micro-glass SVG Clinical Icons — raw emoji in data.js kept for reference, never rendered in UI. */',
                      '/* Locally embedded Material Symbols Rounded, Apache-2.0. Refresh with dev/refresh-icons.py. */')
    app = app.replace('/* ══════════ Centralized Semantic Vector Icon System (Apple HIG / SF-Symbol inspired) ══════════ */',
                      '/* One 24 px optical family for clinical topics, framework sections and controls. */')
    app = app.replace('fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"', 'fill="currentColor" stroke="none"')
    app = re.sub(r'<svg class="sec-chevron".*?</svg>', icon('expand_more','sec-chevron'), app)
    p.write_text(app)

    p = ROOT / 'assets/ecg-explorer.js'
    app = p.read_text()
    app = re.sub(r'const ICONS = \{.*?\n  \};', 'const ICONS = {\n' + block(EXPLORER, 4) + '\n  };', app, count=1, flags=re.S)
    app = app.replace('fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"', 'fill="currentColor" stroke="none"')
    p.write_text(app)

    p = ROOT / 'index.html'
    html = p.read_text()
    matches = list(re.finditer(r'<svg\b[^>]*>.*?</svg>',html,re.S))
    assert len(matches) == len(SHELL), 'Shell icon inventory changed; review the mapping before refreshing.'
    for match,name in reversed(list(zip(matches,SHELL))):
        cls = re.search(r'class="([^"]*)"', match[0])[1]
        html = html[:match.start()] + icon(name,cls) + html[match.end():]
    p.write_text(html)

    p = ROOT / 'assets/em-learning.js'
    p.write_text(re.sub(r'<svg class="ui-icon"[^>]*>.*?</svg>', icon('chevron_left'),p.read_text()))
    subprocess.run(['curl','-fsS',f'{BASE}/LICENSE','-o',str(ROOT/'assets/material-symbols-LICENSE.txt')],check=True)
    print(f'Refreshed {len(names)} locally embedded symbols from {REVISION}.')

if __name__ == '__main__':
    main()
