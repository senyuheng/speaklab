// Method: 4/3/2 (Maurice, 1983). Retell the same content 3 times, time drops 4 -> 3 -> 2 min.
import type { Lang, Sentence } from '../content/content';
import { getState } from '../state/store';
import { RecordingController } from '../speech/speech';
import { recordPractice } from '../state/store';
import type { PracticeController } from './types';

const ROUNDS = [
  { label: 'Round 1 · 4 min', sec: 240 },
  { label: 'Round 2 · 3 min', sec: 180 },
  { label: 'Round 3 · 2 min', sec: 120 },
];

export class FourThreeTwo implements PracticeController {
  readonly id = 'fourThreeTwo';
  readonly label = '4/3/2 Retelling';
  readonly lang: Lang;
  private host!: HTMLElement;
  private material: Sentence[] = [];
  private roundIdx = 0;
  private timeLeft = 0;
  private timer: number | null = null;
  private rec = new RecordingController();
  private roundStats: { words: number; sec: number }[] = [];

  constructor(lang: Lang) {
    this.lang = lang;
  }

  mount(host: HTMLElement): void {
    this.host = host;
    const st = getState();
    this.material = st.sentences.filter((s) => s.lang === this.lang);
    this.render();
  }

  destroy(): void {
    this.clearTimer();
    if (this.rec.recording) this.rec.stop(() => undefined);
    this.host.innerHTML = '';
  }

  private text(s: Sentence): string {
    return this.lang === 'en' ? (s as { en: string }).en : (s as { jp: string }).jp;
  }

  private render(): void {
    this.host.innerHTML = `
      <div class="f432">
        <div class="panel" style="margin-bottom:16px">
          <h4>Source material (retell it aloud)</h4>
          <div class="f432-material">
            ${this.material.map((s) => `<div class="f432-line">${this.text(s)}</div>`).join('')}
          </div>
        </div>
        <div class="lesson">
          <div class="f432-round" data-role="roundLabel">${ROUNDS[0].label}</div>
          <div class="f432-timer" data-role="timer">04:00</div>
          <div class="controls">
            <button class="ctrl-btn" data-act="startRound">Start round (timer + recording)</button>
            <button class="ctrl-btn done" data-act="stopRound" disabled>Stop round</button>
          </div>
          <div class="score-box on" data-role="result" style="margin-top:14px"></div>
          <div class="f432-progress" data-role="progress"></div>
        </div>
      </div>
    `;
    this.host.querySelector('[data-act="startRound"]')!.addEventListener('click', () => this.startRound());
    this.host.querySelector('[data-act="stopRound"]')!.addEventListener('click', () => void this.stopRound());
  }

  private fmt(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  private startRound(): void {
    if (this.roundIdx >= ROUNDS.length) {
      this.host.querySelector('[data-role="roundLabel"]')!.textContent = 'All three rounds done.';
      return;
    }
    const st = getState();
    const btn = this.host.querySelector('[data-act="startRound"]') as HTMLButtonElement;
    const stopBtn = this.host.querySelector('[data-act="stopRound"]') as HTMLButtonElement;
    btn.disabled = true;
    stopBtn.disabled = false;
    this.timeLeft = ROUNDS[this.roundIdx].sec;
    this.host.querySelector('[data-role="timer"]')!.textContent = this.fmt(this.timeLeft);
    this.host.querySelector('[data-role="result"]')!.innerHTML = '';
    void this.rec.start(this.lang, st.settings.accent, true);
    this.clearTimer();
    this.timer = window.setInterval(() => {
      this.timeLeft--;
      this.host.querySelector('[data-role="timer"]')!.textContent = this.fmt(Math.max(0, this.timeLeft));
      if (this.timeLeft <= 0) void this.stopRound();
    }, 1000);
  }

  private async stopRound(): Promise<void> {
    if (!this.rec.recording) return;
    this.clearTimer();
    const started = Date.now();
    this.rec.stop((r) => {
      const sec = Math.max(1, Math.round((Date.now() - started) / 1000));
      const words = r.recognized ? r.recognized.split(/\s+/).filter(Boolean).length : 0;
      this.roundStats.push({ words, sec });
      const wpm = words ? Math.round((words / sec) * 60) : 0;
      this.material.forEach((s) => recordPractice(s.id));
      const btn = this.host.querySelector('[data-act="startRound"]') as HTMLButtonElement;
      const stopBtn = this.host.querySelector('[data-act="stopRound"]') as HTMLButtonElement;
      stopBtn.disabled = true;
      const result = this.host.querySelector('[data-role="result"]') as HTMLElement;
      result.innerHTML = `<div class="score-info"><b>${ROUNDS[this.roundIdx].label} · ${sec}s · ${wpm ? wpm + ' wpm' : '(not recognized, trust your recording)'}</b><span>${r.recognized ? 'You said: ' + r.recognized : 'Recorded.'}</span></div>`;
      this.roundIdx++;
      if (this.roundIdx < ROUNDS.length) {
        btn.disabled = false;
        this.host.querySelector('[data-role="roundLabel"]')!.textContent = ROUNDS[this.roundIdx].label;
      } else {
        this.host.querySelector('[data-role="roundLabel"]')!.textContent = 'All three rounds done.';
        btn.disabled = true;
      }
      this.renderProgress();
    });
  }

  private renderProgress(): void {
    const box = this.host.querySelector('[data-role="progress"]') as HTMLElement;
    box.innerHTML = this.roundStats
      .map((r, i) => `<div class="f432-stat">${ROUNDS[i].label.split('·')[1]?.trim() ?? ''}: ${r.sec}s · ${r.words ? Math.round((r.words / r.sec) * 60) + ' wpm' : '—'}</div>`)
      .join('');
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}
