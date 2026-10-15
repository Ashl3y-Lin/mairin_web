// =========================================================
// MAIRIN · interactions
// =========================================================

// ---- Store / social links (replace "#" with real URLs) ----
const LINKS = {
  android: "#",   // e.g. https://play.google.com/store/apps/details?id=...
  ios: "#",       // e.g. https://apps.apple.com/app/...
  instagram: "https://www.instagram.com/mairinapp?srtk=YzluMWxxNTVlMzcw"  // e.g. https://instagram.com/mairin.app
};
document.getElementById("android-link").href = LINKS.android;
document.getElementById("ios-link").href = LINKS.ios;
document.getElementById("instagram-link").href = LINKS.instagram;

const header = document.querySelector(".site-header");
const nav = document.querySelector(".main-nav");
const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".main-nav a[data-link]");

// ---- Smooth scroll to sections, accounting for the sticky header ----
document.querySelectorAll("a[data-link]").forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const top = link.classList.contains("brand")
      ? 0
      : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", link.getAttribute("href"));
    closeMenu();
  });
});

// ---- Mobile menu ----
function closeMenu() {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

// ---- Header shadow on scroll ----
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

// ---- Highlight the active section in the header ----
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute("href")));
function updateActive() {
  const y = window.scrollY + header.offsetHeight + window.innerHeight * 0.3;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= y) current = s; });
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
    current = sections[sections.length - 1];
  }
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current.id));
}
window.addEventListener("scroll", updateActive, { passive: true });
window.addEventListener("resize", updateActive);
updateActive();

// ---- Reveal-on-scroll animation ----
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---- Day / night theme ----
const themeBtn = document.querySelector(".theme-toggle");
function setTheme(dark) {
  if (dark) document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  themeBtn.setAttribute("aria-pressed", String(dark));
  themeBtn.setAttribute("aria-label", dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  try { localStorage.setItem("mairin-theme", dark ? "dark" : "light"); } catch (e) {}
}
setTheme(document.documentElement.dataset.theme === "dark");
themeBtn.addEventListener("click", () => {
  themeBtn.classList.remove("spin");
  void themeBtn.offsetWidth; // restart the spin
  themeBtn.classList.add("spin");
  setTimeout(() => themeBtn.classList.remove("spin"), 800);
  setTheme(document.documentElement.dataset.theme !== "dark");
});


// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();
