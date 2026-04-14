import { addClient, removeClient, replayTo, sendPing } from "@/lib/sse-store";

export const dynamic = "force-dynamic";

export async function GET() {
  let ctrl;

  const stream = new ReadableStream({
    start(c) {
      ctrl = c;
      addClient(ctrl);
      // Send the current widget immediately so reconnecting displays catch up
      replayTo(ctrl);
      // Keep-alive ping every 25 s to prevent proxy / browser timeouts
      ctrl._ping = setInterval(() => sendPing(ctrl), 25_000);
    },
    cancel() {
      clearInterval(ctrl._ping);
      removeClient(ctrl);
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
