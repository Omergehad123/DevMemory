import Hero from "./components/Hero";
import Problem from "./components/Problem";
import WhatIsDevMemory from "./components/WhatIsDevMemory";
import LatestReferences from "./components/LatestReferences";
import CTA from "./components/CTA";
import { SITE_URL } from "@/lib/api/config";

export const metadata = {
  title: "DevMemory — Fast Developer Reference & Cheat Sheets",
  description:
    "A developer reference built to help you understand concepts, practice them, and actually remember what you learned. Explore syntax rules, hooks, and tech stacks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DevMemory — Fast Developer Reference & Cheat Sheets",
    description:
      "A developer reference built to help you understand concepts, practice them, and actually remember what you learned.",
    url: SITE_URL,
    type: "website",
  },
};

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DevMemory",
    url: SITE_URL,
    description:
      "A developer reference built to help you understand concepts, practice them, and actually remember what you learned.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      {/* Schema.org WebSite Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Hero />
      <Problem />
      <WhatIsDevMemory />
      <LatestReferences />
      <CTA />
    </main>
  );
}

