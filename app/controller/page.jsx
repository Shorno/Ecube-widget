import { redirect } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { getUser } from "@/lib/db/queries";

export default async function ControllerPage() {
  const session = await requireSession();
  const user    = await getUser(session.userId);
  if (!user) redirect("/api/auth/logout");

  const tids  = user.allowedTournamentIds ?? [];
  const names = user.tournamentNames      ?? {};

  // Single tournament — go straight to the controller
  if (tids.length === 1) redirect(`/controller/${tids[0]}`);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-950 px-6 font-sans">
      <div className="text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-gray-600 uppercase">Effinity · Controller</p>
        <h1 className="mt-3 text-2xl font-bold text-white">Select Tournament</h1>
        {tids.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">No tournaments assigned. Contact your admin.</p>
        )}
      </div>

      {tids.length > 0 && (
        <div className="w-full max-w-sm space-y-2">
          {tids.map((tid) => (
            <Link key={tid} href={`/controller/${tid}`}
              className="flex flex-col rounded border border-gray-700 bg-gray-900 px-5 py-4 transition-colors hover:border-violet-600 hover:bg-gray-800">
              {names[tid] && (
                <span className="text-base font-semibold text-white">{names[tid]}</span>
              )}
              <span className="font-mono text-xs text-gray-500">{tid}</span>
            </Link>
          ))}
        </div>
      )}

      <Link href="/settings"
        className="inline-flex items-center gap-2 rounded border border-violet-600 bg-violet-700/30 px-4 py-2 text-sm font-bold tracking-wider text-violet-300 uppercase transition-colors hover:bg-violet-700/60 hover:text-white">
        ⚙ Settings
      </Link>
    </div>
  );
}
