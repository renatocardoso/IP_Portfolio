"use client";

import { useState, useEffect } from "react";

import { typewriterWords } from "../data/typewriterWords";

export default function TypewriterHero({ onMouseEnter, isAnimationActive }) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [blink, setBlink] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [isResetVisible, setIsResetVisible] = useState(true);

    // 1. Force revert if animation awakens
    useEffect(() => {
        if (isAnimationActive) {
            setIsStarted(false);
            setSubIndex(0);
            setIsDeleting(false);
            setIndex(0); // Optional: reset word flow completely

            // Hide the component while the Dandelion Animation is flying
            setIsResetVisible(false);
            // 180 frames at 60fps = 3000ms
            const revealTimer = setTimeout(() => {
                setIsResetVisible(true);
            }, 3000);
            return () => clearTimeout(revealTimer);
        } else {
            setIsResetVisible(true);
        }
    }, [isAnimationActive]);

    // 2. Initial wait of 800ms only showing /*
    useEffect(() => {
        if (isAnimationActive) return;

        const startTimer = setTimeout(() => {
            setIsStarted(true);
        }, 800);
        return () => clearTimeout(startTimer);
    }, [isAnimationActive]);

    // 3. Typing Flow
    useEffect(() => {
        if (!isStarted || isAnimationActive) return;

        const typingSpeed = 50; // Much faster typing
        const deletingSpeed = 25; // Much faster deleting
        const pauseDuration = 2000; // Keep word visible for 2 seconds

        // Reached the end of the word, pause then start deleting
        if (subIndex === typewriterWords[index].length && !isDeleting) {
            const pauseTimer = setTimeout(() => setIsDeleting(true), pauseDuration);
            return () => clearTimeout(pauseTimer);
        }

        // Finished deleting, go to next word IMMEDIATELY without waiting.
        if (subIndex === 0 && isDeleting) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % typewriterWords.length);
            return;
        }

        // Typing/Deleting increment loop
        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [subIndex, index, isDeleting, isStarted]);

    // Blink cursor
    useEffect(() => {
        const blinkTimeout = setInterval(() => setBlink((prev) => !prev), 500);
        return () => clearInterval(blinkTimeout);
    }, []);

    return (
        <div
            id="hero-typewriter"
            className={`inline-flex items-center justify-center cursor-pointer font-fira text-4xl md:text-6xl text-[#333] selection:bg-[#FF4E50] selection:text-white ${!isAnimationActive ? 'transition-opacity duration-1000 opacity-100' : 'opacity-0'}`}
            onMouseEnter={onMouseEnter}
        >
            <span className={`text-[#333]`}>/</span>
            <span id="hero-asterisk" className={`text-[#FF4E50] mr-2`}>
                *
            </span>
            <span className="whitespace-nowrap flex items-center">
                {!isAnimationActive && isStarted ? typewriterWords[index].substring(0, subIndex) : ""}
                {!isAnimationActive && (
                    <span className={`${blink ? "opacity-100" : "opacity-0"} text-[#333] ml-[2px] mb-1 transition-opacity duration-100 font-light`}>
                        |
                    </span>
                )}
            </span>
        </div>
    );
}
