import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Primary palette fill */
  fill?: string;
  /** Accent border — secondary palette */
  stroke?: string;
};

/** Figma Rectangle 307 — top corner plaque */
export default function CornerTopShape({
  className,
  style,
  fill = "var(--widget-primary)",
  stroke = "var(--widget-secondary-accent)",
}: Props) {
  return (
    <svg
      viewBox="0 0 229 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
      style={
        {
          ...style,
          "--corner-top-fill": fill,
          "--corner-top-stroke": stroke,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <path
        d="M226.385 42.0473L75.2219 26.3579L74.4314 26.2754L74.5589 25.4911L78.4401 1.67813L53.4228 19.8445L26.9319 39.0826L0.900721 57.9872L31.4738 140.676L226.385 42.0473Z"
        fill="var(--corner-top-fill)"
        stroke="var(--corner-top-stroke)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
