// Per-user, per-tournament SSE state.
// Survives Next.js hot-module-replacement via globalThis.
if (!globalThis.__sseStoreV2) {
  globalThis.__sseStoreV2 = new Map(); // Map<key, UserTournamentState>
}

const storeMap = globalThis.__sseStoreV2;
const enc      = new TextEncoder();

function key(userId, tournamentId) {
  return `${userId}_${tournamentId}`;
}

function getState(userId, tournamentId) {
  const k = key(userId, tournamentId);
  if (!storeMap.has(k)) {
    storeMap.set(k, {
      clients:      new Set(),
      currentUrl:   null,
      currentLabel: null,
      hasBeenSet:   false,
      widgetStatus: null,
    });
  }
  return storeMap.get(k);
}

function fmt(event, data) {
  return enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export function addClient(userId, tournamentId, ctrl) {
  getState(userId, tournamentId).clients.add(ctrl);
}

export function removeClient(userId, tournamentId, ctrl) {
  getState(userId, tournamentId).clients.delete(ctrl);
}

export function broadcast(userId, tournamentId, url, label) {
  const state       = getState(userId, tournamentId);
  state.currentUrl  = url;
  state.currentLabel = label ?? url;
  state.hasBeenSet  = true;
  state.widgetStatus = null;

  const msg = fmt("widget-change", { url, label: state.currentLabel });
  for (const ctrl of state.clients) {
    try {
      ctrl.enqueue(msg);
    } catch {
      state.clients.delete(ctrl);
    }
  }
}

export function broadcastWidgetStatus(userId, tournamentId, widgetUrl, failedImages) {
  const state       = getState(userId, tournamentId);
  state.widgetStatus = { widgetUrl, failedImages };

  const msg = fmt("widget-status", { widgetUrl, failedImages });
  for (const ctrl of state.clients) {
    try {
      ctrl.enqueue(msg);
    } catch {
      state.clients.delete(ctrl);
    }
  }
}

export function replayTo(userId, tournamentId, ctrl) {
  const state = getState(userId, tournamentId);
  if (!state.hasBeenSet) return;
  try {
    ctrl.enqueue(fmt("widget-change", { url: state.currentUrl, label: state.currentLabel }));
    if (state.widgetStatus) {
      ctrl.enqueue(fmt("widget-status", state.widgetStatus));
    }
  } catch {
    state.clients.delete(ctrl);
  }
}

export function sendPing(userId, tournamentId, ctrl) {
  const state = getState(userId, tournamentId);
  try {
    ctrl.enqueue(enc.encode(": ping\n\n"));
  } catch {
    state.clients.delete(ctrl);
  }
}

export function getCurrentState(userId, tournamentId) {
  const state = getState(userId, tournamentId);
  return { url: state.currentUrl, label: state.currentLabel };
}
