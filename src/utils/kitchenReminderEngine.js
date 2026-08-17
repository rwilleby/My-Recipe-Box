const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function daysUntil(dateValue, now) {
  if (!dateValue) return null;
  const target = new Date(`${dateValue}T00:00:00`).getTime();
  if (!Number.isFinite(target)) return null;
  return Math.ceil((target - startOfDay(now)) / DAY_MS);
}

function plannedMealCount(plan) {
  return Object.values(plan || {}).reduce(
    (total, meals) => total + (Array.isArray(meals) ? meals.length : 0),
    0,
  );
}

function mergedInventoryEntries(inventory, availabilityKey) {
  const savedItems = inventory?.items && typeof inventory.items === "object"
    ? inventory.items
    : {};
  const customItems = Array.isArray(inventory?.customItems) ? inventory.customItems : [];
  const customIds = new Set(customItems.map((item) => item?.id).filter(Boolean));
  const custom = customItems.map((item) => ({ ...item, ...(savedItems[item.id] || {}) }));
  const saved = Object.entries(savedItems)
    .filter(([id]) => !customIds.has(id))
    .map(([, item]) => item);

  return [...custom, ...saved].filter((item) => Boolean(item?.[availabilityKey]));
}

function countUseSoon(entries, now, maxDays) {
  return entries.filter((item) => {
    const remaining = daysUntil(item?.useByDate, now);
    return remaining !== null && remaining <= maxDays;
  }).length;
}

function countPreparedUseSoon(preparedInventory, now) {
  const entries = [
    ...(Array.isArray(preparedInventory?.records) ? preparedInventory.records : []),
    ...(Array.isArray(preparedInventory?.managedItems) ? preparedInventory.managedItems : []),
  ];

  return entries.filter((item) => {
    if (Number(item?.packagesAvailable || 0) <= 0) return false;
    const remaining = daysUntil(item?.useByDate, now);
    return remaining !== null && remaining <= 30;
  }).length;
}

export function buildKitchenReminders({
  now = Date.now(),
  backup = {},
  plan = {},
  weekendPlan = {},
  refrigerator = {},
  freezer = {},
  preparedInventory = {},
} = {}) {
  const reminders = [];
  const mealCount = plannedMealCount(plan);
  const backupDue = Boolean(backup?.due ?? backup?.isDue);

  if (backupDue) {
    reminders.push({
      id: "backup-due",
      priority: 100,
      tone: "urgent",
      eyebrow: "Protect your recipe box",
      message: backup?.lastBackupAt
        ? "Your recipe-box backup is due. Save a fresh copy of your data."
        : "You have not created a recipe-box backup yet. Save your first copy now.",
      actionLabel: "Back Up Now",
      page: "User Backup",
    });
  }

  const refrigeratorUseSoon = countUseSoon(
    mergedInventoryEntries(refrigerator, "inFridge"),
    now,
    3,
  );
  if (refrigeratorUseSoon > 0) {
    reminders.push({
      id: "refrigerator-use-soon",
      priority: 90,
      tone: "warning",
      eyebrow: "Use food first",
      message: `${refrigeratorUseSoon} refrigerator item${refrigeratorUseSoon === 1 ? " is" : "s are"} due within 3 days or overdue.`,
      actionLabel: "Check Refrigerator",
      page: "Kitchen Refrigerator",
    });
  }

  const freezerUseSoon = countUseSoon(
    mergedInventoryEntries(freezer, "onHand"),
    now,
    30,
  ) + countPreparedUseSoon(preparedInventory, now);
  if (freezerUseSoon > 0) {
    reminders.push({
      id: "freezer-use-soon",
      priority: 80,
      tone: "warning",
      eyebrow: "Freezer check",
      message: `${freezerUseSoon} frozen item${freezerUseSoon === 1 ? " has" : "s have"} a use-by date within 30 days or earlier.`,
      actionLabel: "Review Frozen Meals",
      page: "Freezer Inventory Management",
    });
  }

  const weekendItems = Array.isArray(weekendPlan?.items) ? weekendPlan.items : [];
  const unfinishedBatches = weekendItems.filter((item) => !item?.completed).length;
  if (unfinishedBatches > 0) {
    reminders.push({
      id: "weekend-bulk-unfinished",
      priority: 70,
      tone: "info",
      eyebrow: "Weekend bulk cooking",
      message: `${unfinishedBatches} planned batch${unfinishedBatches === 1 ? " is" : "es are"} waiting to be cooked or recorded.`,
      actionLabel: "Open Bulk Plan",
      page: "Weekend Bulk Meal Planner",
    });
  } else if ([4, 5, 6].includes(new Date(now).getDay())) {
    reminders.push({
      id: "weekend-bulk-plan",
      priority: 50,
      tone: "info",
      eyebrow: "Plan the weekend",
      message: "Take a minute to plan your weekend bulk cooking session.",
      actionLabel: "Plan Bulk Cooking",
      page: "Weekend Bulk Meal Planner",
    });
  }

  if (mealCount === 0) {
    reminders.push({
      id: "meal-plan-empty",
      priority: 40,
      tone: "info",
      eyebrow: "Plan ahead",
      message: "Your two-week meal plan is empty. Add a few dinners to make the week easier.",
      actionLabel: "Plan Meals",
      page: "Meal Planner",
    });
  } else {
    reminders.push({
      id: "shopping-list-review",
      priority: 20,
      tone: "info",
      eyebrow: "Before you shop",
      message: `Review the shopping list for your ${mealCount} planned meal${mealCount === 1 ? "" : "s"}.`,
      actionLabel: "Review Shopping List",
      page: "Shopping Lists",
    });
  }

  return reminders.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}

export const KITCHEN_REMINDER_SNOOZE_KEY = "rrb_kitchen_reminder_snoozes_v1";
export const WEEKEND_BULK_PLAN_KEY = "rrb_weekendBulkMealPlanner_v1";
