// 视图：五十音（参考资料 + 点读）
import { KANA, type KanaSet } from '../content/content';
import { getState } from '../state/store';
import { speak } from '../speech/speech';

export function renderKana(host: HTMLElement): void {
  let set: KanaSet = 'hiragana';

  host.innerHTML = `
    <div class="section-head"><h2>五十音 · Kana</h2><p>点按发音，先建立音感</p></div>
    <div class="kana-tabs">
      <button data-k="hiragana" class="active">平假名 Hiragana</button>
      <button data-k="katakana">片假名 Katakana</button>
    </div>
    <div class="kana-grid"></div>
  `;

  const grid = host.querySelector('.kana-grid') as HTMLElement;
  const draw = (): void => {
    grid.innerHTML = KANA[set]
      .map(
        (k) => `<button class="kana" data-r="${k[1]}"><div class="jp">${k[0]}</div><div class="ro">${k[1]}</div><div class="en-s">${k[2]}</div></button>`,
      )
      .join('');
  };
  grid.addEventListener('click', (e) => {
    const k = (e.target as HTMLElement).closest('.kana') as HTMLElement | null;
    if (!k) return;
    const st = getState();
    speak(k.dataset.r ?? '', 'ja', st.settings.accent, 0.9);
  });
  host.querySelector('.kana-tabs')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-k]') as HTMLElement | null;
    if (!b) return;
    set = b.dataset.k as KanaSet;
    host.querySelectorAll('.kana-tabs button').forEach((x) => x.classList.toggle('active', (x as HTMLElement).dataset.k === set));
    draw();
  });
  draw();
}
