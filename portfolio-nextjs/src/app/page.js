"use client";

import { useState } from "react";
import DandelionAnimation from "@/components/DandelionAnimation";
import TypewriterHero from "@/components/TypewriterHero";

export default function Home() {
  const [isAnimationActive, setIsAnimationActive] = useState(false);

  return (
    <main className="relative flex-grow flex items-center justify-center overflow-hidden bg-white">
      {/* Container for the animated Hero text over the canvas */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 w-full">
        <div className={isAnimationActive ? 'pointer-events-none' : 'pointer-events-auto'}>
          <TypewriterHero isAnimationActive={isAnimationActive} />
        </div>
      </div>

      {/* 
        The DandelionAnimation component is positioned absolutely within itself 
        to cover the screen.
      */}
      <DandelionAnimation onAnimationStart={(active) => setIsAnimationActive(active)} />
    </main>
  );
}
