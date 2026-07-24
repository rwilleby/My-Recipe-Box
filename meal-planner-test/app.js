'use strict';

const RECIPES = [
  { id: 'AM-001', name: 'Salisbury Steak', type: 'main', balance: 7, image: 'https://placehold.co/480x320/f6eee5/8f1f22?text=Salisbury+Steak' },
  { id: 'AM-014', name: 'Chicken-Fried Steak', type: 'main', balance: 8, image: 'https://placehold.co/480x320/f6eee5/8f1f22?text=Chicken-Fried+Steak' },
  { id: 'AM-021', name: 'Roasted Herb Chicken', type: 'main', balance: 5, image: 'https://placehold.co/480x320/f6eee5/8f1f22?text=Herb+Chicken' },
  { id: 'AS-002', name: 'Garlic Mashed Potatoes', type: 'side', balance: 6, image: 'https://placehold.co/480x320/edf2e6/42612b?text=Mashed+Potatoes' },
  { id: 'AS-008', name: 'Southern Green Beans', type: 'side', balance: 4, image: 'https://placehold.co/480x320/edf2e6/42612b?text=Green+Beans' },
  { id: 'AS-010', name: 'Roasted Carrots', type: 'side', balance: 3, image: 'https://placehold.co/480x320/edf2e6/42612b?text=Roasted+Carrots' },
  { id: 'AS-014', name: 'Macaroni and Cheese', type: 'side', balance: 8, image: 'https://placehold.co/480x320/edf2e6/42612b?text=Mac+and+Cheese' },
  { id: 'AS-023', name: 'Simple Garden Salad', type: 'side', balance: 1, image: 'https://placehold.co/480x320/edf2e6/42612b?text=Garden+Salad' }
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOT_LABELS = { main: 'Main Dish', side1: 'Side 1', side2: 'Side 2' };
const STORAGE_KEY = 'rrb-meal-planner-test-v1';

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

function loadPlanner() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === 'object' ? { ...emptyPlanner(), ...saved } : emptyPlanner();
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
      <img src="${recipe.image}" alt="${recipe.name}">
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
          <img src="${recipe.image}" alt="${recipe.name}">
          <strong>${recipe.name}</strong>
          <small>${recipe.id}</small>
        </div>
      ` : `<div class="slot-empty">Drop a ${slot === 'main' ? 'main dish' : 'side dish'} here</div>`}
    </div>
  `;
}

function placeRecipe(day, slot, recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  planner[day][slot] = recipe.id;
  savePlanner();
  renderPlanner();
}

function balanceText(slots) {
  const recipes = Object.values(slots).map(recipeById).filter(Boolean);
  if (!recipes.length) return 'MealBalance: No dishes selected';
  const average = Math.round(recipes.reduce((sum, recipe) => sum + recipe.balance, 0) / recipes.length);
  const label = average <= 3 ? 'Light' : average <= 6 ? 'Moderate' : 'Rich';
  return `MealBalance: ${average} — ${label}`;
}

function openAddDialog(recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  selectedRecipeId = recipeId;
  dialogRecipeName.textContent = recipe.name;
  dialogSlot.value = recipe.type === 'main' ? 'main' : 'side1';
  slotDialog.showModal();
}

dialogDay.innerHTML = DAYS.map(day => `<option value="${day}">${day}</option>`).join('');
document.getElementById('confirmAdd').addEventListener('click', event => {
  event.preventDefault();
  placeRecipe(dialogDay.value, dialogSlot.value, selectedRecipeId);
  slotDialog.close();
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
