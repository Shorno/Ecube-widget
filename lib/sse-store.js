// Use globalThis so the singleton survives hot-module-replacement in Next.js dev mode.
// Module-level variables get re-initialised on each hot reload; globalThis persists.
if (!globalThis.__sseStore) {
  globalThis.__sseStore = {
    clients: new Set(), // Set<ReadableStreamDefaultController>
    currentUrl: null,
    currentLabel: null,
    hasBeenSet: false, // distinguishes "never set" from "cleared to null"
    widgetStatus: null, // { widgetUrl, failedImages: [] } | null
  };
}

const store = globalThis.__sseStore;
const enc = new TextEncoder();

function fmt(event, data) {
  return enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export function addClient(ctrl) {
  store.clients.add(ctrl);
}

export function removeClient(ctrl) {
  store.clients.delete(ctrl);
}

export function broadcast(url, label) {
  store.currentUrl = url;
  store.currentLabel = label ?? url;
  store.hasBeenSet = true;
  // Clear any previous widget error when a new widget is activated
  store.widgetStatus = null;
  const msg = fmt("widget-change", { url, label: store.currentLabel });
  for (const ctrl of store.clients) {
    try {
      ctrl.enqueue(msg);
    } catch {
      store.clients.delete(ctrl);
    }
  }
}

// Called when a widget reports an image failed to load.
// Stores the failure and broadcasts it so the controller can display a warning.
export function broadcastWidgetStatus(widgetUrl, failedImages) {
  store.widgetStatus = { widgetUrl, failedImages };
  const msg = fmt("widget-status", { widgetUrl, failedImages });
  for (const ctrl of store.clients) {
    try {
      ctrl.enqueue(msg);
    } catch {
      store.clients.delete(ctrl);
    }
  }
}

// Replay the current widget state to a newly connected client.
export function replayTo(ctrl) {
  if (!store.hasBeenSet) return;
  try {
    ctrl.enqueue(fmt("widget-change", { url: store.currentUrl, label: store.currentLabel }));
    // Also replay any active widget error so a freshly opened controller sees it
    if (store.widgetStatus) {
      ctrl.enqueue(fmt("widget-status", store.widgetStatus));
    }
  } catch {
    store.clients.delete(ctrl);
  }
}

export function sendPing(ctrl) {
  try {
    ctrl.enqueue(enc.encode(": ping\n\n"));
  } catch {
    store.clients.delete(ctrl);
  }
}

export function getCurrentState() {
  return { url: store.currentUrl, label: store.currentLabel };
}
