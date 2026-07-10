export default function Centered({ children }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400">
      {children}
    </div>
  );
}
