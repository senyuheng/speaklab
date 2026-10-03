// 视图：设置（发音口音全局统一 / 语速 / 评分开关 / 数据）
import { getState, setState, resetToSeed, save } from '../state/store';
import { accentLabel } from '../state/settings';
import { toast } from '../lib/util';

export function renderSettings(host: HTMLElement, onAccentChange: () => void): void {
  const st = getState();
  host.innerHTML = `
    <div class="section-head"><h2>设置 Settings</h2><p>发音口音全局统一，绝不混杂</p></div>
    <div class="card set-group">
      <div class="set-row">
        <div><div class="set-label">英语发音口音 Accent</div><div class="set-desc">全 App 统一锁定一种，英美不混；切换后语音与注音同步变更</div></div>
        <div class="seg" id="accentSeg">
          <button data-accent="US" class="${st.settings.accent === 'US' ? 'active' : ''}">美式 English (US)</button>
          <button data-accent="UK" class="${st.settings.accent === 'UK' ? 'active' : ''}">英式 English (UK)</button>
        </div>
      </div>
      <div class="set-row">
        <div><div class="set-label">跟读语速 Speech rate</div><div class="set-desc">标准音播放速度</div></div>
        <div class="range-row"><input type="range" id="rateRange" min="0.5" max="1.2" step="0.1" value="${st.settings.rate}"><span id="rateVal" style="font-family:var(--f-mono);width:40px;text-align:right">${st.settings.rate}×</span></div>
      </div>
      <div class="set-row">
        <div><div class="set-label">评分方式</div><div class="set-desc">用浏览器语音识别近似判断（仅参考，录音自听最准）</div></div>
        <div class="seg" id="scoreSeg">
          <button data-score="on" class="${st.settings.score === 'on' ? 'active' : ''}">开启近似评分</button>
          <button data-score="off" class="${st.settings.score === 'off' ? 'active' : ''}">仅自听</button>
        </div>
      </div>
    </div>
    <div class="note">发音标准由 <b>浏览器语音引擎（Speech Synthesis）</b> 保证：当前为 <b>${accentLabel(st.settings.accent)}</b>，选美式调用 en-US 音色、英式调用 en-GB 音色，每句注音随口音切换，同一时间只显示一种口音。若浏览器无目标音色，自动回退到最接近的标准音色。</div>

    <div class="card set-group" style="margin-top:16px">
      <div class="set-row">
        <div><div class="set-label">数据 Data</div><div class="set-desc">训练记录保存在本浏览器 localStorage（可导出备份）</div></div>
        <div style="display:flex;gap:8px">
          <button class="btn ghost small" id="exportBtn">导出 JSON</button>
          <button class="btn ghost small" id="resetBtn">清空数据</button>
        </div>
      </div>
    </div>
  `;

  host.querySelector('#accentSeg')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-accent]') as HTMLElement | null;
    if (!b) return;
    const s = getState();
    setState({ ...s, settings: { ...s.settings, accent: b.dataset.accent as 'US' | 'UK' } });
    host.querySelectorAll('#accentSeg button').forEach((x) => x.classList.toggle('active', (x as HTMLElement).dataset.accent === b.dataset.accent));
    toast(`已切换为${accentLabel(b.dataset.accent as 'US' | 'UK')}发音`);
    onAccentChange();
  });
  host.querySelector('#rateRange')!.addEventListener('input', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    const s = getState();
    setState({ ...s, settings: { ...s.settings, rate: v } });
    host.querySelector('#rateVal')!.textContent = v + '×';
  });
  host.querySelector('#scoreSeg')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-score]') as HTMLElement | null;
    if (!b) return;
    const s = getState();
    setState({ ...s, settings: { ...s.settings, score: b.dataset.score as 'on' | 'off' } });
    host.querySelectorAll('#scoreSeg button').forEach((x) => x.classList.toggle('active', (x as HTMLElement).dataset.score === b.dataset.score));
  });
  host.querySelector('#exportBtn')!.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'speaklab-data.json';
    a.click();
  });
  host.querySelector('#resetBtn')!.addEventListener('click', () => {
    if (confirm('清空所有训练记录和自定义句库？此操作不可恢复。')) {
      const keep = getState().settings;
      resetToSeed();
      setState({ ...getState(), settings: keep });
      toast('已清空并恢复初始句库');
      onAccentChange();
    }
  });
}
