import Hero from "./components/Hero";
import Problem from "./components/Problem";
import WhatIsDevMemory from "./components/WhatIsDevMemory";
import LatestReferences from "./components/LatestReferences";
import CTA from "./components/CTA";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <Hero />
      <Problem />
      <WhatIsDevMemory />
      <LatestReferences />
      <CTA />
    </main>
  );
}
