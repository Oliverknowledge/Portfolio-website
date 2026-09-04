const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const projectList = document.querySelector(".project-list");
const emptyState = document.querySelector("#emptyState");
const cards = Array.from(document.querySelectorAll(".project-card"));

function scoreFor(card, mode) {
  if (mode === "newest") return Number(card.dataset.year);
  if (mode === "prize") return Number(card.dataset.prize);
  if (mode === "live") return Number(card.dataset.live);
  return -Number(card.dataset.rank);
}

function renderProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const mode = sortSelect.value;
  let visibleCount = 0;

  const sortedCards = [...cards].sort((a, b) => {
    const delta = scoreFor(b, mode) - scoreFor(a, mode);
    if (delta !== 0) return delta;
    return Number(a.dataset.rank) - Number(b.dataset.rank);
  });

  sortedCards.forEach((card) => {
    const isMatch = card.dataset.search.includes(query);
    card.hidden = !isMatch;
    if (isMatch) visibleCount += 1;
    projectList.append(card);
  });

  emptyState.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", renderProjects);
sortSelect.addEventListener("change", renderProjects);

document.querySelectorAll(".project-slideshow").forEach((slideshow) => {
  const images = Array.from(slideshow.querySelectorAll(".slideshow-track img"));
  const dots = Array.from(slideshow.querySelectorAll(".slideshow-dots .dot"));
  const interval = Number(slideshow.dataset.interval) || 3500;
  let current = images.findIndex((img) => img.classList.contains("is-active"));
  if (current < 0) current = 0;
  let timer;

  function show(index) {
    images[current].classList.remove("is-active");
    dots[current]?.classList.remove("is-active");
    current = index;
    images[current].classList.add("is-active");
    dots[current]?.classList.add("is-active");
  }

  function next() {
    show((current + 1) % images.length);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, interval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      restart();
    });
  });

  restart();
});
