// Method: Shadowing (core). Listen -> shadow -> record -> self-check -> done.
import type { Lang } from '../content/content';
import { catName, type Sentence } from '../content/content';
import { getState, recordPractice } from '../state/store';
import { sentenceIpa } from '../state/settings';
import { speak, RecordingController } from '../speech/speech';
import { similarity } from '../lib/similarity';
import type { PracticeController } from './types';

interface Row {
  sentence: Sentence;
  id: string;
}

export class Shadowing implements PracticeController {
  readonly id = 'shadowing';
  readonly label = 'Shadowing';
  readonly lang: Lang;
  private host!: HTMLElement;
  private cat = 0;
  private idx = 0;
  private rows: Row[] = [];
  private rec: RecordingController | null = null;
  private blobUrl: string | null = null;
  private els!: Record<string, HTMLElement>;

  constructor(lang: Lang) {
    this.lang = lang;
  }

  private byCat(): Row[] {
    const st = getState();
    return st.sentences
      .filter((s) => s.lang === this.lang && s.cat === this.cat)
      .map((sentence) => ({ sentence, id: sentence.id }));
  }

  private displayText(s: Sentence): string {
    return this.lang === 'en' ? (s as { en: string }).en : (s as { jp: string }).jp;
  }

  private accentIpa(s: Sentence): string {
    const st = getState();
    return sentenceIpa(s as never, st.settings);
  }

  mount(host: HTMLElement): void {
    this.host = host;
    this.rec = new RecordingController();
    this.rows = this.byCat();
    this.render();
    this.bind();
    this.renderLesson();
  }

  destroy(): void {
    if (this.rec?.recording) this.rec.stop(() => undefined);
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    this.host.innerHTML = '';
  }

  private cats(): string[] {
    return this.lang === 'en' ? ['Self Introduction', 'Ordering Food', 'Daily Small Talk', 'Opinions & Feelings'] : ['Self Introduction', 'At a Café', 'Study & Work', 'Daily Life'];
  }

  private render(): void {
    this.host.innerHTML = `
      <div class="cats" data-role="cats">
        ${this.cats()
          .map((c, i) => `<button class="cat${i === this.cat ? ' active' : ''}" data-cat="${i}">${c}</button>`)
          .join('')}
      </div>
      <div class="trainer">
        <div class="lesson">
          <div class="idx" data-role="idx"></div>
          <div class="lang-line"><span class="pill-tag ${this.lang === 'en' ? 'en' : 'ja'}">${this.lang === 'en' ? 'EN' : 'JA'}</span><span data-role="catName"></span></div>
          <div class="sentence ${this.lang === 'ja' ? 'ja' : ''}" data-role="sentence">—</div>
          <div class="ipa" data-role="ipa"></div>
          <div class="meaning" data-role="gloss"></div>
          <div class="controls">
            <button class="ctrl-btn speak" data-act="listen">Listen (standard)</button>
            <button class="ctrl-btn" data-act="record">Record</button>
            <button class="ctrl-btn" data-act="play" disabled>Play mine</button>
            <button class="ctrl-btn done" data-act="done">Done</button>
          </div>
          <div class="rec-bar" data-role="recbar"><div class="dots"><i></i><i></i><i></i><i></i></div><span>Recording... follow along now.</span></div>
          <div class="score-box" data-role="score"></div>
        </div>
        <div class="panel">
          <h4>Sentences in this set</h4>
          <div class="list-nav" data-role="list"></div>
        </div>
      </div>
    `;
    this.els = {
      idx: this.host.querySelector('[data-role="idx"]') as HTMLElement,
      catName: this.host.querySelector('[data-role="catName"]') as HTMLElement,
      sentence: this.host.querySelector('[data-role="sentence"]') as HTMLElement,
      ipa: this.host.querySelector('[data-role="ipa"]') as HTMLElement,
      gloss: this.host.querySelector('[data-role="gloss"]') as HTMLElement,
      recbar: this.host.querySelector('[data-role="recbar"]') as HTMLElement,
      score: this.host.querySelector('[data-role="score"]') as HTMLElement,
      list: this.host.querySelector('[data-role="list"]') as HTMLElement,
    };
  }

  private bind(): void {
    this.host.querySelector('[data-role="cats"]')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('.cat') as HTMLElement | null;
      if (!b) return;
      this.cat = Number(b.dataset.cat);
      this.idx = 0;
      this.rows = this.byCat();
      this.host.querySelectorAll('[data-role="cats"] .cat').forEach((x) => x.classList.toggle('active', Number((x as HTMLElement).dataset.cat) === this.cat));
      this.renderLesson();
    });

    this.host.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null;
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'listen') this.listen();
      else if (act === 'record') void this.toggleRecord(btn);
      else if (act === 'play') this.play();
      else if (act === 'done') this.done();
    });

    this.host.querySelector('[data-role="list"]')!.addEventListener('click', (e) => {
      const it = (e.target as HTMLElement).closest('.list-item') as HTMLElement | null;
      if (!it) return;
      this.idx = Number(it.dataset.i);
      this.renderLesson();
    });
  }

  private current(): Row {
    return this.rows[this.idx];
  }

  private renderLesson(): void {
    const row = this.current();
    if (!row) {
      this.els.sentence.textContent = '—';
      return;
    }
    const { sentence, id } = row;
    this.els.idx.textContent = `${this.idx + 1} / ${this.rows.length}`;
    this.els.catName.textContent = catName(this.lang, this.cat);
    this.els.sentence.textContent = this.displayText(sentence);
    if (this.lang === 'en') {
      const ipa = this.accentIpa(sentence);
      this.els.ipa.textContent = ipa;
      this.els.ipa.style.display = ipa ? 'inline-block' : 'none';
    } else {
      this.els.ipa.textContent = '';
      this.els.ipa.style.display = 'none';
    }
    this.els.gloss.textContent = sentence.gloss;
    this.els.score.classList.remove('on');
    this.els.score.innerHTML = '';
    this.els.recbar.classList.remove('on');
    (this.host.querySelector('[data-act="play"]') as HTMLButtonElement).disabled = true;
    this.renderList(id);
  }

  private renderList(activeId: string): void {
    const st = getState();
    this.els.list.innerHTML = this.rows
      .map(
        (row, i) => `
        <div class="list-item${st.prog[row.id]?.count ? ' done' : ''}${i === this.idx ? ' active' : ''}" data-i="${i}">
          <span class="num">${i + 1}</span><span class="txt">${this.displayText(row.sentence)}</span><span class="dot"></span>
        </div>`,
      )
      .join('');
  }

  private listen(): void {
    const row = this.current();
    if (!row) return;
    const st = getState();
    speak(this.displayText(row.sentence), this.lang, st.settings.accent, st.settings.rate);
  }

  private async toggleRecord(btn: HTMLElement): Promise<void> {
    if (!this.rec) return;
    if (this.rec.recording) {
      btn.textContent = 'Record';
      btn.classList.remove('recording');
      this.els.recbar.classList.remove('on');
      this.rec.stop((r) => {
        if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
        this.blobUrl = r.blobUrl;
        const playBtn = this.host.querySelector('[data-act="play"]') as HTMLButtonElement;
        playBtn.disabled = false;
        const st = getState();
        const target = this.displayText(this.current().sentence);
        if (st.settings.score === 'on' && r.recognized) this.showScore(target, r.recognized);
        else this.showScore(target, '');
      });
      return;
    }
    const row = this.current();
    if (!row) return;
    const st = getState();
    try {
      await this.rec.start(this.lang, st.settings.accent, st.settings.score === 'on');
      btn.textContent = 'Stop';
      btn.classList.add('recording');
      this.els.recbar.classList.add('on');
    } catch (err) {
      alert('Microphone unavailable: ' + ((err as Error).message || 'check permissions'));
    }
  }

  private play(): void {
    if (this.blobUrl) new Audio(this.blobUrl).play();
  }

  private showScore(target: string, heard: string): void {
    const box = this.els.score;
    box.classList.add('on');
    let pct = 0;
    if (heard) pct = similarity(target, heard);
    const c = pct >= 75 ? 'var(--good)' : pct >= 50 ? '#c07f1d' : pct >= 25 ? 'var(--warn)' : 'var(--ja)';
    const lab = pct >= 75 ? 'Great, close to standard.' : pct >= 50 ? 'Good, aim for smoother.' : pct >= 25 ? 'Understandable, keep going.' : 'Needs work, listen and repeat more.';
    box.innerHTML = `
      <div class="score-row">
        <div class="score-ring" style="--v:${pct};--score-c:${c}"><span>${pct}%</span></div>
        <div class="score-info"><b>Approx. match, for reference only</b><span>${heard ? lab : 'Recorded. Play it back and compare with the standard.'}</span>
        ${heard ? `<div class="you-said">You said: ${heard}</div>` : ''}</div>
      </div>`;
  }

  private done(): void {
    const row = this.current();
    if (!row) return;
    recordPractice(row.id);
    if (this.idx < this.rows.length - 1) {
      this.idx++;
      this.renderLesson();
    } else {
      this.renderLesson();
    }
  }
}
