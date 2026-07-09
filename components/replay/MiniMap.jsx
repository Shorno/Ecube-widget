const VIEW = 1000;

const TEAM_COLORS = [
  "#f59e0b",
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#fb7185",
  "#facc15",
  "#22d3ee",
  "#c084fc",
];

export function teamColor(teamId) {
  return TEAM_COLORS[teamId % TEAM_COLORS.length];
}

const DEAD_STATE = 5;
const IN_PLANE_STATE = 1;

export default function MiniMap({
  world,
  players,
  trails,
  zone,
  plane,
  killMarkers,
  observedUid,
}) {
  const toX = (x) => (x / world.size) * VIEW;
  const toY = (y) => (y / world.size) * VIEW;
  const toR = (radius) => (radius / world.size) * VIEW;

  const inPlane = players.filter((p) => p.liveState === IN_PLANE_STATE);
  const planePos =
    inPlane.length > 0
      ? {
          x: inPlane.reduce((sum, p) => sum + p.location.x, 0) / inPlane.length,
          y: inPlane.reduce((sum, p) => sum + p.location.y, 0) / inPlane.length,
        }
      : null;

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className="h-full w-full rounded-lg border border-white/10"
    >
      <defs>
        {/* White outside the blue circle = area shaded as out-of-zone */}
        <mask id="outside-blue-zone">
          <rect width={VIEW} height={VIEW} fill="white" />
          {zone.blue && (
            <circle
              cx={toX(zone.blue.x)}
              cy={toY(zone.blue.y)}
              r={toR(zone.blue.radius)}
              fill="black"
            />
          )}
        </mask>
      </defs>

      <image
        href={world.imageSrc}
        width={VIEW}
        height={VIEW}
        preserveAspectRatio="none"
      />

      {plane && (
        <line
          x1={toX(plane.start.x)}
          y1={toY(plane.start.y)}
          x2={toX(plane.stop.x)}
          y2={toY(plane.stop.y)}
          stroke="#facc15"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeDasharray="12 10"
        />
      )}

      {zone.blue && (
        <>
          <rect
            width={VIEW}
            height={VIEW}
            fill="#2563eb"
            fillOpacity="0.25"
            mask="url(#outside-blue-zone)"
          />
          <circle
            cx={toX(zone.blue.x)}
            cy={toY(zone.blue.y)}
            r={toR(zone.blue.radius)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
          />
        </>
      )}
      {zone.white && (
        <circle
          cx={toX(zone.white.x)}
          cy={toY(zone.white.y)}
          r={toR(zone.white.radius)}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
        />
      )}

      {trails.map((trail) => (
        <polyline
          key={trail.uId}
          points={trail.points.map(([x, y]) => `${toX(x)},${toY(y)}`).join(" ")}
          fill="none"
          stroke={teamColor(trail.teamId)}
          strokeOpacity="0.5"
          strokeWidth="2"
        />
      ))}

      {killMarkers.map((kill) => (
        <g
          key={kill.t}
          transform={`translate(${toX(kill.x)}, ${toY(kill.y)})`}
          stroke="#ef4444"
          strokeWidth="3"
        >
          <line x1="-7" y1="-7" x2="7" y2="7" />
          <line x1="-7" y1="7" x2="7" y2="-7" />
        </g>
      ))}

      {planePos && (
        <g transform={`translate(${toX(planePos.x)}, ${toY(planePos.y)})`}>
          <polygon points="0,-14 10,10 0,4 -10,10" fill="#facc15" />
        </g>
      )}

      {players.map((player) => {
        const x = toX(player.location.x);
        const y = toY(player.location.y);
        const dead = player.liveState === DEAD_STATE;
        const observed = String(player.uId) === observedUid;
        return (
          <g key={player.uId} transform={`translate(${x}, ${y})`}>
            {dead ? (
              <g stroke="#9ca3af" strokeWidth="3">
                <line x1="-6" y1="-6" x2="6" y2="6" />
                <line x1="-6" y1="6" x2="6" y2="-6" />
              </g>
            ) : (
              <circle
                r="7"
                fill={teamColor(player.teamId)}
                stroke={observed ? "#ffffff" : "#0c1220"}
                strokeWidth={observed ? 3 : 1.5}
              />
            )}
            <text
              y="-13"
              textAnchor="middle"
              fontSize="17"
              fill="#ffffff"
              fillOpacity={dead ? 0.6 : 1}
              stroke="#000000"
              strokeWidth="3"
              paintOrder="stroke"
            >
              {player.playerName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
