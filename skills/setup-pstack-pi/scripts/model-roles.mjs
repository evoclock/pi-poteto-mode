// Pure configuration preview and lookup. No discovery, writes, spawning or model defaults.
const SCALARS = ['development', 'independent-review', 'swarm workers'];
const PANELS = ['arena runners', 'arena cross-judge pool', 'architect runners', 'interrogate reviewers'];
const EFFORTS = { unlimited: 'max', large: 'xhigh', medium: 'high', small: 'medium' };

function checkConfig(config) {
  if (config?.schema !== 'pstack-model-roles.v1') throw new Error('Unsupported role-map schema.');
  if (!config.roles || typeof config.roles !== 'object' || Array.isArray(config.roles)) throw new Error('Expected a roles object.');
}

export function budgetSetting(config) {
  if (config.budget === undefined) return null;
  const budget = config.budget;
  if (!budget || !Object.hasOwn(EFFORTS, budget.label) || budget.effort !== EFFORTS[budget.label]) {
    throw new Error('Invalid budget label/effort pair; preview an explicit supported budget.');
  }
  return structuredClone(budget);
}

export function roleModels(config, role, available) {
  checkConfig(config);
  if (!SCALARS.includes(role) && !PANELS.includes(role)) throw new Error(`Unsupported role: ${role}`);
  const value = config.roles[role];
  if (value === undefined || value === null || value === '') {
    throw new Error(`pstack role ${role} is not configured at .pi/pstack-model-roles.v1.json; run /skill:setup-pstack-pi`);
  }
  const panel = PANELS.includes(role);
  if (panel !== Array.isArray(value)) throw new Error(`Expected ${panel ? 'a panel list' : 'a scalar identity'} for ${role}.`);
  const models = panel ? value : [value];
  if (!models.length) throw new Error(`Empty panel: ${role}`);
  for (const model of models) {
    if (typeof model !== 'string' || ['auto', 'inherit-parent'].includes(model) || !available.includes(model)) {
      throw new Error(`An unavailable or invalid identity blocks role ${role}.`);
    }
  }
  return [...models];
}

export function previewSetup(current, selections, available) {
  checkConfig(current);
  if (!selections || typeof selections !== 'object' || Array.isArray(selections)) throw new Error('Expected a selections object.');
  for (const key of ['roles', 'budget']) {
    if (Object.hasOwn(selections, key) && (!selections[key] || typeof selections[key] !== 'object' || Array.isArray(selections[key]))) {
      throw new Error(`Expected an object for ${key}.`);
    }
  }
  const next = structuredClone({
    ...current,
    ...selections,
    roles: { ...current.roles, ...selections.roles },
    ...(selections.budget !== undefined ? { budget: { ...current.budget, ...selections.budget } } : {}),
  });
  checkConfig(next);
  budgetSetting(next);
  for (const role of [...SCALARS, ...PANELS]) {
    if (role === 'development' || role === 'independent-review' || Object.hasOwn(next.roles, role)) {
      roleModels(next, role, available);
    }
  }
  return next;
}
