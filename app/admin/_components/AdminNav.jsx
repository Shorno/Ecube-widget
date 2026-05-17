"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-[0.2em] text-gray-600 uppercase">Effinity</span>
          <span className="text-gray-800">/</span>
          <span className="text-sm font-bold tracking-widest text-white uppercase">Admin</span>
        </div>

        <nav className="flex flex-1 items-center gap-1">
          <NavLink href="/admin" active={pathname.startsWith("/admin")}>Dashboard</NavLink>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-sm text-gray-500 hover:bg-red-950/40 hover:text-red-400"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={[
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-gray-800 text-white"
          : "text-gray-500 hover:bg-gray-800/50 hover:text-gray-300",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
