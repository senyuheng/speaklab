import type { Accent, Lang } from '../content/content';
import type { Settings } from './store';

export const accentKey = (accent: Accent): 'us' | 'uk' => (accent === 'UK' ? 'uk' : 'us');

export function voiceLang(lang: Lang, settings: Settings): string {
  if (lang === 'ja') return 'ja-JP';
  return settings.accent === 'UK' ? 'en-GB' : 'en-US';
}

export function sentenceIpa(s: { lang: Lang; ipaUs?: string; ipaUk?: string }, settings: Settings): string {
  if (s.lang !== 'en') return '';
  return accentKey(settings.accent) === 'uk' ? s.ipaUk ?? '' : s.ipaUs ?? '';
}

export const accentLabel = (accent: Accent): string =>
  accent === 'UK' ? 'English (UK)' : 'English (US)';
