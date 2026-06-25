let activeCategory = CATEGORIES[0];
let activeIndex = 0;

const grid = document.getElementById('categoryGrid');
const viewer = document.getElementById('viewer');
const tabs = document.getElementById('tabs');
const counter = document.getElementById('counter');
const frontImg = document.getElementById('frontImg');
const backImg = document.getElementById('backImg');
const flipCard = document.getElementById('flipCard');
const search = document.getElementById('search');

function renderGrid(filter = '') {
  grid.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const matching = cat.recipes.filter(r => `${r.code} ${r.title}`.toLowerCase().includes(filter.toLowerCase()));
    if (filter && matching.length === 0 && !cat.name.toLowerCase().includes(filter.toLowerCase())) return;
    const tile = document.createElement('article');
    tile.className = 'category-tile';
    tile.style.background = `linear-gradient(135deg, ${cat.color}, #f7f0e4)`;
    tile.innerHTML = `<h2>${cat.name}</h2><div class="emoji">${cat.emoji}</div>`;
    tile.onclick = () => openCategory(cat.id, filter);
    grid.appendChild(tile);
  });
}

function renderTabs() {
  tabs.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.name;
    btn.className = cat.id === activeCategory.id ? 'active' : '';
    btn.onclick = () => openCategory(cat.id);
    tabs.appendChild(btn);
  });
}

function getVisibleRecipes() {
  const filter = search.value.trim().toLowerCase();
  if (!filter) return activeCategory.recipes;
  return activeCategory.recipes.filter(r => `${r.code} ${r.title}`.toLowerCase().includes(filter));
}

function openCategory(id) {
  activeCategory = CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
  document.documentElement.style.setProperty('--accent', activeCategory.color);
  activeIndex = 0;
  grid.classList.add('hidden');
  viewer.classList.remove('hidden');
  renderTabs();
  renderCard();
}

function renderCard() {
  flipCard.classList.remove('flipped');
  const recipes = getVisibleRecipes();
  if (!recipes.length) {
    frontImg.src = 'empty-card.svg';
    backImg.src = 'empty-card.svg';
    counter.textContent = '0 / 0';
    return;
  }
  if (activeIndex >= recipes.length) activeIndex = 0;
  const recipe = recipes[activeIndex];
  frontImg.src = recipe.front;
  backImg.src = recipe.back || recipe.front;
  counter.textContent = `${activeIndex + 1} / ${recipes.length} — ${recipe.code}`;
}

document.getElementById('backBtn').onclick = () => { viewer.classList.add('hidden'); grid.classList.remove('hidden'); };
document.getElementById('prevBtn').onclick = () => { const n = getVisibleRecipes().length; if (n) { activeIndex = (activeIndex - 1 + n) % n; renderCard(); } };
document.getElementById('nextBtn').onclick = () => { const n = getVisibleRecipes().length; if (n) { activeIndex = (activeIndex + 1) % n; renderCard(); } };
document.getElementById('flipBtn').onclick = () => flipCard.classList.toggle('flipped');
document.getElementById('printBtn').onclick = () => window.print();
search.oninput = () => { renderGrid(search.value); if (!viewer.classList.contains('hidden')) { activeIndex = 0; renderCard(); } };

let touchStart = 0;
flipCard.addEventListener('touchstart', e => touchStart = e.changedTouches[0].screenX);
flipCard.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - touchStart;
  if (Math.abs(dx) > 50) (dx < 0 ? document.getElementById('nextBtn') : document.getElementById('prevBtn')).click();
});

renderGrid();
