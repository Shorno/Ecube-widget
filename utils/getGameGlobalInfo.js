export default async function getGameGlobalInfo() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);
  const emptyPayload = {
    CircleArray: [],
    PlaneStartLocX: "0",
    PlaneStartLocY: "0",
    PlaneStopLocX: "0",
    PlaneStopLocY: "0",
  };

  try {
    const res = await fetch("/api/getgameglobalinfo", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return emptyPayload;

    const data = await res.json();
    // Some backends wrap the payload as { gameGlobalInfo: { ... } }.
    // Normalize here so callers can always read CircleArray/Plane* directly.
    const payload = data?.gameGlobalInfo ?? data ?? {};
    const circles = Array.isArray(payload?.CircleArray)
      ? payload.CircleArray.filter((c) => c).map((c) => ({
          X: String(c.X ?? "0"),
          Y: String(c.Y ?? "0"),
          Size: String(c.Size ?? "0"),
        }))
      : [];

    return {
      CircleArray: circles,
      PlaneStartLocX: String(payload?.PlaneStartLocX ?? "0"),
      PlaneStartLocY: String(payload?.PlaneStartLocY ?? "0"),
      PlaneStopLocX: String(payload?.PlaneStopLocX ?? "0"),
      PlaneStopLocY: String(payload?.PlaneStopLocY ?? "0"),
    };
  } catch {
    return emptyPayload;
  } finally {
    clearTimeout(timeoutId);
  }
}
