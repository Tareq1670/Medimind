import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MediMind — AI-Powered Healthcare Platform",
    template: "%s | MediMind",
  },
  description:
    "AI-powered healthcare platform connecting patients with medicines, doctors, and intelligent symptom analysis. Browse 500+ medicines, 50+ doctors, and get AI-driven health insights.",
  keywords: [
    "healthcare",
    "medicine",
    "doctors",
    "AI health assistant",
    "symptom checker",
    "medical reports",
    "health records",
    "online pharmacy",
  ],
  authors: [{ name: "MediMind" }],
  creator: "MediMind",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://medimind.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MediMind",
    title: "MediMind — AI-Powered Healthcare Platform",
    description:
      "AI-powered healthcare platform connecting patients with medicines, doctors, and intelligent symptom analysis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MediMind - AI-Powered Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediMind — AI-Powered Healthcare Platform",
    description:
      "AI-powered healthcare platform connecting patients with medicines, doctors, and intelligent symptom analysis.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#14B8A6" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
