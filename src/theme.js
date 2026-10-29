const STORAGE_KEY = "vuetube.theme";

function getCurrentTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Bootstrap 5.3 switches all of its colors via the data-bs-theme attribute.
function loadTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  loadTheme(theme);
}

loadTheme(getCurrentTheme());

export { getCurrentTheme, loadTheme, saveTheme };
