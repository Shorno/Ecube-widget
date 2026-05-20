// Right-side "Powered by ECUBE" pill — used in the top-right of every operator header.
// The E logo icon lives on the LEFT of the header independently.
export default function EcubeBrand() {
  return (
    <div className="flex shrink-0 flex-col items-end rounded border border-white/10 bg-black px-3 py-1.5 leading-none">
      <span className="text-[9px] font-semibold tracking-[0.15em] text-white uppercase">
        Powered by
      </span>
      <span
        className="text-[13px] font-bold tracking-wide"
        style={{ color: "#2e87e6" }}
      >
        ECUBE
      </span>
    </div>
  );
}
