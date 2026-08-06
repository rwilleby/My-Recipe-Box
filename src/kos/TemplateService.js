import { createId, isoNow } from "./kosCore.js";

function freeze(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(freeze));
  if (value && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, freeze(item)])
      )
    );
  }
  return value;
}

export function createTemplateService({ repository, clock } = {}) {
  if (!repository) throw new Error("TemplateService requires repository");

  function all() {
    return freeze(repository.load().templates || []);
  }

  function get(id) {
    return all().find((item) => item.id === id) || null;
  }

  function save({ id = null, title, description = "", steps = [], tags = [] } = {}) {
    if (!String(title || "").trim()) throw new Error("Template title is required");
    if (!Array.isArray(steps) || steps.length === 0) throw new Error("At least one template step is required");

    const template = {
      id: id || createId("TPL", clock?.()),
      title: String(title).trim(),
      description: String(description || "").trim(),
      steps: steps.map((step, index) => ({
        id: step.id || `step-${index + 1}`,
        action: step.action || "cook",
        title: step.title || `Step ${index + 1}`,
        recipeId: step.recipeId || null,
        defaults: { ...(step.defaults || {}) },
      })),
      tags: [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))],
      updatedAt: isoNow(clock),
      createdAt: isoNow(clock),
    };

    repository.update((state) => {
      state.templates = Array.isArray(state.templates) ? state.templates : [];
      const index = state.templates.findIndex((item) => item.id === template.id);
      if (index >= 0) {
        template.createdAt = state.templates[index].createdAt;
        state.templates[index] = template;
      } else {
        state.templates.push(template);
      }
      return state;
    }, { snapshotReason: "template-saved" });

    return freeze(template);
  }

  function remove(id) {
    let removed = null;
    repository.update((state) => {
      state.templates = Array.isArray(state.templates) ? state.templates : [];
      const index = state.templates.findIndex((item) => item.id === id);
      if (index >= 0) removed = state.templates.splice(index, 1)[0];
      return state;
    }, { snapshotReason: "template-removed" });
    return removed ? freeze(removed) : null;
  }

  function instantiate(id, overrides = {}) {
    const template = get(id);
    if (!template) throw new Error(`Template not found: ${id}`);
    return freeze({
      templateId: template.id,
      title: overrides.title || template.title,
      steps: template.steps.map((step) => ({
        ...step,
        defaults: { ...step.defaults, ...(overrides[step.id] || {}) },
      })),
    });
  }

  return Object.freeze({ all, get, save, remove, instantiate });
}

export default createTemplateService;
