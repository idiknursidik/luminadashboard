/* ============================================================
   Lumina — Landing & Login interactions (zero-dependency)
   ============================================================ */
"use strict";

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Mobile menu (landing) ---------- */
function initMobileMenu() {
  const burger = qs("#lpBurger");
  const panel = qs("#lpMobileMenu");
  if (!burger || !panel) return;

  burger.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });

  qsa("a", panel).forEach((a) =>
    a.addEventListener("click", () => panel.classList.remove("open"))
  );
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = qsa(".lp-reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- Theme toggle (landing & login) ---------- */
function initTheme() {
  const btn = qs("#themeBtn");
  if (!btn) return;

  const sync = () => {
    const dark = document.documentElement.getAttribute("data-theme") !== "light";
    btn.setAttribute("aria-pressed", String(!dark));
    btn.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
  };
  sync();

  btn.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("lumina-theme", next); } catch (e) { /* storage diblokir */ }
    sync();
  });
}

/* ---------- Login form ---------- */
function initLoginForm() {
  const form = qs("#loginForm");
  if (!form) return;

  const email = qs("#email");
  const password = qs("#password");
  const submit = qs("#submitBtn");
  const btnLabel = qs("#submitLabel");
  const pwToggle = qs("#pwToggle");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const setInvalid = (input, message) => {
    const field = input.closest(".field");
    field.classList.toggle("invalid", Boolean(message));
    qs(".field-error", field).textContent = message || "";
    input.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validateEmail = () => {
    const v = email.value.trim();
    if (!v) { setInvalid(email, "Email wajib diisi"); return false; }
    if (!EMAIL_RE.test(v)) { setInvalid(email, "Format email tidak valid"); return false; }
    setInvalid(email, "");
    return true;
  };

  const validatePassword = () => {
    const v = password.value;
    if (!v) { setInvalid(password, "Password wajib diisi"); return false; }
    if (v.length < 6) { setInvalid(password, "Password minimal 6 karakter"); return false; }
    setInvalid(password, "");
    return true;
  };

  email.addEventListener("blur", validateEmail);
  password.addEventListener("blur", validatePassword);

  // Live re-validation once a field has an error
  email.addEventListener("input", () => {
    if (email.closest(".field").classList.contains("invalid")) validateEmail();
  });
  password.addEventListener("input", () => {
    if (password.closest(".field").classList.contains("invalid")) validatePassword();
  });

  // Show / hide password
  pwToggle?.addEventListener("click", () => {
    const showing = password.type === "text";
    password.type = showing ? "password" : "text";
    pwToggle.setAttribute("aria-label", showing ? "Tampilkan password" : "Sembunyikan password");
    pwToggle.querySelector(".eye").style.display = showing ? "" : "none";
    pwToggle.querySelector(".eye-off").style.display = showing ? "none" : "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const okEmail = validateEmail();
    const okPw = validatePassword();
    if (!okEmail || !okPw) return;

    // Demo auth: no backend — simulate verification, then enter dashboard
    submit.disabled = true;
    btnLabel.textContent = "Memverifikasi…";
    const spinner = document.createElement("span");
    spinner.className = "spin";
    submit.appendChild(spinner);

    setTimeout(() => {
      spinner.remove();
      btnLabel.textContent = "Berhasil ✓";
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 450);
    }, 950);
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initReveal();
  initLoginForm();
});
