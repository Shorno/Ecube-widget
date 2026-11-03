// Recall replay for the recall widget's preview: the recall packets of a real
// PCOB recording, turned into the TEAM_RECALL payloads the backend would have
// broadcast at each moment. Pure — no Node APIs — so the extract script and a
// JSONL uploaded in the browser share it.

const RECALL_ROUTES = new Set(["setreviveplayer", "setplayerdeadafterrevive"]);

const DEFAULT_PLAYER_IMAGE = "/default-player.png";

/**
 * Keep only what a recall replay needs from a full recording: the recall
 * packets, the roster from /totalmessage (to resolve UIDs to names and teams),
 * and the recording length so the scrubber spans the whole match.
 */
export function extractRecallReplay(raw) {
  let startTs = null;
  let endTs = null;
  const roster = {};
  const events = [];

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue; // tolerate a truncated trailing line from the recorder
    }
    if (!entry.route || !entry.changed) continue;

    const ts = Date.parse(entry.ts);
    startTs ??= ts;
    endTs = ts;

    if (entry.route === "totalmessage") {
      for (const player of entry.body?.TotalPlayerList ?? []) {
        roster[String(player.uId)] ??= {
          name: player.playerName,
          teamId: player.teamId,
          teamName: player.teamName,
        };
      }
    } else if (RECALL_ROUTES.has(entry.route)) {
      events.push({ t: ts - startTs, route: entry.route, body: entry.body });
    }
  }

  return { duration: endTs - startTs || 0, roster, events };
}

/**
 * Walk the recall packets the way PcobRecallProcessor does: packets sharing
 * ReviverUID + Time are one recall, every packet re-emits the whole group
 * under the same id, and dead-after-revive only marks the player (the backend
 * does not broadcast it). Returns each emission with its replay time, plus one
 * entry per recall / death for the timestamp list.
 */
export function buildRecallTimeline({ roster, events }) {
  const recalls = new Map();
  const deadAfterRecall = new Set();
  const emissions = [];
  const moments = [];

  const toPlayer = (gameId) => {
    const player = roster[gameId];
    if (!player) return null;
    return {
      id: gameId,
      gameId,
      name: player.name,
      ign: player.name,
      image: DEFAULT_PLAYER_IMAGE,
    };
  };

  const format = (recall) => {
    const reviver = roster[recall.reviverGameId];
    const team = roster[recall.recalledGameIds[0]];
    return {
      id: recall.id,
      gameTime: recall.gameTime,
      recalledAt: "", // stamped when the replay plays it
      team: team
        ? {
            id: String(team.teamId),
            name: team.teamName,
            clanTag: team.teamName,
            index: team.teamId,
          }
        : null,
      reviver: reviver ? toPlayer(recall.reviverGameId) : null,
      players: recall.recalledGameIds.map((gameId) => ({
        ...toPlayer(gameId),
        isDeadAfterRecall: deadAfterRecall.has(gameId),
      })),
    };
  };

  for (const { t, route, body } of events) {
    if (route === "setplayerdeadafterrevive") {
      const gameId = String(body.UID ?? "");
      deadAfterRecall.add(gameId);
      moments.push({
        key: `dead-${gameId}-${t}`,
        t,
        kind: "dead",
        label: `${roster[gameId]?.name ?? gameId} died after recall`,
        gameTime: Number(body.Time) || 0,
      });
      continue;
    }

    const recalledGameId = String(body.BeRevivedUID ?? "");
    if (!roster[recalledGameId]) continue;

    const id = `${body.ReviverUID}:${body.Time}`;
    let recall = recalls.get(id);
    if (recall?.recalledGameIds.includes(recalledGameId)) continue;
    if (!recall) {
      recall = {
        id,
        reviverGameId: String(body.ReviverUID ?? ""),
        gameTime: Number(body.Time) || 0,
        recalledGameIds: [],
      };
      recalls.set(id, recall);
      moments.push({
        key: id,
        t,
        kind: "recall",
        label: "",
        gameTime: recall.gameTime,
        recall,
      });
    }
    recall.recalledGameIds.push(recalledGameId);
    deadAfterRecall.delete(recalledGameId);
    emissions.push({ t, payload: format(recall) });
  }

  // Recall labels are written last, once every teammate in the group is known.
  return {
    emissions,
    moments: moments.map(({ recall, ...moment }) =>
      recall
        ? {
            ...moment,
            label: `${roster[recall.recalledGameIds[0]]?.teamName ?? "?"} · ${recall.recalledGameIds.length}P`,
          }
        : moment,
    ),
  };
}
