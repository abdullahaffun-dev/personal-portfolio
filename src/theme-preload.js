(function () {
  try {
    document.documentElement.classList.add('js');
    var saved = localStorage.getItem('affun-theme');
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#edf0f4' : '#090a0c';
  } catch (_) {}
})();
