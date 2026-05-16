import { addClient, removeClient, replayTo, sendPing } from "@/lib/sse/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId") ?? "";

  let ctrl;

  const stream = new ReadableStream({
    start(c) {
      ctrl = c;
      addClient(tournamentId, ctrl);
      replayTo(tournamentId, ctrl);
      ctrl._ping = setInterval(() => sendPing(tournamentId, ctrl), 25_000);
    },
    cancel() {
      clearInterval(ctrl._ping);
      removeClient(tournamentId, ctrl);
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
