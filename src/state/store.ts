// 领域层：应用状态唯一来源 + 本地持久化 + 连续天数 / 统计
import type { Accent, Sentence, MinimalPair } from '../content/content';
import { SEED_EN, SEED_JA, SEED_MINIMAL_PAIRS } from '../content/content';
import { todayStr } from '../lib/util';

export interface Settings {
  accent: Accent;
  rate: number;
  score: 'on' | 'off';
  dailyGoal: number;
}

export interface ProgEntry {
  count: number;
  lastTs: string;
  mastery: number; // 0-100
}

export type Progress = Record<string, ProgEntry>;
export type DailyStat = { said: number; minutes: number };
export type Stats = Record<string, DailyStat>;

export interface AppState {
  settings: Settings;
  sentences: Sentence[];
  minimalPairs: MinimalPair[];
  prog: Progress;
  stats: Stats;
}

const LS_KEY = 'speaklab_v2';
const DEFAULT_SETTINGS: Settings = {
  accent: 'US',
  rate: 0.9,
  score: 'on',
  dailyGoal: 8,
};

function seedSentences(): Sentence[] {
  const en = SEED_EN.map<Sentence>((e) => ({ ...e }));
  const ja = SEED_JA.map<Sentence>((j) => ({ ...j }));
  return [...en, ...ja];
}

function defaultState(): AppState {
  return {
    settings: { ...DEFAULT_SETTINGS },
    sentences: seedSentences(),
    minimalPairs: [...SEED_MINIMAL_PAIRS],
    prog: {},
    stats: {},
  };
}

let state: AppState = load();

export function getState(): AppState {
  return state;
}

export function setState(next: AppState): void {
  state = next;
  save();
}

export function save(): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* 存储满或隐私模式时静默失败 */
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState();
    const d = JSON.parse(raw) as Partial<AppState>;
    const base = defaultState();
    return {
      settings: { ...base.settings, ...(d.settings ?? {}) },
      sentences: Array.isArray(d.sentences) && d.sentences.length ? d.sentences : base.sentences,
      minimalPairs: Array.isArray(d.minimalPairs) && d.minimalPairs.length ? d.minimalPairs : base.minimalPairs,
      prog: d.prog ?? {},
      stats: d.stats ?? {},
    };
  } catch {
    return defaultState();
  }
}

export function resetToSeed(): void {
  setState(defaultState());
}

export function recordPractice(sentenceId: string): void {
  const t = todayStr();
  const cur = state.prog[sentenceId] ?? { count: 0, lastTs: t, mastery: 0 };
  cur.count += 1;
  cur.lastTs = t;
  state.prog[sentenceId] = cur;
  const stat = state.stats[t] ?? { said: 0, minutes: 0 };
  stat.said += 1;
  state.stats[t] = stat;
  save();
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function calcStreak(): number {
  const days = Object.keys(state.stats).sort();
  if (!days.length) return 0;
  const last = parseDate(days[days.length - 1]);
  if (diffDays(last, parseDate(todayStr())) > 1) return 0;
  const set = new Set(days);
  let streak = 0;
  let d = last;
  while (set.has(todayStrOf(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function todayStrOf(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function totalSaid(): number {
  return Object.values(state.prog).reduce((s, p) => s + p.count, 0);
}
