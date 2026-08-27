"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import DandelionAnimation from "@/components/DandelionAnimation";
import TypewriterHero from "@/components/TypewriterHero";

const heroWords = {
    pt: ["apaguem as luzes", "que as ideias", "estão acesas"],
    en: ["apaguem as luzes", "que as ideias", "estão acesas"],
};

const menuLabels = {
    pt: { sobre: "* Sobre", grafico: "* Gráfico", produto: "* Produto" },
    en: { sobre: "* About", grafico: "* Graphic", produto: "* Product" },
};

export default function Home() {
    const params = useParams();
    const locale = params?.lang || "pt";
    const [isAnimationActive, setIsAnimationActive] = useState(false);

    useEffect(() => {}, [isAnimationActive]);

    const words = heroWords[locale] || heroWords.pt;
    const labels = menuLabels[locale] || menuLabels.pt;

    const menuItems = [
        { label: labels.sobre, url: `/${locale}/sobre` },
        { label: labels.grafico, url: `/${locale}/grafico` },
        { label: labels.produto, url: `/${locale}/produto` },
    ];

    return (
        <main className="relative flex-grow flex items-center justify-center overflow-hidden bg-white">
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 w-full">
                <div className={isAnimationActive ? "pointer-events-none" : "pointer-events-auto"}>
                    <TypewriterHero isAnimationActive={isAnimationActive} words={words} />
                </div>
            </div>
            <DandelionAnimation
                onAnimationStart={(active) => setIsAnimationActive(active)}
                menuItems={menuItems}
            />
        </main>
    );
}
