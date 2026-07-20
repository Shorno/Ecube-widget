import { useEffect, useRef, useState } from "react";

// Same-browser link between the Replay Control (clock owner + data source) and
// any open Replay display. BroadcastChannel never echoes to the sender, so
// there is no feedback loop to guard against.
const CHANNEL = "replay-sync";

// Control side: push clock updates and — when the operator loads a local match
// file — the parsed recording itself to open displays. A display announces
// itself with "hello" on mount; we answer with the current time and, if a local
// match is loaded, its data, so it syncs immediately even while paused.
export function useReplayHost(time, localData, visibleTeamIds) {
  const channelRef = useRef(null);
  const timeRef = useRef(time);
  const dataRef = useRef(localData);
  const visibleTeamIdsRef = useRef(visibleTeamIds);
  const firstData = useRef(true);
  const visibleTeamIdsKey = visibleTeamIds?.join("|") ?? null;

  useEffect(() => {
    visibleTeamIdsRef.current =
      visibleTeamIdsKey === null ? null : visibleTeamIdsKey.split("|");
  }, [visibleTeamIdsKey]);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data?.type === "hello") {
        channel.postMessage({
          type: "state",
          time: timeRef.current,
          data: dataRef.current,
          visibleTeamIds: visibleTeamIdsRef.current,
        });
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
    channelRef.current?.postMessage({
      type: "dataset",
      data: localData,
      visibleTeamIds: visibleTeamIdsRef.current,
    });
  }, [localData]);

  useEffect(() => {
    if (visibleTeamIdsKey === null) return;
    channelRef.current?.postMessage({
      type: "visible-teams",
      teamIds: visibleTeamIdsRef.current,
    });
  }, [visibleTeamIdsKey]);
}

// Display side: mirror the control's clock, and adopt an uploaded match when
// the control broadcasts one (null reverts to the bundled default). Returns the
// latest time and the received local match data, if any.
export function useReplayViewer() {
  const [time, setTime] = useState(0);
  const [localData, setLocalData] = useState(null);
  const [visibleTeamIds, setVisibleTeamIds] = useState(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event) => {
      const message = event.data;
      if (message?.type === "time") {
        setTime(message.time);
      } else if (message?.type === "state") {
        setTime(message.time);
        setLocalData(message.data);
        setVisibleTeamIds(message.visibleTeamIds);
      } else if (message?.type === "dataset") {
        setLocalData(message.data);
        setVisibleTeamIds(message.visibleTeamIds);
        setTime(0);
      } else if (message?.type === "visible-teams") {
        setVisibleTeamIds(message.teamIds);
      }
    };
    channel.postMessage({ type: "hello" });
    return () => channel.close();
  }, []);

  return { time, localData, visibleTeamIds };
}
