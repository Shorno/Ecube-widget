import { teamColor } from "./MiniMap";
import { formatClock } from "./PlaybackControls";

const LIVE_STATE_LABELS = {
  1: "In plane",
  2: "Parachute",
  4: "Knocked",
  5: "Dead",
};

const CIRCLE_STATUS_LABELS = {
  0: "Holding",
  1: "Final circle",
  2: "Shrinking",
  3: "Pre-game",
};

function liveStateLabel(state) {
  return LIVE_STATE_LABELS[state] ?? "Alive";
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
      {children}
    </h2>
  );
}

export default function MatchSidebar({ circleInfo, teams, players, kills }) {
  const rankedTeams = [...teams].sort(
    (a, b) => b.liveMemberNum - a.liveMemberNum || b.killNum - a.killNum,
  );

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/10 bg-neutral-900/60 p-4">
      <section className="space-y-2">
        <SectionTitle>Zone</SectionTitle>
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
          <span className="text-neutral-300">
            Phase {circleInfo?.CircleIndex ?? "—"}
            {circleInfo && (
              <span className="ml-2 text-xs text-neutral-500">
                {CIRCLE_STATUS_LABELS[circleInfo.CircleStatus] ?? ""}
              </span>
            )}
          </span>
          <span className="font-mono tabular-nums text-neutral-400">
            {circleInfo ? `${circleInfo.Counter}/${circleInfo.MaxTime}s` : "—"}
          </span>
        </div>
      </section>

      <section className="space-y-2">
        <SectionTitle>Teams</SectionTitle>
        <div className="space-y-1">
          {rankedTeams.map((team) => (
            <div
              key={team.teamId}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: teamColor(team.teamId) }}
                />
                {team.teamName}
              </span>
              <span className="font-mono text-xs tabular-nums text-neutral-400">
                {team.liveMemberNum} alive · {team.killNum} kills
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <SectionTitle>Players</SectionTitle>
        <div className="space-y-1">
          {players.map((player) => {
            const dead = player.liveState === 5;
            return (
              <div
                key={player.uId}
                className={`rounded-lg bg-white/5 px-3 py-2 ${dead ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: teamColor(player.teamId) }}
                    />
                    {player.playerName}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {liveStateLabel(player.liveState)} · {player.killNum} kills
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-[width]"
                    style={{
                      width: `${(player.health / player.healthMax) * 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <SectionTitle>Kill Feed</SectionTitle>
        {kills.length === 0 ? (
          <p className="text-sm text-neutral-500">No eliminations yet</p>
        ) : (
          <div className="space-y-1">
            {kills.map((kill) => (
              <div
                key={kill.t}
                className="rounded-lg bg-red-500/10 px-3 py-2 text-sm"
              >
                <span className="font-semibold">{kill.body.CauserName}</span>
                <span className="mx-1.5 text-red-400">⟶</span>
                <span>{kill.body.VictimName}</span>
                <span className="ml-2 font-mono text-xs text-neutral-400">
                  {formatClock(kill.t)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}
