// View: Settings (global accent lock / rate / scoring / data)
import { getState, setState, resetToSeed } from '../state/store';
import { accentLabel } from '../state/settings';
import { toast } from '../lib/util';

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
