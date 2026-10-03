// Method: Minimal pairs (fixes single sounds shadowing can't). Discriminate first, then produce.
import { getState } from '../state/store';
import { speak, RecordingController } from '../speech/speech';
import type { MinimalPair } from '../content/content';
import type { PracticeController } from './types';

export class MinimalPairs implements PracticeController {
  readonly id = 'minimalPairs';
  readonly label = 'Minimal Pairs';
  readonly lang = 'en' as const;
  private host!: HTMLElement;
  private pairs: MinimalPair[] = [];
  private pairIdx = 0;
  private trials = 0;
  private correct = 0;
  private rec = new RecordingController();
  private blobUrl: string | null = null;

  mount(host: HTMLElement): void {
    this.host = host;
    const st = getState();
    this.pairs = st.minimalPairs;
    this.render();
  }

  destroy(): void {
    if (this.rec.recording) this.rec.stop(() => undefined);
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    this.host.innerHTML = '';
  }

  private render(): void {
    this.host.innerHTML = `
      <div class="mp">
        <div class="cats" data-role="pairs">
          ${this.pairs.map((p, i) => `<button class="cat${i === 0 ? ' active' : ''}" data-i="${i}">${p.a} / ${p.b}</button>`).join('')}
        </div>
        <div class="lesson">
          <div class="mp-note" data-role="pairNote"></div>
          <div class="mp-word" data-role="word">—</div>
          <div class="mp-ipa" data-role="ipa"></div>
          <div class="controls">
            <button class="ctrl-btn speak" data-act="play">Play (guess which one)</button>
            <button class="ctrl-btn" data-act="chooseA" data-val="A">A</button>
            <button class="ctrl-btn" data-act="chooseB" data-val="B">B</button>
          </div>
          <div class="score-box on" data-role="feedback" style="margin-top:14px"></div>
          <div class="mp-feedback" data-role="accuracy"></div>
          <div style="margin-top:16px;border-top:1px dashed var(--line-strong);padding-top:14px">
            <div style="font-weight:600;font-size:14px;margin-bottom:8px">Produce: say both words out loud and compare</div>
            <div class="controls">
              <button class="ctrl-btn" data-act="rec">Record</button>
              <button class="ctrl-btn" data-act="playRec" disabled>Play mine</button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.host.querySelector('[data-role="pairs"]')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('.cat') as HTMLElement | null;
      if (!b) return;
      this.pairIdx = Number(b.dataset.i);
      this.trials = 0;
      this.correct = 0;
      this.host.querySelectorAll('[data-role="pairs"] .cat').forEach((x) => x.classList.toggle('active', Number((x as HTMLElement).dataset.i) === this.pairIdx));
      this.showPair();
    });
    this.host.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null;
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'play') this.play();
      else if (act === 'chooseA' || act === 'chooseB') this.choose(act === 'chooseA' ? 'A' : 'B');
      else if (act === 'rec') void this.toggleRec(btn);
      else if (act === 'playRec') this.playRec();
    });
    this.showPair();
  }

  private current(): MinimalPair {
    return this.pairs[this.pairIdx];
  }

  private showPair(): void {
    const p = this.current();
    if (!p) return;
    this.host.querySelector('[data-role="pairNote"]')!.textContent = p.note;
    this.host.querySelector('[data-role="ipa"]')!.textContent = `${p.a} / ${p.b}  ${p.ipa}`;
    this.host.querySelector('[data-role="word"]')!.textContent = '?';
    this.host.querySelector('[data-role="feedback"]')!.innerHTML = '';
    this.renderAccuracy();
  }

  private play(): void {
    const p = this.current();
    if (!p) return;
    const pick = Math.random() < 0.5 ? p.a : p.b;
    this.host.dataset.pick = pick;
    this.host.querySelector('[data-role="word"]')!.textContent = 'Listening...';
    const st = getState();
    speak(pick, 'en', st.settings.accent, 0.7, () => {
      this.host.querySelector('[data-role="word"]')!.textContent = 'Which word did you hear?';
    });
  }

  private choose(v: string): void {
    const p = this.current();
    const pick = this.host.dataset.pick;
    if (!pick) {
      this.feedback('Press "Play" first, then choose.');
      return;
    }
    this.trials++;
    const heard = v === 'A' ? p.a : p.b;
    const correct = heard === pick;
    if (correct) this.correct++;
    this.feedback(correct ? `Correct (${pick}).` : `Wrong: you heard ${pick}, not ${heard}.`);
    this.renderAccuracy();
    delete this.host.dataset.pick;
  }

  private feedback(msg: string): void {
    const box = this.host.querySelector('[data-role="feedback"]') as HTMLElement;
    box.innerHTML = `<div class="score-info"><b>${msg}</b></div>`;
  }

  private renderAccuracy(): void {
    const box = this.host.querySelector('[data-role="accuracy"]') as HTMLElement;
    if (!this.trials) {
      box.innerHTML = '';
      return;
    }
    const acc = Math.round((this.correct / this.trials) * 100);
    const pass = acc >= 90 ? 'Reached 90% — move on to production.' : '';
    box.innerHTML = `<div class="mp-acc">Discrimination: ${this.correct}/${this.trials} = ${acc}% ${pass}</div>`;
  }

  private async toggleRec(btn: HTMLElement): Promise<void> {
    const st = getState();
    if (this.rec.recording) {
      btn.textContent = 'Record';
      btn.classList.remove('recording');
      this.rec.stop((r) => {
        if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
        this.blobUrl = r.blobUrl;
        (this.host.querySelector('[data-act="playRec"]') as HTMLButtonElement).disabled = false;
      });
      return;
    }
    try {
      await this.rec.start('en', st.settings.accent, false);
      btn.textContent = 'Stop';
      btn.classList.add('recording');
    } catch (err) {
      alert('Microphone unavailable: ' + ((err as Error).message || 'check permissions'));
    }
  }

  private playRec(): void {
    if (this.blobUrl) new Audio(this.blobUrl).play();
  }
}
