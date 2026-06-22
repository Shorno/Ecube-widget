import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

/** Figma Rectangle 2 — path from public/assets/cusotm-shapes/mvp-name.svg */
const LOGO_CLIP =
  "path('M0 0L229 43.318L131 214L0 153.346V0Z')";

export default function MVPNameLogoShape({ className, style }: Props) {
  return (
    <div
      className={cn("block", className)}
      style={{
        ...style,
        background: `linear-gradient(var(--widget-gradient-angle), var(--widget-gradient-from) 0%, var(--widget-gradient-to) 100%)`,
        clipPath: LOGO_CLIP,
      }}
      aria-hidden
    />
  );
}
