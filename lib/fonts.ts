import { Archivo } from "next/font/google";

/**
 * Single family across the whole site: Archivo at 400 / 600 / 800.
 * Variable font, `display: swap`, preloaded — one font request total.
 * Code spans use the system mono stack, so there is no second download.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["400", "600", "800"],
});
