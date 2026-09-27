import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    default: "DevMemory — Developer Memory & Coding References to Learn and Remember",
    template: "%s — DevMemory",
  },
  description:
    "DevMemory is your developer memory platform. Understand concepts, explore coding references, and remember what you learned with fast syntax cheat sheets.",
  keywords: [
    "devmemory",
    "developer memory",
    "coding references",
    "programming cheat sheets",
    "understand concepts",
    "remember coding",
    "web development",
    "JavaScript",
    "React",
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
    title: "DevMemory — Developer Memory & Coding References to Learn and Remember",
    description:
      "DevMemory is your developer memory platform. Understand concepts, explore coding references, and remember what you learned.",
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
    title: "DevMemory — Developer Memory & Coding References to Learn and Remember",
    description:
      "DevMemory is your developer memory platform. Understand concepts, explore coding references, and remember what you learned.",
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K027G0YD6R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K027G0YD6R');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
