import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { getUser } from "@/lib/db/queries";
import EcubeBrand from "@/components/common/EcubeBrand";

export default async function ControllerPage() {
  const session = await requireSession();
  const user = await getUser(session.userId);
  if (!user) redirect("/api/auth/logout");

  const tids = user.allowedTournamentIds ?? [];
  const names = user.tournamentNames ?? {};

  // Single tournament — go straight to the controller
  if (tids.length === 1) redirect(`/controller/${tids[0]}`);

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 font-sans text-white">
      {/* Header — same 2-row structure as other operator pages */}
      <header className="bg-gray-950">
        {/* Row 1 — logo + title | brand pill */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-3">
          <div className="flex items-center gap-3">
            <Image src="/EcubeOG.svg" width={26} height={26} alt="ECube" />
            <span className="h-4 w-px bg-gray-700" />
            <span className="text-sm font-semibold text-white">Controller</span>
          </div>
          <EcubeBrand />
        </div>

        {/* Row 2 — username right */}
        <div className="flex items-center justify-end border-b border-gray-800 px-6 py-2.5">
          {user.name && (
            <span className="text-sm text-gray-400">{user.name}</span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Select Tournament</h1>
          {tids.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              No tournaments assigned. Contact your admin.
            </p>
          )}
        </div>

        {tids.length > 0 && (
          <div className="w-full max-w-sm space-y-2">
            {tids.map((tid) => (
              <Link
                key={tid}
                href={`/controller/${tid}`}
                className="flex flex-col rounded border border-gray-700 bg-gray-900 px-5 py-4 transition-colors hover:border-blue-600 hover:bg-gray-800"
              >
                {names[tid] && (
                  <span className="text-base font-semibold text-white">
                    {names[tid]}
                  </span>
                )}
                <span className="font-mono text-xs text-gray-500">{tid}</span>
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/settings"
          className="inline-flex items-center gap-2 rounded border border-blue-600 bg-blue-700/30 px-4 py-2 text-sm font-bold tracking-wider text-blue-300 uppercase transition-colors hover:bg-blue-700/60 hover:text-white"
        >
          ⚙ Settings
        </Link>
      </div>
    </div>
  );
}
