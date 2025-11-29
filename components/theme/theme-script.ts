import { THEME_STORAGE_KEY } from './constants'

export const themeScript = `(function() {
  try {
    var storedTheme = window.localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = storedTheme || 'terminal';
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`
