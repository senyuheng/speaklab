// Service: TTS engine switcher — system voices now, cloud engines reserved
import type { Lang, Accent } from '../content/content';
import { voiceLang } from '../state/settings';
import { getState } from '../state/store';
import { similarity } from '../lib/similarity';

export interface SpeechResult {
  blobUrl: string;
  recognized: string;
}

export interface VoiceMeta {
  id: string;
  name: string;
  lang: string;
}

export interface TtsEngine {
  id: string;
  label: string;
  kind: 'local' | 'cloud';
  available(): boolean;
  listVoices(): VoiceMeta[];
  speak(text: string, lang: Lang, accent: Accent, rate: number, voiceId: string, cb?: () => void): void;
}

function systemVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
}

// System voice engine (Web Speech). Accent is locked: en-US for US, en-GB for UK, never mixed.
const SYSTEM: TtsEngine = {
  id: 'system',
  label: 'System voice',
  kind: 'local',
  available: () => 'speechSynthesis' in window && systemVoices().length > 0,
  listVoices: () => systemVoices().map((v) => ({ id: v.name, name: v.name, lang: v.lang || 'other' })),
  speak(text, lang, accent, rate, voiceId, cb) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = systemVoices();
    let v = voiceId ? voices.find((x) => x.name === voiceId) : undefined;
    if (!v) {
      const prefix = lang === 'ja' ? 'ja' : accent === 'UK' ? 'en-GB' : 'en-US';
      v = voices.find((x) => x.lang && x.lang.toLowerCase().startsWith(prefix.toLowerCase()));
      if (!v && lang === 'en') v = voices.find((x) => /^en[-_]/.test(x.lang || ''));
      if (!v && lang === 'ja') v = voices.find((x) => /^ja[-_]/.test(x.lang || ''));
    }
    if (v) u.voice = v;
    u.lang = v ? v.lang : voiceLang(lang, getState().settings);
    u.rate = rate || 0.9;
    if (cb) u.onend = cb;
    window.speechSynthesis.speak(u);
  },
};

// Cloud engines: reserved placeholders until an API key is configured in a tiny relay.
function cloudStub(id: string, label: string): TtsEngine {
  return {
    id,
    label,
    kind: 'cloud',
    available: () => false,
    listVoices: () => [],
    speak() {
      /* inactive until an API key is added */
    },
  };
}

const DOUBAO = cloudStub('doubao', 'Doubao · Volcano TTS');
const AZURE = cloudStub('azure', 'Azure Neural');
const ELEVEN = cloudStub('elevenlabs', 'ElevenLabs');

export const ENGINES: TtsEngine[] = [SYSTEM, DOUBAO, AZURE, ELEVEN];

export function engineById(id: string): TtsEngine {
  return ENGINES.find((e) => e.id === id) ?? SYSTEM;
}

export function speak(text: string, lang: Lang, accent: Accent, rate: number, cb?: () => void): void {
  const s = getState().settings;
  let eng = engineById(s.voiceEngine);
  if (!eng.available()) eng = SYSTEM; // training must never go silent
  eng.speak(text, lang, accent, rate, s.voiceId ?? '', cb);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function primeVoices(): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.getVoices();
}

export function subscribeVoices(cb: () => void): void {
  if (!('speechSynthesis' in window)) return;
  const ss = window.speechSynthesis as SpeechSynthesis & { onvoiceschanged: (() => void) | null };
  ss.onvoiceschanged = () => cb();
}

// Recording + approximate scoring
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
        this.recognition.lang = voiceLang(lang, getState().settings);
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
