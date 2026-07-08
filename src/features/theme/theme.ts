type Theme = 'light' | 'dark';
export function initTheme(): void {
  const saved = localStorage.getItem('theme') as Theme | null;
  const t: Theme = saved ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = t;
}
export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}
export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  return next;
}
