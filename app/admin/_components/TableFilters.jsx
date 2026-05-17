"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TableFilters({ status = "", sub = "" }) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function update(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "_all") params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status || undefined}
        onValueChange={(v) => update("status", v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="disabled">Disabled</SelectItem>
          <SelectSeparator />
          <SelectItem value="_all">All Status</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sub || undefined}
        onValueChange={(v) => update("sub", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Subscriptions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="expiring">Expiring Soon</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
          <SelectItem value="none">No Subscription</SelectItem>
          <SelectSeparator />
          <SelectItem value="_all">All Subscriptions</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
