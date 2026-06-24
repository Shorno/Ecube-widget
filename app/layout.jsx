import {
  Anton,
  Oswald,
  Geist,
  Rajdhani,
  Barlow_Condensed,
  Bebas_Neue,
  Exo_2,
  Russo_One,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "@/components/common/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// UI font (admin/settings/controller)
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Widget fonts — all loaded globally so per-user CSS vars resolve at runtime
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
});
const barlowCond = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  weight: ["400", "500", "600", "700"],
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: ["400"],
});
const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  weight: ["400", "500", "600", "700"],
});
const russoOne = Russo_One({
  subsets: ["latin"],
  variable: "--font-russo-one",
  weight: ["400"],
});
const americanCaptain = localFont({
  src: [
    {
      path: "./fonts/american-captain.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/american-captain.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/american-captain.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/american-captain.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-american-captain",
});
const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: ["400"],
});

export const metadata = {
  title: "PUBG WIDGET",
  description: "PUBG WIDGET",
};

export default function RootLayout({ children }) {
  const fontVars = [
    geist.variable,
    oswald.variable,
    rajdhani.variable,
    barlowCond.variable,
    bebasNeue.variable,
    exo2.variable,
    russoOne.variable,
    americanCaptain.variable,
    anton.variable,
  ].join(" ");

  return (
    <html lang="en" className={cn("font-sans", fontVars)}>
      <body
        className={cn(oswald.variable, "bg-transparent antialiased")}
        suppressHydrationWarning
      >
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
