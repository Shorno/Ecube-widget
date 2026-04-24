import {
  addClient as addClientV2,
  removeClient as removeClientV2,
  replayTo as replayToV2,
  sendPing as sendPingV2,
} from "@/lib/sse/store";
import { addClient, removeClient, replayTo, sendPing } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId       = searchParams.get("userId");
  const tournamentId = searchParams.get("tournamentId");

  // Per-user mode when both params present
  const isUserMode = !!(userId && tournamentId);

  let ctrl;

  const stream = new ReadableStream({
    start(c) {
      ctrl = c;

      if (isUserMode) {
        addClientV2(userId, tournamentId, ctrl);
        replayToV2(userId, tournamentId, ctrl);
        ctrl._ping = setInterval(() => sendPingV2(userId, tournamentId, ctrl), 25_000);
      } else {
        addClient(ctrl);
        replayTo(ctrl);
        ctrl._ping = setInterval(() => sendPing(ctrl), 25_000);
      }
    },
    cancel() {
      clearInterval(ctrl._ping);
      if (isUserMode) {
        removeClientV2(userId, tournamentId, ctrl);
      } else {
        removeClient(ctrl);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
