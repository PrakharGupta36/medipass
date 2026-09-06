import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});
