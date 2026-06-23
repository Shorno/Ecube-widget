"use client";

import { useEffect } from "react";

type TournamentSocketPayload = {
  event?: string;
  data?: unknown;
};

export type TournamentSocketMeta = {
  connectionId: number;
  isReconnect: boolean;
};

type Options = {
  preview?: boolean;
  onMessage: (
    payload: TournamentSocketPayload,
    meta: TournamentSocketMeta,
  ) => void;
  onClose?: () => void;
  onOpen?: (meta: TournamentSocketMeta) => void;
};

const BASE_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 10000;

const MATCH_BOUNDARY_EVENTS = new Set([
  "MATCH_START",
  "MATCH_STARTED",
  "MATCH_END",
  "MATCH_ENDED",
  "MATCH_RESET",
  "NEW_MATCH",
  "match-start",
  "match-started",
  "match-end",
  "match-ended",
  "match-reset",
  "match-disconnected",
]);

function getReconnectDelay(attempt: number) {
  return Math.min(
    MAX_RECONNECT_DELAY_MS,
    BASE_RECONNECT_DELAY_MS * 2 ** Math.min(attempt, 4),
  );
}

export function shouldResetForMatchBoundary(
  eventName: string | undefined,
  meta: TournamentSocketMeta,
) {
  if (!eventName) return false;
  if (eventName === "match-connected") return meta.isReconnect;
  return MATCH_BOUNDARY_EVENTS.has(eventName);
}

export function useTournamentSocket(
  tournamentID: string,
  { preview = false, onMessage, onClose, onOpen }: Options,
) {
  useEffect(() => {
    if (preview || !tournamentID) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (!apiBase) return;

    const wsBase = apiBase.replace(/^https/, "wss").replace(/^http/, "ws");
    const url = `${wsBase}/tournament?id=${tournamentID}`;
    let disposed = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempt = 0;
    let connectionId = 0;

    function clearReconnectTimer() {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }

    function scheduleReconnect() {
      if (disposed || reconnectTimer) return;

      const delay = getReconnectDelay(reconnectAttempt);
      reconnectAttempt += 1;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, delay);
    }

    function connect() {
      if (disposed) return;

      connectionId += 1;
      const meta = {
        connectionId,
        isReconnect: connectionId > 1,
      };
      const socket = new WebSocket(url);
      ws = socket;

      socket.onopen = () => {
        if (disposed || ws !== socket) return;
        reconnectAttempt = 0;
        onOpen?.(meta);
      };

      socket.onmessage = (event) => {
        if (disposed || ws !== socket) return;

        let parsed: TournamentSocketPayload;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          return;
        }

        onMessage(parsed, meta);
      };

      socket.onerror = () => {
        socket.close();
      };

      socket.onclose = () => {
        if (disposed || ws !== socket) return;
        onClose?.();
        scheduleReconnect();
      };
    }

    function reconnectIfNeeded() {
      if (disposed) return;
      const readyState = ws?.readyState;
      if (
        readyState === WebSocket.OPEN ||
        readyState === WebSocket.CONNECTING
      ) {
        return;
      }
      clearReconnectTimer();
      connect();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") reconnectIfNeeded();
    }

    connect();
    window.addEventListener("online", reconnectIfNeeded);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      clearReconnectTimer();
      window.removeEventListener("online", reconnectIfNeeded);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      ws?.close();
    };
  }, [tournamentID, preview, onMessage, onClose, onOpen]);
}
