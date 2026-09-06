import CuelumeProvider from "@/components/providers/cuelume-provider";
import { AppToaster } from "@/components/providers/toaster";
import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "MediPass — Your medical history, wherever you go.",
  description:
    "One secure place for your medical history, medications, allergies and reports. Share it with any doctor in seconds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`
        ${dmSans.variable}
        ${geistMono.variable}
        ${instrumentSerif.variable}
        h-full antialiased
      `}
    >
      <body className="flex min-h-full flex-col bg-[#080D0A] font-[family-name:var(--font-body)]">
        <CuelumeProvider />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
