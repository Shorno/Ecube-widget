import { after } from "next/server";
import { logRequest, flushLogs } from "./logger";

/**
 * Stamps timing on a request and records it after the response is sent.
 * Does not delay the response — uses next/server after().
 *
 * Usage:
 *   export async function GET(request) {
 *     trackRequest(request, "/api/user/settings", "GET");
 *     ...
 *   }
 */
export function trackRequest(request, route, method) {
  const start = parseInt(request.headers.get("x-req-start") ?? "0", 10) || Date.now();

  after(async () => {
    logRequest({ route, method: method ?? request.method, status: 200, durationMs: Date.now() - start });
    await flushLogs();
  });
}

/**
 * Wraps a handler to record timing including the real response status.
 *
 * Usage:
 *   export const POST = withTracking("/api/sse/command", async (request) => { ... });
 */
export function withTracking(route, handler) {
  return async function trackedHandler(request, ctx) {
    const start    = parseInt(request.headers.get("x-req-start") ?? "0", 10) || Date.now();
    const response = await handler(request, ctx);
    const durationMs = Date.now() - start;

    after(async () => {
      logRequest({ route, method: request.method, status: response.status, durationMs });
      await flushLogs();
    });

    return response;
  };
}
