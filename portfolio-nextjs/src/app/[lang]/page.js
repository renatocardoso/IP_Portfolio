"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import DandelionAnimation from "@/components/DandelionAnimation";

function FarfalleSvg({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 227.2 222.9"
            className={className}
            aria-label="Farfalle"
        >
            <g fill="none" stroke="currentColor" strokeWidth="1.2">
                <polygon
                    strokeMiterlimit="10"
                    points="15.5 114.4 9.1 124.7 78.5 149.7 138.9 27.3 132.8 23.3 73.5 136.7 15.5 114.4"
                />
                <polygon
                    strokeMiterlimit="10"
                    points="101.4 138.3 120.7 215.1 125.4 213.6 178.6 205.8 161.5 128.8 136.7 140.6 104.3 133.2 101.4 138.3"
                />
                <path
                    strokeLinejoin="round"
                    d="M176.9,32.6c-.3.6-40.2,108-40.2,108l24.7-11.8,3.3,13.2,3.8-.9,33.4-110.6-25,2.1Z"
                />
                <polygon
                    strokeLinejoin="round"
                    points="138.9 27.3 176.9 32.6 136.7 140.6 104.3 133.2 101.4 138.3 103.8 148.2 78.5 149.7 138.9 27.3"
                />
                <polygon
                    strokeLinejoin="round"
                    points="202 30.5 198 26.6 172.7 28.9 132.9 23.2 138.9 27.3 176.3 32.6 202 30.5"
                />
                <line strokeLinejoin="round" x1="176.9" y1="32.6" x2="172.3" y2="28.8" />
                <polygon
                    strokeLinejoin="round"
                    points="80.8 122.5 73.3 136.4 15.5 114.4 55.4 115.4 80.8 122.5"
                />
                <polygon
                    strokeLinejoin="round"
                    points="85.8 113.4 79.2 111.5 55.4 115.4 80.8 122.5 85.8 113.4"
                />
                <polygon
                    strokeLinejoin="round"
                    points="33.1 134.1 22.5 196 27.2 197.6 37.7 135.3 33.1 134.1"
                />
                <polygon
                    strokeLinejoin="round"
                    points="74.5 191.4 27.2 197.6 37.7 135.3 56.5 141.7 53.6 151.7 84.3 158.2 74.5 191.4"
                />
                <polygon
                    strokeLinejoin="round"
                    points="107.6 163.1 53.6 151.7 56.5 141.7 78.5 149.7 103.8 148.2 107.6 163.1"
                />
                <line strokeLinejoin="round" x1="104.3" y1="133.2" x2="125.4" y2="213.6" />
            </g>
        </svg>
    );
}

function HyggeSvg({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 310.7 222.9"
            className={className}
            aria-label="Hygge"
        >
            <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2">
                <path d="M34.1,125.1s-5.1-.5-5.3,5.7c-.1,6.2.1,64.6.1,64.6,0,0,.7,4.7,6.6,4.7s8.2-5.4,8.2-5.4l-.3-35.4,176,5.1s2.8-1.3,2.5,4.5,0,36.2,0,36.2c0,0,.4,5.3,6.2,5s8.2-.7,8.2-4.9-.5-42.3-.5-42.3l27.1-2.2v34.3s.5,2.8,5.7,2.8,7.5-2.2,7.5-4.5v-62.1s-1.2-2.1-2.6-2.1-.5.8-.5.8c0,0-.7,13.6-3.6,15.9s-6.6,3.7-12.8,4.2-21,1.1-21,1.1l.3-19.1s-1.1-4.9-6.7-4.7-7.5,3-7.5,6.2-.1,14.2-.1,14.2c0,0,.1,3.4-6.2,3.4s-170.6-4.6-170.6-4.6c0,0-5.9-2.5-6.3-10.1s1.7-10.3,1.7-10.3c0,0,0-.8-6.1-.9Z" />
                <path d="M111.1,188.7v-27.5l12.9.5v26.2c-.1,0-.8,2.9-6.1,2.9s-6.9-2.1-6.9-2.1Z" />
                <path d="M223,129.8s.7-4.5-5.9-9-14.1-10.3-14.6-11.1-1.3-2.9-1.3-2.9c0,0-37.2-4.1-53-4.2s-68.4-.8-84.5,5.5-21.9,14.6-23.6,17.8" />
                <path d="M201.1,106.9c-.1-27.1,7.5-34,11.1-37.2s16.5-5,32.3-5.1,19.4,4.1,19.4,4.1c0,0,10.9,4.2,10.8,26.7s-.5,29.9-1.2,33.6" />
                <path d="M107.7,103.3s.1-27.5-3.6-32.3-12.6-7.1-16.3-7.2-36.4-.1-36.4-.1c0,0-15.8.5-17.8,16.5s-1.1,39.3-.1,44.1" />
                <path d="M218.7,67.2l-107.4-.7s-9.6,0-9.3,2.1" />
                <path d="M263.8,68.7s1.4-29,.9-31.5-2.1-9.8-9.1-9.9-138.8-.1-138.8-.1c0,0-12.6-.3-13.2,10.4s-1.7,27.1-1.7,27.1c0,0,0,2.2,1.1,3" />
            </g>
        </svg>
    );
}

export default function Home() {
    const params = useParams();
    const locale = params?.lang || "pt";
    const [isAnimationActive, setIsAnimationActive] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <main className="relative flex-grow flex items-center justify-center overflow-hidden bg-white">
            {/* Initial "/*" trigger */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-10 w-full transition-opacity duration-300 ${
                    !isAnimationActive
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                <div
                    id="hero-trigger"
                    className="inline-flex items-center justify-center p-6 cursor-pointer font-sans font-normal text-3xl sm:text-4xl md:text-[60px] text-[#333] leading-none select-none"
                >
                    <span className="text-[#333]">/</span>
                    <span id="hero-asterisk" className="text-[#FF4E50] ml-1">
                        *
                    </span>
                </div>
            </div>

            {/* 2 SVG Navigation Buttons (Fade in after dandelion fades out) */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-20 px-8 transition-opacity duration-1000 ease-out ${
                    showMenu
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 lg:gap-32">
                    <Link
                        href={`/${locale}/produto/farfalle`}
                        className="group flex items-center justify-center text-[#333] hover:text-[#FF4E50] transition-all duration-300 hover:scale-105"
                        title="Farfalle"
                    >
                        <FarfalleSvg className="h-32 md:h-40 lg:h-48 w-auto" />
                    </Link>

                    <Link
                        href={`/${locale}/produto/hygge`}
                        className="group flex items-center justify-center text-[#333] hover:text-[#FF4E50] transition-all duration-300 hover:scale-105"
                        title="Hygge"
                    >
                        <HyggeSvg className="h-32 md:h-40 lg:h-48 w-auto" />
                    </Link>
                </div>
            </div>

            <DandelionAnimation
                onAnimationStart={(active) => setIsAnimationActive(active)}
                onAnimationComplete={() => setShowMenu(true)}
            />
        </main>
    );
}
