function getCurrentThem() {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  localStorage.getItem("vuetube.theme")
    ? (theme = localStorage.getItem("vuetube.theme"))
    : null;
  return theme;
}

function loadTheme(theme) {
  const root = document.querySelector(":root");
  root.setAttribute("color-scheme", theme);
}

window.addEventListener("DOMContentLoaded", () => {
  loadTheme(getCurrentThem());
});

export { getCurrentThem, loadTheme };
