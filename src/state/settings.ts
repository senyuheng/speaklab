// 设置层：发音口音全局统一（英美不混）等派生逻辑
import type { Accent, Lang } from '../content/content';
import type { Settings } from './store';

export const accentKey = (accent: Accent): 'us' | 'uk' => (accent === 'UK' ? 'uk' : 'us');

// 当前口音对应的标准语音标签；未锁定口音时按需回退到同类语言音色
export function voiceLang(lang: Lang, settings: Settings): string {
  if (lang === 'ja') return 'ja-JP';
  return settings.accent === 'UK' ? 'en-GB' : 'en-US';
}

// 句子注音：按当前口音取对应字段（IPA 双字段存储，严格随口音切换）
export function sentenceIpa(s: { lang: Lang; ipaUs?: string; ipaUk?: string }, settings: Settings): string {
  if (s.lang !== 'en') return '';
  return accentKey(settings.accent) === 'uk' ? s.ipaUk ?? '' : s.ipaUs ?? '';
}

export const accentLabel = (accent: Accent): string =>
  accent === 'UK' ? '英式英语 en-GB' : '美式英语 en-US';
