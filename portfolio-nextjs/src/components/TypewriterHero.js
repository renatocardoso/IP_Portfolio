"use client";

import { useState, useEffect } from "react";
import { typewriterWords } from "../data/siteData";

export default function TypewriterHero({ onMouseEnter, isAnimationActive, words: wordsProp }) {
    const wordList = wordsProp || typewriterWords;

    const [line1Text, setLine1Text] = useState("");
    const [line2Text, setLine2Text] = useState("");
    const [line3Text, setLine3Text] = useState("");

    const [showAsterisk, setShowAsterisk] = useState(true);
    const [activeLineIndex, setActiveLineIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [blink, setBlink] = useState(true);
    const [isStarted, setIsStarted] = useState(false);

    // Reset flow when dandelion animation is triggered or ends
    useEffect(() => {
        if (isAnimationActive) {
            setIsStarted(false);
            setLine1Text("");
            setLine2Text("");
            setLine3Text("");
            setShowAsterisk(true);
            setActiveLineIndex(0);
            setIsDeleting(false);
            setIsHolding(false);
        } else {
            const startTimer = setTimeout(() => {
                setIsStarted(true);
            }, 300);
            return () => clearTimeout(startTimer);
        }
    }, [isAnimationActive]);

    // Cursor blinking effect
    useEffect(() => {
        const blinkTimeout = setInterval(() => setBlink((prev) => !prev), 500);
        return () => clearInterval(blinkTimeout);
    }, []);

    // Main Typewriter State Machine Loop
    useEffect(() => {
        if (!isStarted || isAnimationActive) return;

        const typingSpeed = 65;    // ms per character typed
        const deletingSpeed = 30;  // ms per character erased
        const holdDuration = 5000; // 5 seconds holding full 3-line poem

        // 1. HOLDING PHASE (5 seconds)
        if (isHolding) {
            const holdTimer = setTimeout(() => {
                setIsHolding(false);
                setIsDeleting(true);
                setActiveLineIndex(2);
            }, holdDuration);
            return () => clearTimeout(holdTimer);
        }

        // 2. DELETING PHASE
        if (isDeleting) {
            const timer = setTimeout(() => {
                if (activeLineIndex === 2) {
                    if (line3Text.length > 0) {
                        setLine3Text((prev) => prev.slice(0, -1));
                    } else {
                        setActiveLineIndex(1);
                    }
                } else if (activeLineIndex === 1) {
                    if (line2Text.length > 0) {
                        setLine2Text((prev) => prev.slice(0, -1));
                    } else {
                        setActiveLineIndex(0);
                    }
                } else if (activeLineIndex === 0) {
                    if (line1Text.length > 0) {
                        setLine1Text((prev) => prev.slice(0, -1));
                    } else {
                        setIsDeleting(false);
                        setShowAsterisk(true);
                        setActiveLineIndex(0);
                    }
                }
            }, deletingSpeed);
            return () => clearTimeout(timer);
        }

        // 3. TYPING PHASE
        const timer = setTimeout(() => {
            if (showAsterisk) {
                setShowAsterisk(false);
                setActiveLineIndex(0);
                return;
            }

            if (activeLineIndex === 0) {
                const target = wordList[0] || "apaguem as luzes";
                if (line1Text.length < target.length) {
                    setLine1Text(target.substring(0, line1Text.length + 1));
                } else {
                    setActiveLineIndex(1);
                }
            } else if (activeLineIndex === 1) {
                const target = wordList[1] || "que as ideias";
                if (line2Text.length < target.length) {
                    setLine2Text(target.substring(0, line2Text.length + 1));
                } else {
                    setActiveLineIndex(2);
                }
            } else if (activeLineIndex === 2) {
                const target = wordList[2] || "estão acesas.";
                if (line3Text.length < target.length) {
                    setLine3Text(target.substring(0, line3Text.length + 1));
                } else {
                    setIsHolding(true);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [
        isStarted,
        isAnimationActive,
        showAsterisk,
        activeLineIndex,
        isDeleting,
        isHolding,
        line1Text,
        line2Text,
        line3Text,
        wordList
    ]);

    return (
        <div
            id="hero-typewriter"
            className={`inline-flex flex-col items-center justify-center text-center cursor-pointer font-sans font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#333] leading-tight selection:bg-[#FF4E50] selection:text-white ${
                !isAnimationActive ? "transition-opacity duration-1000 opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onMouseEnter={onMouseEnter}
        >
            {/* Line 1 */}
            <div className="flex items-center justify-center whitespace-pre">
                <span className="text-[#333]">/</span>
                {showAsterisk ? (
                    <span id="hero-asterisk" className="text-[#FF4E50] ml-1">
                        *
                    </span>
                ) : (
                    <span className="text-[#333]"> {line1Text}</span>
                )}
                {!isAnimationActive && activeLineIndex === 0 && !isHolding && (
                    <span
                        className={`${
                            blink ? "opacity-100" : "opacity-0"
                        } text-[#333] ml-[2px] font-light transition-opacity duration-100`}
                    >
                        |
                    </span>
                )}
            </div>

            {/* Line 2 */}
            {(activeLineIndex >= 1 || line2Text.length > 0) && (
                <div className="flex items-center justify-center whitespace-pre mt-1">
                    <span className="text-[#333]">{line2Text}</span>
                    {!isAnimationActive && activeLineIndex === 1 && !isHolding && (
                        <span
                            className={`${
                                blink ? "opacity-100" : "opacity-0"
                            } text-[#333] ml-[2px] font-light transition-opacity duration-100`}
                        >
                            |
                        </span>
                    )}
                </div>
            )}

            {/* Line 3 */}
            {(activeLineIndex >= 2 || line3Text.length > 0) && (
                <div className="flex items-center justify-center whitespace-pre mt-1">
                    <span className="text-[#333]">{line3Text}</span>
                    {!isAnimationActive && (activeLineIndex === 2 || isHolding) && (
                        <span
                            className={`${
                                blink ? "opacity-100" : "opacity-0"
                            } text-[#333] ml-[2px] font-light transition-opacity duration-100`}
                        >
                            |
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
