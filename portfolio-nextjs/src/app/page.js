"use client";

import { useState, useEffect } from "react";
import DandelionAnimation from "@/components/DandelionAnimation";
import TypewriterHero from "@/components/TypewriterHero";

export default function Home() {
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [hasAnimationStarted, setHasAnimationStarted] = useState(false);

  useEffect(() => {
    if (isAnimationActive) {
      setHasAnimationStarted(true);
    }
  }, [isAnimationActive]);

  return (
    <main className="relative flex-grow flex items-center justify-center overflow-hidden bg-white">
      {/* Container for the animated components over the canvas */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 w-full">
        <div className={isAnimationActive ? 'pointer-events-none' : 'pointer-events-auto'}>
          <TypewriterHero isAnimationActive={isAnimationActive} />
        </div>
      </div>

      <DandelionAnimation onAnimationStart={(active) => setIsAnimationActive(active)} />
    </main>
  );
}
