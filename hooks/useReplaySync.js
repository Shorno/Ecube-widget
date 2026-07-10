import { useEffect, useRef, useState } from "react";

// Same-browser link between the Replay Control (clock owner + data source) and
// any open Replay display. BroadcastChannel never echoes to the sender, so
// there is no feedback loop to guard against.
const CHANNEL = "replay-sync";

// Control side: push clock updates and — when the operator loads a local match
// file — the parsed recording itself to open displays. A display announces
// itself with "hello" on mount; we answer with the current time and, if a local
// match is loaded, its data, so it syncs immediately even while paused.
export function useReplayHost(time, localData) {
  const channelRef = useRef(null);
  const timeRef = useRef(time);
  const dataRef = useRef(localData);
  const firstData = useRef(true);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data?.type === "hello") {
        channel.postMessage({ type: "time", time: timeRef.current });
        if (dataRef.current) {
          channel.postMessage({ type: "dataset", data: dataRef.current });
        }
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

  // Broadcast the loaded match to displays. Skip the initial null so opening
  // the control never wipes a display that is already showing an uploaded match.
  useEffect(() => {
    dataRef.current = localData;
    if (firstData.current) {
      firstData.current = false;
      return;
    }
    channelRef.current?.postMessage({ type: "dataset", data: localData });
  }, [localData]);
}

// Display side: mirror the control's clock, and adopt an uploaded match when
// the control broadcasts one (null reverts to the bundled default). Returns the
// latest time and the received local match data, if any.
export function useReplayViewer() {
  const [time, setTime] = useState(0);
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event) => {
      const message = event.data;
      if (message?.type === "time") {
        setTime(message.time);
      } else if (message?.type === "dataset") {
        setLocalData(message.data);
        setTime(0);
      }
    };
    channel.postMessage({ type: "hello" });
    return () => channel.close();
  }, []);

  return { time, localData };
}
