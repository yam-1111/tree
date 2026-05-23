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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tree.achinay.dev";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Tree/ — Generate File Trees from Text",
  description: "An interactive parser for mapping folder architectures. Build, edit, and visualize directory structures using Pythonic indentation",
  openGraph: {
    title: "Tree/ — Generate File Trees from Text",
    description: "An interactive parser for mapping folder architectures. Build, edit, and visualize directory structures using Pythonic indentation",
    url: appUrl,
    siteName: "Tree/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tree/ — File Tree Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tree/ — Generate File Trees from Text",
    description: "An interactive parser for mapping folder architectures. Build, edit, and visualize directory structures using Pythonic indentation",
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
