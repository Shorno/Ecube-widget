"use client";

type Props = {
  onTriggerObserver: () => void;
  onTriggerElimination: () => void;
  onTriggerTopFour: () => void;
  eliminationLocked?: boolean;
  topFourActive?: boolean;
};

export default function LiveRankingPreviewControls({
  onTriggerObserver,
  onTriggerElimination,
  onTriggerTopFour,
  eliminationLocked = false,
  topFourActive = false,
}: Props) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      <button
        type="button"
        onClick={onTriggerObserver}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100"
      >
        Trigger Observer
      </button>
      <button
        type="button"
        onClick={onTriggerTopFour}
        disabled={topFourActive}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger Top Four
      </button>
      <button
        type="button"
        onClick={onTriggerElimination}
        disabled={eliminationLocked}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger Elimination
      </button>
    </div>
  );
}
