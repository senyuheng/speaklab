// View: Dashboard
import { getState, calcStreak, totalSaid } from '../state/store';
import { todayStr } from '../lib/util';

const EN_SOURCES = [
  { name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', desc: '6 Minute English - natural British speech, free transcript and vocabulary list per episode. Best for shadowing at B1-B2.' },
  { name: 'VOA Learning English', url: 'https://learningenglish.voanews.com', desc: 'Deliberately slower American English (about 75% of native speed), free transcripts on every episode.' },
  { name: 'ELLLO', url: 'https://www.elllo.org', desc: 'Thousands of authentic lessons by real speakers with transcripts, built for learners.' },
  { name: 'TED Talks', url: 'https://www.ted.com/talks', desc: 'Full interactive transcripts on every talk; intermediate to advanced with varied accents.' },
  { name: 'All Ears English', url: 'https://www.allearsenglish.com', desc: 'Conversational American English with natural phrases and cultural tips.' },
];

const JA_SOURCES = [
  { name: 'Kurosio Shadowing series', url: 'https://www.9640.jp', desc: 'The professional shadowing textbook (beginner-intermediate / intermediate-advanced) with English, Chinese and Korean glosses. The intermediate-advanced edition matches your N2 level.' },
  { name: 'NHK World - Easy Japanese', url: 'https://www.nhk.or.jp/lesson/', desc: 'Level-graded authentic Japanese, including News Web Easy with furigana and English support.' },
];

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
      <div class="hero-label">Today's Lab</div>
      <h1>${doneToday ? `You spoke ${doneToday} sentence${doneToday > 1 ? 's' : ''} today.` : 'Start your speaking today.'}</h1>
      <div class="h1-sub">Speaking a few times daily beats one long session. Begin with a single sentence and keep the streak.</div>
      <div class="hero-stats">
        <div class="stat streak"><div class="n">${streak}</div><div class="l">Day streak</div></div>
        <div class="stat"><div class="n">${doneToday}</div><div class="l">Spoken today</div></div>
        <div class="stat"><div class="n">${total}</div><div class="l">All-time sentences</div></div>
        <div class="stat"><div class="n">${pct}%</div><div class="l">Goal progress</div></div>
      </div>
    </div>

    <div class="today-grid">
      ${langCard('en', 'English', 'Focus 7', enArr.length, enDone, 'Fluency-first drills')}
      ${langCard('ja', 'Japanese', 'Focus 3', jaArr.length, jaDone, 'English bridges you in first')}
    </div>

    <div style="margin-top:20px">
      <div class="section-head"><h2>Today's loop</h2><p>Every sentence runs the same path</p></div>
      <div class="card loop">
        ${[['Listen', 'hear the standard audio'], ['Shadow', 'copy the tone and rhythm'], ['Record', 'capture your voice'], ['Check', 'compare and score']]
          .map(
            (x, i) => `<div class="loop-step"><div class="loop-n">${i + 1}</div><div class="loop-t">${x[0]}</div><div class="loop-d">${x[1]}</div></div>`,
          )
          .join('')}
      </div>
    </div>

    <div style="margin-top:24px">
      <div class="section-head"><h2>Practice materials</h2><p>Professional, authentic sources to shadow and study outside the app</p></div>
      <div class="grid" style="grid-template-columns:repeat(2,1fr);gap:16px">
        ${sourceGroup('English', EN_SOURCES)}
        ${sourceGroup('Japanese', JA_SOURCES)}
      </div>
      <div class="note" style="margin-top:14px">Rule of thumb: pick material where you already understand 70-80%. Below that, shadowing turns into guessing.</div>
    </div>
  `;
}

function sourceGroup(title: string, list: { name: string; url: string; desc: string }[]): string {
  return `
    <div class="card">
      <h3>${title}</h3>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:10px">
        ${list
          .map(
            (s) => `<div style="border-top:1px dashed var(--line-strong);padding-top:10px">
              <a href="${s.url}" target="_blank" rel="noopener" style="font-weight:600;color:var(--brand);text-decoration:none">${s.name} ↗</a>
              <div style="font-size:12.5px;color:var(--muted);margin-top:3px">${s.desc}</div>
            </div>`,
          )
          .join('')}
      </div>
    </div>`;
}

function langCard(lang: 'en' | 'ja', name: string, share: string, goalN: number, done: number, desc: string): string {
  const w = goalN ? Math.round((done / goalN) * 100) : 0;
  return `
    <div class="lang-card ${lang}">
      <div class="top"><span class="flag">${name}</span><span class="share">${share}</span></div>
      <div class="goal">Today's goal: <b>${goalN}</b> sentences · practiced <b>${done}</b></div>
      <div class="progress"><i style="width:${w}%"></i></div>
      <div class="meta"><span>${desc}</span><button class="btn primary small" data-go="${lang}">Start</button></div>
    </div>`;
}
