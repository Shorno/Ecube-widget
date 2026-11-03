import TeamRecallView from "@/themes/v1/TeamRecallView";
import {
  buildThemeStyle,
  VARIANT_FONT_DEFAULTS,
  WIDGET_FONTS,
} from "@/themes/catalog";

const VARIANT = "default";

// The widget colors are transparent until a theme sets them — the tournament
// layout does that from the user's saved theme; here it is the stock theme.
function defaultThemeStyle() {
  const fonts = VARIANT_FONT_DEFAULTS[VARIANT];
  const primary =
    WIDGET_FONTS.find((f) => f.key === fonts.primary) ?? WIDGET_FONTS[0];
  const secondary =
    WIDGET_FONTS.find((f) => f.key === fonts.secondary) ?? WIDGET_FONTS[1];
  return {
    ...buildThemeStyle({}, VARIANT),
    fontFamily: primary.css,
    "--widget-font-primary": primary.css,
    "--widget-font-secondary": secondary.css,
  };
}

// Recall widget test bench: the default theme's recall card in preview mode,
// with the match replay panel driving it. No user or tournament lookup, so it
// runs without the database — use the live route for a user's own theme.
export default function ReplayRecallPage() {
  return (
    <div style={defaultThemeStyle()}>
      <TeamRecallView tournamentID="replay" preview />
    </div>
  );
}
