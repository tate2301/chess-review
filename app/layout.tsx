import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChessProvider } from "../hooks/useChessStore";
import AnimatedBackground from "../components/AnimatedBackground";
import AnimatedFooter from "../components/AnimatedFooter";

const inter = Instrument_Sans({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Didiblunder - Humane Chess Analysis",
  description:
    "Fluid chess game analysis inspired by Mercury OS design principles and flow state computing",
  keywords: [
    "chess",
    "analysis",
    "blunder",
    "stockfish",
    "mercury os",
    "flow state",
  ],
  authors: [{ name: "Didiblunder Team" }],
  openGraph: {
    title: "Didiblunder - Humane Chess Analysis",
    description:
      "Fluid chess game analysis inspired by Mercury OS design principles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Didiblunder - Humane Chess Analysis",
    description:
      "Fluid chess game analysis inspired by Mercury OS design principles",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${jetbrainsMono.className}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[hsl(var(--mercury-bg))] text-[hsl(var(--mercury-fg))] overflow-x-hidden">
        {/* Mercury OS inspired ambient background */}
        <AnimatedBackground />

        <ChessProvider>
          <div className="relative z-10">{children}</div>
        </ChessProvider>

        {/* Mercury OS style loading indicator */}
        <div id="mercury-portal" />
      </body>
    </html>
  );
}
