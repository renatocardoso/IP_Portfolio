"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import DandelionAnimation from "@/components/DandelionAnimation";
import TypewriterHero from "@/components/TypewriterHero";

const heroWords = {
    pt: ["infinita poesia", "marcas", "produtos", "design", "criatividade", "arte", "identidade", "marcas", "cultura", "design", "produtos", "ideias"],
    en: ["infinite poetry", "brands", "products", "design", "creativity", "art", "identity", "brands", "culture", "design", "products", "ideas"],
};

const menuLabels = {
    pt: { sobre: "* Sobre", projetos: "* Projetos" },
    en: { sobre: "* About", projetos: "* Projects" },
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
        { label: labels.projetos, url: `/${locale}/projetos` },
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
