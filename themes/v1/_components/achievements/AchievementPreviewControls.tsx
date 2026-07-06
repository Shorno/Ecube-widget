"use client";

type Props = {
  onTriggerRampage: () => void;
  onTriggerDomination: () => void;
  onTriggerFirstBlood: () => void;
  onTriggerDropLooted: () => void;
  onTriggerVehicleElim: () => void;
  onTriggerGrenadier: () => void;
  isLocked?: boolean;
};

export default function AchievementPreviewControls({
  onTriggerRampage,
  onTriggerDomination,
  onTriggerFirstBlood,
  onTriggerDropLooted,
  onTriggerVehicleElim,
  onTriggerGrenadier,
  isLocked = false,
}: Props) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      <button
        type="button"
        onClick={onTriggerRampage}
        disabled={isLocked}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger Rampage
      </button>
      <button
        type="button"
        onClick={onTriggerDomination}
        disabled={isLocked}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger Domination
      </button>
      <button
        type="button"
        onClick={onTriggerFirstBlood}
        disabled={isLocked}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger First Blood
      </button>
      <button
        type="button"
        onClick={onTriggerDropLooted}
        disabled={isLocked}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger Air Drop
      </button>
      <button
        type="button"
        onClick={onTriggerVehicleElim}
        disabled={isLocked}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger Vehicle Elim
      </button>
      <button
        type="button"
        onClick={onTriggerGrenadier}
        disabled={isLocked}
        className="rounded bg-white px-4 py-2 text-sm font-bold text-black shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trigger Grenadier
      </button>
    </div>
  );
}
