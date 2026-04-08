export default async function getCircleInfo() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);
  const emptyPayload = {
    GameStartTime: "",
    GameTime: "",
    CircleStatus: "0",
    CircleIndex: "0",
    Counter: "0",
    MaxTime: "0",
  };

  try {
    const res = await fetch("/api/getcircleinfo", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return emptyPayload;

    const data = await res.json();
    const payload = data?.circleInfo ?? data;

    return {
      GameStartTime:
        payload?.GameStartTime === undefined || payload?.GameStartTime === null
          ? ""
          : String(payload.GameStartTime),
      GameTime:
        payload?.GameTime === undefined || payload?.GameTime === null
          ? ""
          : String(payload.GameTime),
      CircleStatus: String(payload?.CircleStatus ?? "0"),
      CircleIndex: String(payload?.CircleIndex ?? "0"),
      Counter: String(payload?.Counter ?? "0"),
      MaxTime: String(payload?.MaxTime ?? "0"),
    };
  } catch {
    return emptyPayload;
  } finally {
    clearTimeout(timeoutId);
  }
}
