// 方法：限时独白（Timed Monologue）——2 分钟不停顿说一个话题，练压力下的持续流利
import type { Lang } from '../content/content';
import { getState, recordPractice } from '../state/store';
import { RecordingController } from '../speech/speech';
import type { PracticeController } from './types';

const PROMPTS: Record<Lang, string[]> = {
  en: [
    'Describe your morning routine.',
    'Talk about a hobby you enjoy.',
    'Describe your ideal weekend.',
    'Explain why you are learning Japanese.',
    'Describe the place you live.',
  ],
  ja: [
    'あなたの朝のルーティンを説明してください。',
    '好きな趣味について話してください。',
    '理想の週末を説明してください。',
    '日本語を勉強している理由を説明してください。',
    '住んでいる場所を説明してください。',
  ],
};

export class TimedMonologue implements PracticeController {
  readonly id = 'monologue';
  readonly label = '限时独白';
  readonly lang: Lang;
  private host!: HTMLElement;
  private sec = 120;
  private timeLeft = this.sec;
  private timer: number | null = null;
  private rec = new RecordingController();
  private prompts: string[] = [];

  constructor(lang: Lang) {
    this.lang = lang;
  }

  mount(host: HTMLElement): void {
    this.host = host;
    this.prompts = PROMPTS[this.lang];
    this.render();
  }

  destroy(): void {
    this.clearTimer();
    if (this.rec.recording) this.rec.stop(() => undefined);
    this.host.innerHTML = '';
  }

  private render(): void {
    const topic = this.prompts[0];
    this.host.innerHTML = `
      <div class="mono">
        <div class="lesson">
          <div class="mp-note">话题 Topic</div>
          <div class="mono-topic" data-role="topic">${topic}</div>
          <div class="f432-timer" data-role="timer">02:00</div>
          <div class="controls">
            <button class="ctrl-btn speak" data-act="start">🎙 开始（计时 + 录音）</button>
            <button class="ctrl-btn done" data-act="stop" disabled>停止</button>
            <button class="ctrl-btn" data-act="next">换话题</button>
          </div>
          <div class="score-box on" data-role="result" style="margin-top:14px"></div>
        </div>
      </div>
    `;
    this.host.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null;
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'start') void this.start();
      else if (act === 'stop') void this.stop();
      else if (act === 'next') this.nextTopic();
    });
  }

  private fmt(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  private startBtn(): HTMLButtonElement {
    return this.host.querySelector('[data-act="start"]') as HTMLButtonElement;
  }
  private stopBtn(): HTMLButtonElement {
    return this.host.querySelector('[data-act="stop"]') as HTMLButtonElement;
  }

  private async start(): Promise<void> {
    const st = getState();
    this.timeLeft = this.sec;
    this.host.querySelector('[data-role="timer"]')!.textContent = this.fmt(this.timeLeft);
    this.startBtn().disabled = true;
    this.stopBtn().disabled = false;
    void this.rec.start(this.lang, st.settings.accent, true);
    this.clearTimer();
    this.timer = window.setInterval(() => {
      this.timeLeft--;
      this.host.querySelector('[data-role="timer"]')!.textContent = this.fmt(Math.max(0, this.timeLeft));
      if (this.timeLeft <= 0) void this.stop();
    }, 1000);
  }

  private async stop(): Promise<void> {
    if (!this.rec.recording) return;
    this.clearTimer();
    const used = this.sec - Math.max(0, this.timeLeft);
    const started = Date.now();
    this.rec.stop((r) => {
      const elapsed = Math.max(1, Math.round((Date.now() - started) / 1000));
      const words = r.recognized ? r.recognized.split(/\s+/).filter(Boolean).length : 0;
      const wpm = words ? Math.round((words / elapsed) * 60) : 0;
      const box = this.host.querySelector('[data-role="result"]') as HTMLElement;
      box.innerHTML = `<div class="score-info"><b>${elapsed}s · ${wpm ? wpm + ' 词/分' : '（未识别，以录音为准）'}</b><span>${r.recognized ? '你说：' + r.recognized : '已录音，请播放核对'}</span></div>`;
      this.startBtn().disabled = false;
      this.stopBtn().disabled = true;
    });
  }

  private nextTopic(): void {
    const cur = this.prompts.indexOf(this.host.querySelector('[data-role="topic"]')!.textContent ?? '');
    this.host.querySelector('[data-role="topic"]')!.textContent = this.prompts[(cur + 1) % this.prompts.length];
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}
