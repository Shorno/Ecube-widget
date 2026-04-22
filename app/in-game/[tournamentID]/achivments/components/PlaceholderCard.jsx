export default function PlaceholderCard({ eventName }) {
  return (
    <div className="flex w-full items-center justify-center rounded bg-black p-4 text-white">
      <span className="font-mono text-sm tracking-wider uppercase">
        {eventName.replace("_", " ")}
      </span>
    </div>
  );
}
