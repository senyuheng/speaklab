// View: Library (search / add / batch import / delete / listen)
import type { Sentence } from '../content/content';
import { getState, setState } from '../state/store';
import { speak } from '../speech/speech';
import { uid, toast } from '../lib/util';

export function renderLibrary(host: HTMLElement): void {
  host.innerHTML = `
    <div class="section-head"><h2>Library</h2><p>Every sentence you practice lives here - add, import, delete</p></div>
    <div class="lib-toolbar">
      <input type="text" id="libSearch" placeholder="Search sentences or glosses...">
      <button class="btn primary" id="libAddBtn">+ Add sentence</button>
      <button class="btn ghost" id="libImportBtn">Import text</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table class="lib">
        <colgroup><col class="c-lang"><col class="c-jp"><col class="c-en"><col class="c-act"><col class="c-prog"></colgroup>
        <thead><tr><th>Language</th><th>Sentence</th><th>English gloss</th><th>Listen</th><th>Mastery</th></tr></thead>
        <tbody id="libBody"></tbody>
      </table>
      <div class="empty" id="libEmpty" style="display:none">No sentences yet. Click "Add sentence" to start building your speaking library.</div>
    </div>
    <div class="set-group" style="margin-top:22px;max-width:640px">
      <div class="section-head"><h2>Batch import</h2><p>Paste sentences, one per line</p></div>
      <div class="card" id="importBox" style="display:none">
        <textarea id="importArea" rows="6" style="width:100%;border:1px solid var(--line-strong);border-radius:12px;padding:12px;font-size:13.5px;resize:vertical" placeholder="English sentence :: English gloss&#10;Japanese :: English gloss :: romaji"></textarea>
        <div style="display:flex;gap:10px;margin-top:10px;justify-content:flex-end">
          <button class="btn ghost" id="importCancel">Cancel</button>
          <button class="btn primary" id="importOk">Import</button>
        </div>
      </div>
    </div>
  `;

  const body = host.querySelector('#libBody') as HTMLElement;
  const empty = host.querySelector('#libEmpty') as HTMLElement;
  const search = host.querySelector('#libSearch') as HTMLInputElement;
  const importBox = host.querySelector('#importBox') as HTMLElement;

  const draw = (): void => {
    const q = search.value.toLowerCase();
    const list = getState().sentences.filter((s) => {
      const head = s.lang === 'en' ? (s as { en: string }).en : (s as { jp: string }).jp;
      const hay = `${head} ${(s as { romaji?: string }).romaji ?? ''} ${s.gloss}`;
      return !q || hay.toLowerCase().includes(q);
    });
    empty.style.display = list.length ? 'none' : 'block';
    body.innerHTML = list
      .map((s) => {
        const n = getState().prog[s.id]?.count ?? 0;
        const head = s.lang === 'en' ? (s as { en: string }).en : (s as { jp: string }).jp;
        const rom = (s as { romaji?: string }).romaji;
        return `<tr>
          <td>${s.lang === 'en' ? '<span class="pill-tag en">EN</span>' : '<span class="pill-tag ja">JA</span>'}</td>
          <td>${head}${rom ? `<div style="color:var(--muted);font-size:12px">${rom}</div>` : ''}</td>
          <td>${s.gloss || '—'}</td>
          <td style="white-space:nowrap"><button class="ico-btn speak" data-id="${s.id}">▶</button><button class="ico-btn" data-del="${s.id}">✕</button></td>
          <td><div class="mini-prog"><i style="width:${Math.min(100, n * 20)}%"></i></div><div style="font-size:11px;color:var(--muted);margin-top:3px">${n}×</div></td>
        </tr>`;
      })
      .join('');
  };

  search.addEventListener('input', draw);
  host.querySelector('#libAddBtn')!.addEventListener('click', () => {
    importBox.style.display = importBox.style.display === 'block' ? 'none' : 'block';
    importBox.scrollIntoView({ behavior: 'smooth' });
  });
  host.querySelector('#libImportBtn')!.addEventListener('click', () => {
    importBox.style.display = 'block';
    importBox.scrollIntoView({ behavior: 'smooth' });
  });
  host.querySelector('#importCancel')!.addEventListener('click', () => (importBox.style.display = 'none'));
  host.querySelector('#importOk')!.addEventListener('click', () => {
    const area = host.querySelector('#importArea') as HTMLTextAreaElement;
    const added = parseImport(area.value);
    if (!added.length) return toast('Nothing to import');
    setState({ ...getState(), sentences: [...getState().sentences, ...added] });
    area.value = '';
    importBox.style.display = 'none';
    toast(`Added ${added.length} sentence${added.length > 1 ? 's' : ''}`);
    draw();
  });

  body.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-id],[data-del]') as HTMLElement | null;
    if (!btn) return;
    if (btn.hasAttribute('data-id')) {
      const s = getState().sentences.find((x) => x.id === btn.dataset.id);
      if (s) speak(s.lang === 'en' ? (s as { en: string }).en : (s as { jp: string }).jp, s.lang, getState().settings.accent, getState().settings.rate);
    } else if (btn.hasAttribute('data-del')) {
      const id = btn.dataset.del!;
      const s = getState().sentences.find((x) => x.id === id);
      if (s && confirm('Delete this sentence?\n' + (s.lang === 'en' ? (s as { en: string }).en : (s as { jp: string }).jp))) {
        setState({
          ...getState(),
          sentences: getState().sentences.filter((x) => x.id !== id),
        });
        draw();
      }
    }
  });

  draw();
}

function parseImport(text: string): Sentence[] {
  const added: Sentence[] = [];
  text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const p = line.split('::').map((x) => x.trim());
      if (!p[0]) return;
      if (/[\u3040-\u30ff]/.test(p[0])) {
        added.push({ id: uid(), lang: 'ja', cat: 3, jp: p[0], gloss: p[1] || '', romaji: p[2] || '' });
      } else {
        added.push({ id: uid(), lang: 'en', cat: 3, en: p[0], gloss: p[1] || '', ipaUs: '', ipaUk: '' });
      }
    });
  return added;
}
