import Image from "next/image";
import MVPNameBarShape from "./shapes/MVPNameBarShape";
import MVPNameLogoShape from "./shapes/MVPNameLogoShape";

type Props = {
  playerIgn?: string;
  teamLogoUrl?: string;
  teamName?: string;
};

/**
 * Figma Group — player nameplate (Rectangles 24 + 2).
 * Logo path: public/assets/cusotm-shapes/mvp-name.svg
 * Positions relative to canvas origin (1920×1080 MVP layout).
 */
export default function MVPPlayerNameplate({
  playerIgn,
  teamLogoUrl,
  teamName,
}: Props) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: "1049px", top: "726px", width: "800px", height: "214px" }}
    >
      {/* Rectangle 24 */}
      <MVPNameBarShape
        className="absolute"
        style={{ left: "0px", top: "45px", width: "800px", height: "123px" }}
      />

      {/* Rectangle 2 */}
      <MVPNameLogoShape
        className="absolute z-10"
        style={{ left: "16px", top: "0px", width: "229px", height: "214px" }}
      />

      {/* LOGO — Figma 1091, 778 */}
      <div
        className="absolute z-20 flex items-center justify-center"
        style={{
          left: "42px",
          top: "52px",
          width: "126px",
          height: "84px",
        }}
      >
        {teamLogoUrl ? (
          <Image
            src={teamLogoUrl}
            alt="Team Logo"
            width={126}
            height={84}
            className="object-contain"
          />
        ) : (
          <span className="font-secondary text-widget-text-3 text-center text-[70px] leading-[84px] font-bold">
            {teamName || "LOGO"}
          </span>
        )}
      </div>

      {/* PLAYER — Figma 1430, 791; wider box for long IGNs */}
      <div
        className="font-secondary text-widget-text-1 absolute z-20 truncate text-center text-[70px] leading-[84px] font-bold"
        style={{
          left: "245px",
          top: "65px",
          width: "555px",
          height: "84px",
        }}
      >
        {playerIgn || "PLAYER"}
      </div>
    </div>
  );
}
