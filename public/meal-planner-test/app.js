'use strict';

const FALLBACK_IMAGE = '../images/thumbs/heroes/AM-000.webp';

const RECIPES = [
  { id: 'AM-001', name: 'Salisbury Steak', type: 'main', balance: 7, image: '../images/thumbs/recipes/AM-001.webp' },
  { id: 'AM-014', name: 'Chicken-Fried Steak', type: 'main', balance: 8, image: '../images/thumbs/recipes/AM-014.webp' },
  { id: 'AM-021', name: 'Roasted Herb Chicken', type: 'main', balance: 5, image: '../images/thumbs/recipes/AM-021.webp' },
  { id: 'AS-002', name: 'Garlic Mashed Potatoes', type: 'side', balance: 6, image: '../images/thumbs/recipes/AS-002.webp' },
  { id: 'AS-008', name: 'Southern Green Beans', type: 'side', balance: 4, image: '../images/thumbs/recipes/AS-008.webp' },
  { id: 'AS-010', name: 'Roasted Carrots', type: 'side', balance: 3, image: '../images/thumbs/recipes/AS-010.webp' },
  { id: 'AS-014', name: 'Macaroni and Cheese', type: 'side', balance: 8, image: '../images/thumbs/recipes/AS-014.webp' },
  { id: 'AS-023', name: 'Simple Garden Salad', type: 'side', balance: 1, image: '../images/thumbs/recipes/AS-023.webp' }
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOT_LABELS = { main: 'Main Dish', side1: 'Side 1', side2: 'Side 2' };
const STORAGE_KEY = 'rrb-meal-planner-test-v2';

let planner = loadPlanner();
let activeFilter = 'all';
let selectedRecipeId = null;

const recipeTray = document.getElementById('recipeTray');
const weekGrid = document.getElementById('weekGrid');
const recipeSearch = document.getElementById('recipeSearch');
const recipeCount = document.getElementById('recipeCount');
const saveStatus = document.getElementById('saveStatus');
const slotDialog = document.getElementById('slotDialog');
const dialogRecipeName = document.getElementById('dialogRecipeName');
const dialogDay = document.getElementById('dialogDay');
const dialogSlot = document.getElementById('dialogSlot');

function emptyPlanner() {
  return DAYS.reduce((acc, day) => {
    acc[day] = { main: null, side1: null, side2: null };
    return acc;
  }, {});
}

function normalizePlanner(value) {
  const clean = emptyPlanner();
  if (!value || typeof value !== 'object') return clean;

  DAYS.forEach(day => {
    const savedDay = value[day];
    if (!savedDay || typeof savedDay !== 'object') return;
    Object.keys(SLOT_LABELS).forEach(slot => {
      const recipeId = savedDay[slot];
      clean[day][slot] = recipeById(recipeId) ? recipeId : null;
    });
  });
  return clean;
}

function loadPlanner() {
  try {
    return normalizePlanner(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return emptyPlanner();
  }
}

function savePlanner() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(planner));
  saveStatus.textContent = 'Saved just now';
  window.setTimeout(() => { saveStatus.textContent = 'Saved automatically'; }, 1200);
}

function recipeById(id) {
  return RECIPES.find(recipe => recipe.id === id) || null;
}

function imageMarkup(recipe, className = '') {
  return `<img class="${className}" src="${recipe.image}" alt="${recipe.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">`;
}

function renderRecipes() {
  const search = recipeSearch.value.trim().toLowerCase();
  const filtered = RECIPES.filter(recipe => {
    const filterMatch = activeFilter === 'all' || recipe.type === activeFilter;
    const searchMatch = !search || `${recipe.id} ${recipe.name}`.toLowerCase().includes(search);
    return filterMatch && searchMatch;
  });

  recipeCount.textContent = `${filtered.length} recipes`;
  recipeTray.innerHTML = filtered.map(recipe => `
    <article class="recipe-card" draggable="true" data-recipe-id="${recipe.id}">
      ${imageMarkup(recipe)}
      <div>
        <h3>${recipe.name}</h3>
        <p class="recipe-meta">${recipe.id} · ${recipe.type === 'main' ? 'Main Dish' : 'Side Dish'} · MB ${recipe.balance}</p>
        <button class="add-mobile" type="button" data-add-id="${recipe.id}">Add to Planner</button>
      </div>
    </article>
  `).join('');

  recipeTray.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('dragstart', event => {
      card.classList.add('dragging');
      event.dataTransfer.setData('text/plain', card.dataset.recipeId);
      event.dataTransfer.effectAllowed = 'copy';
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });

  recipeTray.querySelectorAll('[data-add-id]').forEach(button => {
    button.addEventListener('click', () => openAddDialog(button.dataset.addId));
  });
}

function renderPlanner() {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setHours(0, 0, 0, 0);
  sunday.setDate(now.getDate() - now.getDay());

  weekGrid.innerHTML = DAYS.map((day, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    const dateText = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const slots = planner[day];
    return `
      <section class="day-card" data-day="${day}">
        <div class="day-heading">
          <h3>${day}</h3>
          <span class="day-date">${dateText}</span>
        </div>
        <div class="slots">
          ${Object.keys(SLOT_LABELS).map(slot => renderSlot(day, slot, slots[slot])).join('')}
        </div>
        <div class="day-balance">${balanceText(slots)}</div>
      </section>
    `;
  }).join('');

  weekGrid.querySelectorAll('.drop-slot').forEach(slot => {
    slot.addEventListener('dragover', event => {
      event.preventDefault();
      slot.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', event => {
      event.preventDefault();
      slot.classList.remove('drag-over');
      placeRecipe(slot.dataset.day, slot.dataset.slot, event.dataTransfer.getData('text/plain'));
    });
  });

  weekGrid.querySelectorAll('[data-remove-day]').forEach(button => {
    button.addEventListener('click', () => {
      planner[button.dataset.removeDay][button.dataset.removeSlot] = null;
      savePlanner();
      renderPlanner();
    });
  });
}

function renderSlot(day, slot, recipeId) {
  const recipe = recipeById(recipeId);
  return `
    <div class="drop-slot" data-day="${day}" data-slot="${slot}">
      <div class="slot-label"><span>${SLOT_LABELS[slot]}</span><span>${slot === 'main' ? 'M' : 'S'}</span></div>
      ${recipe ? `
        <div class="meal-item">
          <button class="remove-item" type="button" data-remove-day="${day}" data-remove-slot="${slot}" aria-label="Remove ${recipe.name}">×</button>
          ${imageMarkup(recipe)}
          <strong>${recipe.name}</strong>
          <small>${recipe.id}</small>
        </div>
      ` : `<div class="slot-empty">Drop a ${slot === 'main' ? 'main dish' : 'side dish'} here</div>`}
    </div>
  `;
}

function slotAcceptsRecipe(slot, recipe) {
  return slot === 'main' ? recipe.type === 'main' : recipe.type === 'side';
}

function placeRecipe(day, slot, recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe || !DAYS.includes(day) || !(slot in SLOT_LABELS)) return;

  if (!slotAcceptsRecipe(slot, recipe)) {
    saveStatus.textContent = slot === 'main'
      ? 'Choose a main dish for this position'
      : 'Choose a side dish for this position';
    window.setTimeout(() => { saveStatus.textContent = 'Saved automatically'; }, 1800);
    return;
  }

  planner[day][slot] = recipe.id;
  savePlanner();
  renderPlanner();
}

function balanceText(slots) {
  const selected = Object.values(slots).map(recipeById).filter(Boolean);
  if (!selected.length) return 'MealBalance: No dishes selected';
  const average = Math.round(selected.reduce((sum, recipe) => sum + recipe.balance, 0) / selected.length);
  const label = average <= 3 ? 'Light' : average <= 6 ? 'Moderate' : 'Rich';
  return `MealBalance: ${average} — ${label}`;
}

function openAddDialog(recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  selectedRecipeId = recipeId;
  dialogRecipeName.textContent = recipe.name;
  dialogSlot.value = recipe.type === 'main' ? 'main' : 'side1';

  Array.from(dialogSlot.options).forEach(option => {
    option.disabled = recipe.type === 'main'
      ? option.value !== 'main'
      : option.value === 'main';
  });

  if (typeof slotDialog.showModal === 'function') {
    slotDialog.showModal();
  } else {
    slotDialog.setAttribute('open', '');
  }
}

dialogDay.innerHTML = DAYS.map(day => `<option value="${day}">${day}</option>`).join('');
document.getElementById('confirmAdd').addEventListener('click', event => {
  event.preventDefault();
  placeRecipe(dialogDay.value, dialogSlot.value, selectedRecipeId);
  slotDialog.close?.();
  slotDialog.removeAttribute('open');
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderRecipes();
  });
});

recipeSearch.addEventListener('input', renderRecipes);
document.getElementById('clearPlanner').addEventListener('click', () => {
  if (!window.confirm('Clear every meal from this test week?')) return;
  planner = emptyPlanner();
  savePlanner();
  renderPlanner();
});
document.getElementById('printPlanner').addEventListener('click', () => window.print());

renderRecipes();
renderPlanner();
