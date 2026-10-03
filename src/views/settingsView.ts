// View: Settings (global accent lock / rate / scoring / data)
import { getState, setState, resetToSeed } from '../state/store';
import { accentLabel } from '../state/settings';
import { toast } from '../lib/util';
import { ENGINES, engineById, speak, subscribeVoices, type VoiceMeta } from '../speech/speech';

export function renderSettings(host: HTMLElement, onAccentChange: () => void): void {
  const st = getState();
  host.innerHTML = `
    <div class="section-head"><h2>Settings</h2><p>One global accent. American and British never mix.</p></div>
    <div class="card set-group">
      <div class="set-row">
        <div><div class="set-label">English accent</div><div class="set-desc">Locked app-wide; switching updates both voice and IPA together</div></div>
        <div class="seg" id="accentSeg">
          <button data-accent="US" class="${st.settings.accent === 'US' ? 'active' : ''}">English (US)</button>
          <button data-accent="UK" class="${st.settings.accent === 'UK' ? 'active' : ''}">English (UK)</button>
        </div>
      </div>
      <div class="set-row">
        <div><div class="set-label">Speech rate</div><div class="set-desc">Speed of the standard audio</div></div>
        <div class="range-row"><input type="range" id="rateRange" min="0.5" max="1.2" step="0.1" value="${st.settings.rate}"><span id="rateVal" style="font-family:var(--f-mono);width:40px;text-align:right">${st.settings.rate}×</span></div>
      </div>
      <div class="set-row">
        <div><div class="set-label">Scoring</div><div class="set-desc">Browser speech recognition gives a rough match; your recording is the real judge</div></div>
        <div class="seg" id="scoreSeg">
          <button data-score="on" class="${st.settings.score === 'on' ? 'active' : ''}">Approx. scoring</button>
          <button data-score="off" class="${st.settings.score === 'off' ? 'active' : ''}">Listen only</button>
        </div>
      </div>
    </div>
    <div class="note">Pronunciation is guaranteed by the browser voice engine: <b>${accentLabel(st.settings.accent)}</b>. US calls an en-US voice, UK an en-GB voice, and each sentence shows the matching IPA - one accent at a time. If the exact voice is missing, it falls back to the closest standard voice.</div>

    <div class="card set-group" style="margin-top:16px">
      <div class="set-row">
        <div><div class="set-label">Voice engine</div><div class="set-desc">Compare voices by ear: each one reads the same line below. Cloud engines activate once you add an API key.</div></div>
      </div>
      <div class="engine-grid" id="engineGrid">
        ${ENGINES.map((e) => `
          <button class="engine ${st.settings.voiceEngine === e.id ? 'active' : ''}" data-engine="${e.id}">
            <div class="engine-name">${e.label}</div>
            <div class="engine-sub">${e.kind === 'local' ? `${ENGINES[0].listVoices().length} voices` : 'Needs API key'}</div>
          </button>`).join('')}
      </div>
      <div class="voice-row" id="voiceRow">
        <select id="voiceSel" class="voice-select"></select>
        <span class="voice-preview">
          <button class="btn ghost small" id="previewEn">Play EN</button>
          <button class="btn ghost small" id="previewJa">Play JA</button>
        </span>
      </div>
    </div>

    <div class="card set-group" style="margin-top:16px">
      <div class="set-row">
        <div><div class="set-label">Data</div><div class="set-desc">Training is saved in this browser (localStorage). Export a backup any time.</div></div>
        <div style="display:flex;gap:8px">
          <button class="btn ghost small" id="exportBtn">Export JSON</button>
          <button class="btn ghost small" id="resetBtn">Reset data</button>
        </div>
      </div>
    </div>
  `;

  host.querySelector('#accentSeg')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-accent]') as HTMLElement | null;
    if (!b) return;
    const s = getState();
    setState({ ...s, settings: { ...s.settings, accent: b.dataset.accent as 'US' | 'UK' } });
    host.querySelectorAll('#accentSeg button').forEach((x) => x.classList.toggle('active', (x as HTMLElement).dataset.accent === b.dataset.accent));
    toast(`Switched to ${accentLabel(b.dataset.accent as 'US' | 'UK')}`);
    onAccentChange();
  });
  host.querySelector('#rateRange')!.addEventListener('input', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    const s = getState();
    setState({ ...s, settings: { ...s.settings, rate: v } });
    host.querySelector('#rateVal')!.textContent = v + '×';
  });
  host.querySelector('#scoreSeg')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-score]') as HTMLElement | null;
    if (!b) return;
    const s = getState();
    setState({ ...s, settings: { ...s.settings, score: b.dataset.score as 'on' | 'off' } });
    host.querySelectorAll('#scoreSeg button').forEach((x) => x.classList.toggle('active', (x as HTMLElement).dataset.score === b.dataset.score));
  });
  const fillVoiceSelect = () => {
    const sel = host.querySelector('#voiceSel') as HTMLSelectElement;
    const row = host.querySelector('#voiceRow') as HTMLElement;
    const eng = engineById(getState().settings.voiceEngine);
    if (eng.kind !== 'local' || !eng.listVoices().length) {
      row.style.display = 'none';
      return;
    }
    row.style.display = 'flex';
    const byLang: Record<string, VoiceMeta[]> = {};
    eng.listVoices().forEach((v) => {
      (byLang[v.lang] = byLang[v.lang] || []).push(v);
    });
    sel.innerHTML = '';
    const auto = document.createElement('option');
    auto.value = '';
    auto.textContent = 'Auto · best match for accent';
    sel.appendChild(auto);
    Object.keys(byLang)
      .sort()
      .forEach((l) => {
        const g = document.createElement('optgroup');
        g.label = l;
        byLang[l].forEach((v) => {
          const o = document.createElement('option');
          o.value = v.id;
          o.textContent = v.name;
          if (v.id === getState().settings.voiceId) o.selected = true;
          g.appendChild(o);
        });
        sel.appendChild(g);
      });
  };
  fillVoiceSelect();
  subscribeVoices(fillVoiceSelect);

  host.querySelector('#engineGrid')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-engine]') as HTMLElement | null;
    if (!b) return;
    const id = b.dataset.engine!;
    const s = getState();
    setState({ ...s, settings: { ...s.settings, voiceEngine: id } });
    host.querySelectorAll('.engine').forEach((x) =>
      x.classList.toggle('active', (x as HTMLElement).dataset.engine === id),
    );
    const eng = engineById(id);
    if (eng.kind === 'cloud') toast(`${eng.label} needs an API key to activate`);
    fillVoiceSelect();
  });
  host.querySelector('#voiceSel')!.addEventListener('change', (e) => {
    const id = (e.target as HTMLSelectElement).value;
    const s = getState();
    setState({ ...s, settings: { ...s.settings, voiceId: id } });
  });
  host.querySelector('#previewEn')!.addEventListener('click', () =>
    speak('The strategy has a positive Sharpe ratio, but the drawdown is deep.', 'en', getState().settings.accent, 0.9),
  );
  host.querySelector('#previewJa')!.addEventListener('click', () =>
    speak('来週の会議はいつがご都合よろしいですか。', 'ja', getState().settings.accent, 0.9),
  );

  host.querySelector('#exportBtn')!.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'speaklab-data.json';
    a.click();
  });
  host.querySelector('#resetBtn')!.addEventListener('click', () => {
    if (confirm('Clear all progress and custom sentences? This cannot be undone.')) {
      const keep = getState().settings;
      resetToSeed();
      setState({ ...getState(), settings: keep });
      toast('Data reset to the default library');
      onAccentChange();
    }
  });
}
