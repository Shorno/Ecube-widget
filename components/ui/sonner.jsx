"use client";

import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

function Toaster({ ...props }) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          background: "#111827",
          border: "1px solid #1f2937",
          color: "#f9fafb",
          padding: "10px 14px",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
