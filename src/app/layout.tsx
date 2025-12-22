import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google"; // Using Outfit as per decision
import "./globals.css";
import { SWRegister } from "./sw-register";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "LexiLink: Syllabic Speed-Word",
  description: "A fast-paced word construction game. Solve 10 puzzles in 60 seconds.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // For game feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased bg-[hsl(var(--background))] text-[hsl(var(--foreground))] overscroll-none`}>
        <SWRegister />
        <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[hsl(var(--primary))] opacity-10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[hsl(var(--secondary))] opacity-10 blur-[100px] pointer-events-none" />

          {children}
        </main>
      </body>
    </html>
  );
}
