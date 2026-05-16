// Per-tournament SSE state.
// Survives Next.js hot-module-replacement via globalThis.
if (!globalThis.__sseStoreV2) {
  globalThis.__sseStoreV2 = new Map(); // Map<tournamentId, TournamentState>
}

const storeMap = globalThis.__sseStoreV2;
const enc      = new TextEncoder();

function getState(tournamentId) {
  if (!storeMap.has(tournamentId)) {
    storeMap.set(tournamentId, {
      clients:      new Set(),
      currentUrl:   null,
      currentLabel: null,
      hasBeenSet:   false,
      widgetStatus: null,
    });
  }
  return storeMap.get(tournamentId);
}

function fmt(event, data) {
  return enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export function addClient(tournamentId, ctrl) {
  getState(tournamentId).clients.add(ctrl);
}

export function removeClient(tournamentId, ctrl) {
  getState(tournamentId).clients.delete(ctrl);
}

export function broadcast(tournamentId, url, label) {
  const state        = getState(tournamentId);
  state.currentUrl   = url;
  state.currentLabel = label ?? url;
  state.hasBeenSet   = true;
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

export function broadcastWidgetStatus(tournamentId, widgetUrl, failedImages) {
  const state        = getState(tournamentId);
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

export function replayTo(tournamentId, ctrl) {
  const state = getState(tournamentId);
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

export function sendPing(tournamentId, ctrl) {
  const state = getState(tournamentId);
  try {
    ctrl.enqueue(enc.encode(": ping\n\n"));
  } catch {
    state.clients.delete(ctrl);
  }
}

export function getCurrentState(tournamentId) {
  const state = getState(tournamentId);
  return { url: state.currentUrl, label: state.currentLabel };
}
