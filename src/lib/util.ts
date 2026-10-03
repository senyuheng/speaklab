export const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id) as T | null;
  if (!el) throw new Error(`#${id} not found`);
  return el;
};

let toastTimer: number | undefined;

export function toast(msg: string): void {
  const t = document.getElementById('toast') as HTMLDivElement | null;
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove('show'), 2200);
}

export function todayStr(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function uid(): string {
  return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
