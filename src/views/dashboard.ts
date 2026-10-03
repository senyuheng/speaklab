// 视图：仪表盘
import { getState, calcStreak, totalSaid } from '../state/store';
import { todayStr } from '../lib/util';
import { EN_CATS, JA_CATS } from '../content/content';

export function renderDashboard(host: HTMLElement): void {
  const st = getState();
  const doneToday = st.stats[todayStr()]?.said ?? 0;
  const total = totalSaid();
  const streak = calcStreak();
  const enArr = st.sentences.filter((s) => s.lang === 'en');
  const jaArr = st.sentences.filter((s) => s.lang === 'ja');
  const enDone = enArr.filter((s) => st.prog[s.id]?.count).length;
  const jaDone = jaArr.filter((s) => st.prog[s.id]?.count).length;
  const goal = enArr.length + jaArr.length;
  const pct = goal ? Math.round(((enDone + jaDone) / goal) * 100) : 0;

  host.innerHTML = `
    <div class="hero">
      <div class="hero-label">Today's Lab · 今日训练</div>
      <h1>${doneToday ? `今天已开口 ${doneToday} 句` : '开始你的口语训练'}</h1>
      <div class="h1-sub">每天开口几次，比一次练很久更有效。今天也从一句话开始。</div>
      <div class="hero-stats">
        <div class="stat streak"><div class="n">${streak}</div><div class="l">连续天数 Streak</div></div>
        <div class="stat"><div class="n">${doneToday}</div><div class="l">今日已练句 Today</div></div>
        <div class="stat"><div class="n">${total}</div><div class="l">累计句数 Total</div></div>
        <div class="stat"><div class="n">${pct}%</div><div class="l">今日目标完成 Goal</div></div>
      </div>
    </div>
    <div class="today-grid">
      ${langCard('en', 'English · 英语', '重心 7', enArr.length, enDone, '开口流利度训练')}
      ${langCard('ja', '日本語 · 日语', '重心 3', jaArr.length, jaDone, '英语为桥，先开口再说')}
    </div>
    <div style="margin-top:20px">
      <div class="section-head"><h2>今日训练闭环</h2><p>每个句子都走同一条路径</p></div>
      <div class="card loop">
        ${[['听', 'Listen', '听标准音'], ['跟读', 'Shadow', '模仿语气语速'], ['录音', 'Record', '录下自己'], ['自检', 'Check', '对比 + 评分']]
          .map(
            (x, i) => `<div class="loop-step"><div class="loop-n">${i + 1}</div><div class="loop-t">${x[0]} ${x[1]}</div><div class="loop-d">${x[2]}</div></div>`,
          )
          .join('')}
      </div>
    </div>
  `;
}

function langCard(lang: 'en' | 'ja', name: string, share: string, goalN: number, done: number, desc: string): string {
  const w = goalN ? Math.round((done / goalN) * 100) : 0;
  return `
    <div class="lang-card ${lang}">
      <div class="top"><span class="flag">${name}</span><span class="share">${share}</span></div>
      <div class="goal">今日目标：跟读 <b>${goalN}</b> 句 · 已练 <b>${done}</b> 句</div>
      <div class="progress"><i style="width:${w}%"></i></div>
      <div class="meta"><span>${desc}</span><button class="btn primary small" data-go="${lang}">开始跟读</button></div>
    </div>`;
}

export const EN_CATS_INFO = EN_CATS;
export const JA_CATS_INFO = JA_CATS;
