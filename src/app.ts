// 应用路由与装配：导航 → 视图 → 方法控制器
import type { Lang } from './content/content';
import { $ } from './lib/util';
import { renderDashboard } from './views/dashboard';
import { renderLibrary } from './views/library';
import { renderKana } from './views/kana';
import { renderSettings } from './views/settingsView';
import { Shadowing } from './methods/shadowing';
import { FourThreeTwo } from './methods/fourThreeTwo';
import { MinimalPairs } from './methods/minimalPairs';
import { TimedMonologue } from './methods/monologue';
import type { PracticeController, PracticeFactory } from './methods/types';
import { getState } from './state/store';
import { accentLabel } from './state/settings';

type ViewId = 'dashboard' | 'en' | 'ja' | 'library' | 'settings';

interface MethodEntry {
  id: string;
  label: string;
  create: PracticeFactory;
}

const EN_METHODS: MethodEntry[] = [
  { id: 'shadowing', label: '影子跟读', create: (l) => new Shadowing(l) },
  { id: 'fourThreeTwo', label: '4/3/2 复述', create: (l) => new FourThreeTwo(l) },
  { id: 'minimalPairs', label: '最小对立对', create: () => new MinimalPairs() },
  { id: 'monologue', label: '限时独白', create: (l) => new TimedMonologue(l) },
];
const JA_METHODS: MethodEntry[] = [
  { id: 'shadowing', label: '影子跟读', create: (l) => new Shadowing(l) },
  { id: 'fourThreeTwo', label: '4/3/2 复述', create: (l) => new FourThreeTwo(l) },
  { id: 'monologue', label: '限时独白', create: (l) => new TimedMonologue(l) },
];

let activeLang: Lang | null = null;
let activeEntry: MethodEntry | null = null;
let activeMethod: PracticeController | null = null;

function destroyMethod(): void {
  activeMethod?.destroy();
  activeMethod = null;
  activeLang = null;
  activeEntry = null;
}

function mountMethod(lang: Lang, entry: MethodEntry, host: HTMLElement): void {
  destroyMethod();
  activeLang = lang;
  activeEntry = entry;
  activeMethod = entry.create(lang);
  host.innerHTML = '';
  activeMethod.mount(host);
}

export function renderLangView(lang: Lang): void {
  const main = $<HTMLElement>('main');
  const entries = lang === 'en' ? EN_METHODS : JA_METHODS;
  main.innerHTML = `
    <div class="train-head">
      <div class="section-head" style="margin:0">
        <h2>${lang === 'en' ? 'English Speaking · 英语口语' : '日本語 Speaking · 日语口语'}</h2>
        <p>${lang === 'en' ? '跟读 · 复述 · 发音 · 独白' : '英语为桥，先开口再说'} · <span class="accent-pill" style="padding:3px 10px;font-size:11.5px"><span class="accent-dot"></span><span id="langAccentLabel">${accentLabel(getState().settings.accent)}</span></span></p>
      </div>
      <div class="mode-tabs" id="methodTabs">
        ${entries.map((m, i) => `<button data-f="${i}" class="${i === 0 ? 'active' : ''}">${m.label}</button>`).join('')}
      </div>
    </div>
    <div id="methodHost"></div>
    ${lang === 'ja' ? '<div style="margin-top:26px" id="kanaHost"></div>' : ''}
  `;
  const host = $<HTMLElement>('methodHost');
  mountMethod(lang, entries[0], host);
  if (lang === 'ja') renderKana($<HTMLElement>('kanaHost'));

  $<HTMLElement>('methodTabs').addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-f]') as HTMLElement | null;
    if (!b) return;
    const entry = entries[Number(b.dataset.f)];
    document.querySelectorAll('#methodTabs button').forEach((x) => x.classList.toggle('active', (x as HTMLElement).dataset.f === b.dataset.f));
    mountMethod(lang, entry, host);
  });
}

export function route(view: ViewId): void {
  destroyMethod();
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', (t as HTMLElement).dataset.view === view));
  window.scrollTo(0, 0);
  const main = $<HTMLElement>('main');
  if (view === 'dashboard') renderDashboard(main);
  else if (view === 'en' || view === 'ja') renderLangView(view);
  else if (view === 'library') renderLibrary(main);
  else if (view === 'settings') {
    renderSettings(main, () => {
      // 口音切换后，刷新当前练习的注音
      if (activeLang && activeEntry) {
        const host = $<HTMLElement>('methodHost');
        mountMethod(activeLang, activeEntry, host);
        const lbl = $<HTMLElement>('langAccentLabel');
        if (lbl) lbl.textContent = accentLabel(getState().settings.accent);
      }
    });
  }
}

export function init(): void {
  document.querySelectorAll('.tab').forEach((t) =>
    t.addEventListener('click', () => route((t as HTMLElement).dataset.view as ViewId)),
  );
  document.addEventListener('click', (e) => {
    const go = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null;
    if (go) route(go.dataset.go as ViewId);
  });
  route('dashboard');
}
