import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SITE_URL } from "@/lib/api/config";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DevMemory — Fast Developer Reference & Cheat Sheets",
    template: "%s — DevMemory",
  },
  description:
    "A developer reference and cheat sheet platform built to help you understand concepts, master syntax rules, and actually remember what you learned.",
  keywords: [
    "developer reference",
    "programming cheat sheets",
    "coding documentation",
    "web development",
    "JavaScript",
    "React",
    "frontend",
    "backend",
  ],
  authors: [{ name: "DevMemory Team" }],
  creator: "DevMemory",
  publisher: "DevMemory",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "DevMemory",
    title: "DevMemory — Fast Developer Reference & Cheat Sheets",
    description:
      "Understand programming concepts, copy syntax snippets, and master modern development.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "DevMemory Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMemory — Fast Developer Reference & Cheat Sheets",
    description:
      "Understand programming concepts, copy syntax snippets, and master modern development.",
    images: ["/logo.png"],
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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "5La9xwDe0PGz5q_LevOdeeKZgfWddD3cGNzWXDlfiYI",
  },
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
