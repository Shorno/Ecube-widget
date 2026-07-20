import { teamColor } from "./MiniMap";
import { formatClock } from "./PlaybackControls";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const CIRCLE_STATUS_LABELS = {
  0: "Holding",
  1: "Final circle",
  2: "Shrinking",
  3: "Pre-game",
};

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
      {children}
    </h2>
  );
}

export default function MatchSidebar({
  circleInfo,
  teams,
  teamStandings,
  visibleTeamIds,
  kills,
  onTeamVisibilityChange,
  onShowTopFour,
  onShowAll,
  onHideAll,
}) {
  const visible = new Set(visibleTeamIds.map(String));
  const currentTeams = new Map(
    teams.map((team) => [String(team.teamId), team]),
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
          <span className="font-mono text-neutral-400 tabular-nums">
            {circleInfo ? `${circleInfo.Counter}/${circleInfo.MaxTime}s` : "—"}
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <SectionTitle>Map teams</SectionTitle>
            <p className="mt-1 text-[11px] text-neutral-600">
              {visible.size} of {teamStandings.length} visible
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={onShowTopFour}
              className="h-6 border-amber-400/30 bg-amber-400/10 px-2 text-[10px] font-bold text-amber-300 hover:bg-amber-400/20 hover:text-amber-200"
            >
              Top 4
            </Button>
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={onShowAll}
              className="h-6 border-white/10 bg-white/5 px-2 text-[10px] text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              All
            </Button>
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={onHideAll}
              className="h-6 border-white/10 bg-white/5 px-2 text-[10px] text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              None
            </Button>
          </div>
        </div>

        {teamStandings.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-xs text-neutral-600">
            Team data has not been recorded
          </p>
        ) : (
          <div className="space-y-1">
            {teamStandings.map((team) => {
              const teamId = String(team.teamId);
              const isVisible = visible.has(teamId);
              const current = currentTeams.get(teamId);

              return (
                <label
                  key={teamId}
                  className={`group flex cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-2 transition ${
                    isVisible
                      ? "border-amber-400/20 bg-amber-400/[0.07]"
                      : "border-transparent bg-white/[0.025] opacity-55 hover:opacity-80"
                  }`}
                >
                  <span className="w-6 shrink-0 font-mono text-xs font-bold text-neutral-500 tabular-nums">
                    {team.rank ? `#${team.rank}` : "—"}
                  </span>
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-black/30"
                    style={{ backgroundColor: teamColor(team.teamId) }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-neutral-200">
                      {team.teamName}
                    </span>
                    <span className="block font-mono text-[10px] text-neutral-500 tabular-nums">
                      {current
                        ? `${current.liveMemberNum} alive · ${current.killNum} kills`
                        : "Awaiting match state"}
                    </span>
                  </span>
                  <Switch
                    size="sm"
                    checked={isVisible}
                    onCheckedChange={(checked) =>
                      onTeamVisibilityChange(team.teamId, checked)
                    }
                    aria-label={`Show ${team.teamName} on map`}
                    className="data-checked:bg-amber-400 data-unchecked:bg-neutral-700"
                  />
                </label>
              );
            })}
          </div>
        )}
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
