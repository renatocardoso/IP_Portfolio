"use client";

import { useState, useEffect } from "react";
import DandelionAnimation from "@/components/DandelionAnimation";
import TypewriterHero from "@/components/TypewriterHero";
import HomeMenu from "@/components/HomeMenu";

export default function Home() {
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [hasAnimationStarted, setHasAnimationStarted] = useState(false);
  const [hasAnimationFinished, setHasAnimationFinished] = useState(false);

  useEffect(() => {
    if (isAnimationActive) {
      setHasAnimationStarted(true);
    } else if (hasAnimationStarted && !isAnimationActive) {
      setHasAnimationFinished(true);
    }
  }, [isAnimationActive, hasAnimationStarted]);

  return (
    <main className="relative flex-grow flex items-center justify-center overflow-hidden bg-white">
      {/* Container for the animated components over the canvas */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 w-full">
        {!hasAnimationFinished ? (
          <div className={isAnimationActive ? 'pointer-events-none' : 'pointer-events-auto'}>
            <TypewriterHero isAnimationActive={isAnimationActive} />
          </div>
        ) : (
          <HomeMenu isVisible={hasAnimationFinished} />
        )}
      </div>

      <DandelionAnimation onAnimationStart={(active) => setIsAnimationActive(active)} />
    </main>
  );
}
