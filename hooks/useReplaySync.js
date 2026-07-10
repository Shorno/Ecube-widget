import { useEffect, useRef, useState } from "react";

// Same-browser link between the Replay Control (clock owner) and any open
// Replay display. BroadcastChannel never echoes to the sender, so there is no
// feedback loop to guard against.
const CHANNEL = "replay-sync";

// Control side: push every clock update to open displays. A display announces
// itself with "hello" on mount; we answer with the current time so it syncs
// immediately even while playback is paused.
export function useReplayHost(time) {
  const channelRef = useRef(null);
  const timeRef = useRef(time);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data?.type === "hello") {
        channel.postMessage({ type: "time", time: timeRef.current });
      }
    };
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    timeRef.current = time;
    channelRef.current?.postMessage({ type: "time", time });
  }, [time]);
}

// Display side: mirror the control's clock. Returns the latest broadcast time;
// sends "hello" on mount to pull the current time from an already-running
// control.
export function useReplayViewer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event) => {
      if (event.data?.type === "time") setTime(event.data.time);
    };
    channel.postMessage({ type: "hello" });
    return () => channel.close();
  }, []);

  return time;
}
