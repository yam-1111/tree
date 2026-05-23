import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tree.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Tree/ // Indentation-Based Custom Syntax Visualizer",
  description: "An interactive visualizer for custom Pythonic indentation-based file tree definitions, built with a heavy redwood brutalist design system.",
  openGraph: {
    title: "Tree/ // Indentation-Based Custom Syntax Visualizer",
    description: "An interactive visualizer for custom Pythonic indentation-based file tree definitions, built with a heavy redwood brutalist design system.",
    url: appUrl,
    siteName: "Tree/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tree/ // Indentation-Based Custom Syntax Visualizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tree/ // Indentation-Based Custom Syntax Visualizer",
    description: "An interactive visualizer for custom Pythonic indentation-based file tree definitions, built with a heavy redwood brutalist design system.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
