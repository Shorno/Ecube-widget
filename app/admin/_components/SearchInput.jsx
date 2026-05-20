"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

export default function SearchInput({ defaultValue = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleChange(e) {
    const q = e.target.value;
    setValue(q);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (q.trim()) {
        params.set("q", q.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // reset to page 1 on new search
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 300);
  }

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Search by name or email…"
        className={[
          "h-9 w-64 border-gray-700 bg-gray-800 pl-9 text-sm text-white placeholder:text-gray-600",
          isPending && "opacity-60",
        ].join(" ")}
      />
    </div>
  );
}
