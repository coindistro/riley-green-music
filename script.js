const header = document.querySelector("[data-header]");
const form = document.querySelector(".signup-form");
const note = document.querySelector("[data-form-note]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

form.addEventListener("submit", (event) => {
  event.preventDefault();
  note.textContent = "Got it. This is wired as a local preview, so nothing was sent.";
});
