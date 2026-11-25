// Read-only resolution and setup preview. The host resolves Pi's live default.
import { readFileSync } from 'node:fs';
const SCALARS = ['development', 'independent-review', 'swarm workers'];
const PANELS = ['arena runners', 'arena cross-judge pool', 'architect runners', 'interrogate reviewers'];
const EFFORTS = { unlimited: 'max', large: 'xhigh', medium: 'high', small: 'medium' };

function checkConfig(config) {
  if (!config || Array.isArray(config) || config.schema !== 'pstack-model-roles.v1') throw new Error('Unsupported role-map schema.');
  if (!config.roles || typeof config.roles !== 'object' || Array.isArray(config.roles)) throw new Error('Expected a roles object.');
}

export function budgetSetting(config) {
  if (config.budget === undefined) return null;
  const budget = config.budget;
  if (!budget || typeof budget !== 'object' || Array.isArray(budget) || !Object.hasOwn(EFFORTS, budget.label) || budget.effort !== EFFORTS[budget.label]) {
    throw new Error('Invalid budget label/effort pair; preview an explicit supported budget.');
  }
  return structuredClone(budget);
}

export function readRoleModels(path, role, available, resolveDefault) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return roleModels(undefined, role, available, resolveDefault);
  }
  let config;
  try {
    config = JSON.parse(text);
  } catch {
    throw new Error('Malformed role-map JSON.');
  }
  return roleModels(config, role, available, resolveDefault);
}

export function roleModels(config, role, available, resolveDefault) {
  if (!SCALARS.includes(role) && !PANELS.includes(role)) throw new Error(`Unsupported role: ${role}`);
  if (config === undefined) {
    if (typeof resolveDefault !== 'function') throw new Error('A runtime Pi default resolver is required.');
    const model = resolveDefault();
    checkIdentity(model, role, available);
    return [model];
  }
  checkConfig(config);
  budgetSetting(config);
  for (const configured of [...SCALARS, ...PANELS]) {
    const value = config.roles[configured];
    if (value !== undefined && value !== null) configuredModels(value, configured, available);
  }
  return configuredModels(config.roles[role], role, available);
}

function checkIdentity(model, role, available) {
  if (typeof model !== 'string' || !model.trim() || ['auto', 'inherit-parent'].includes(model) || !available.includes(model)) {
    throw new Error(`An unavailable or invalid identity blocks role ${role}.`);
  }
}

function configuredModels(value, role, available) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`pstack role ${role} is not configured in the present .pi/pstack-model-roles.v1.json.`);
  }
  const panel = PANELS.includes(role);
  if (panel !== Array.isArray(value)) throw new Error(`Expected ${panel ? 'a panel list' : 'a scalar identity'} for ${role}.`);
  const models = panel ? value : [value];
  if (!models.length) throw new Error(`Empty panel: ${role}`);
  for (const model of models) {
    checkIdentity(model, role, available);
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
    if (next.roles[role] !== undefined && next.roles[role] !== null) {
      roleModels(next, role, available);
    }
  }
  return next;
}
