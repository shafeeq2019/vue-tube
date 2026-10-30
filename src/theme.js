import { ref } from "vue";

const STORAGE_KEY = "vuetube.theme";
// Keep in sync with --vt-bg in styles.css
const THEME_COLORS = { light: "#F6F6F8", dark: "#0B0B0F" };

function getCurrentTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Bootstrap 5.3 switches all of its colors via the data-bs-theme attribute,
// and so do the app's own color tokens in styles.css.
function loadTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }
}

// The active theme, shared by every theme switch in the app.
const theme = ref(getCurrentTheme());

function saveTheme(newTheme) {
  localStorage.setItem(STORAGE_KEY, newTheme);
  theme.value = newTheme;
  loadTheme(newTheme);
}

loadTheme(theme.value);

export { theme, getCurrentTheme, loadTheme, saveTheme };
