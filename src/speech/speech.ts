// 服务层：语音引擎（TTS 音色锁定 / 录音 / 近似评分识别）
// 对外只暴露接口一致的函数；未来可替换为 AI 后端实现，视图层不感知
import type { Lang, Accent } from '../content/content';
import { voiceLang } from '../state/settings';
import { similarity } from '../lib/similarity';

export interface SpeechResult {
  blobUrl: string;
  recognized: string;
}

// ---- TTS：按当前口音锁定音色，英美不混 ----
function pickVoice(lang: Lang, accent: Accent): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang === 'ja' ? 'ja' : accent === 'UK' ? 'en-GB' : 'en-US';
  let v = voices.find((x) => x.lang && x.lang.toLowerCase().startsWith(prefix.toLowerCase()));
  if (!v && lang === 'en') v = voices.find((x) => /^en[-_]/.test(x.lang || ''));
  if (!v && lang === 'ja') v = voices.find((x) => /^ja[-_]/.test(x.lang || ''));
  return v ?? null;
}

export function speak(text: string, lang: Lang, accent: Accent, rate: number, cb?: () => void): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice(lang, accent);
  if (v) u.voice = v;
  u.lang = v ? v.lang : voiceLang(lang, { accent, rate, score: 'on', dailyGoal: 8 });
  u.rate = rate || 0.9;
  if (cb) u.onend = cb;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function primeVoices(): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.getVoices();
}

// ---- 录音 + 近似评分 ----
export class RecordingController {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private recognition: SpeechRecognition | null = null;
  private recognizedText = '';
  private onStop: ((r: SpeechResult) => void) | null = null;

  get recording(): boolean {
    return !!this.recorder && this.recorder.state !== 'inactive';
  }

  async start(lang: Lang, accent: Accent, wantScore: boolean): Promise<void> {
    this.stopStream();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recorder = new MediaRecorder(this.stream);
    this.chunks = [];
    this.recognizedText = '';
    this.recorder.ondataavailable = (e) => {
      if (e.data.size) this.chunks.push(e.data);
    };
    this.recorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: this.recorder?.mimeType || 'audio/webm' });
      const blobUrl = URL.createObjectURL(blob);
      this.stopStream();
      if (this.onStop) this.onStop({ blobUrl, recognized: this.recognizedText.trim() });
    };
    this.recorder.start();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (wantScore && SR) {
      try {
        this.recognition = new SR();
        this.recognition.lang = voiceLang(lang, { accent, rate: 0.9, score: 'on', dailyGoal: 8 });
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.onresult = (e) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            if (r.isFinal) this.recognizedText += ' ' + r[0].transcript;
          }
        };
        this.recognition.onerror = () => {
          this.recognizedText = '';
        };
        this.recognition.start();
      } catch {
        this.recognition = null;
      }
    }
  }

  stop(onStop: (r: SpeechResult) => void): void {
    this.onStop = onStop;
    if (this.recorder && this.recorder.state !== 'inactive') this.recorder.stop();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        /* noop */
      }
      this.recognition = null;
    }
  }

  private stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }
}

export const scoreMatch = (target: string, heard: string): number => similarity(target, heard);
