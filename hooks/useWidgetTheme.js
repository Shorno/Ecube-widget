"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Fetches the effective theme for this widget's user+tournament from the public API.
// CSS vars are already injected by the server layout; this hook gives client-side
// access to metadata (tournamentName, fontKey, etc.) and the resolved color values.
export function useWidgetTheme() {
  const { userId, tournamentID } = useParams();
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !tournamentID) return;
    fetch(`/api/theme/${userId}/${tournamentID}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setTheme(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId, tournamentID]);

  return { theme, loading };
}
