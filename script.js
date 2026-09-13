const splash = document.querySelector("[data-splash]");
const closeSplashButtons = document.querySelectorAll("[data-close-splash]");
const menuButton = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const signup = document.querySelector("[data-signup]");
const note = document.querySelector("[data-form-note]");

document.body.classList.add("splash-open");

const closeSplash = () => {
  splash.classList.add("is-hidden");
  document.body.classList.remove("splash-open");
};

closeSplashButtons.forEach((button) => {
  button.addEventListener("click", closeSplash);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !splash.classList.contains("is-hidden")) {
    closeSplash();
  }
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.classList.toggle("is-open", !isOpen);
  nav.classList.toggle("is-open", !isOpen);
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.classList.remove("is-open");
    nav.classList.remove("is-open");
  }
});

signup.addEventListener("submit", (event) => {
  event.preventDefault();
  note.textContent = "Thanks. This preview keeps the signup local for now.";
  signup.reset();
});
