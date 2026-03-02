"use client";

import Image from "next/image";
import { useState, use } from "react";
import Link from "next/link";
import { projetosData } from "../data"; // We will create this centralized data file

export default function ProjetoDetalhe({ params }) {
    const unwrappedParams = use(params);
    const { slug } = unwrappedParams;
    const [lang, setLang] = useState("pt");

    const projeto = projetosData.find((p) => p.slug === slug);

    if (!projeto) {
        return <div className="text-center py-20">Projeto não encontrado.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-start gap-0 md:gap-8 max-w-none w-full">
            {/* PAINEL DE INFORMAÇÕES (ESQUERDA) */}
            <aside className="relative md:sticky md:top-0 w-full md:h-auto flex flex-col p-16 md:p-20 bg-white z-10 order-2 md:order-1">
                <Link href="/" className="font-bold text-[1.2rem] mb-12 hidden md:block">
                    infinita poesia /
                </Link>

                {/* Language Switcher */}
                {projeto.desc_en && (
                    <div className="flex gap-2 mb-8 text-base font-bold">
                        <button
                            onClick={() => setLang("pt")}
                            className={`transition-opacity duration-300 ${lang === "pt" ? "opacity-50" : "hover:opacity-50"
                                }`}
                        >
                            PT
                        </button>
                        <span>/</span>
                        <button
                            onClick={() => setLang("en")}
                            className={`transition-opacity duration-300 ${lang === "en" ? "opacity-50" : "hover:opacity-50"
                                }`}
                        >
                            EN
                        </button>
                    </div>
                )}

                <div className="text-[#333]">
                    <h2 className="text-[1.2rem] mt-0 mb-4 font-normal leading-tight">
                        {lang === "pt" ? projeto.title : projeto.title_en || projeto.title}
                    </h2>
                    <div className="mb-4 text-base leading-relaxed whitespace-pre-wrap">
                        {(lang === "pt" ? projeto.desc_pt : projeto.desc_en || projeto.desc_pt)
                            .split("**")
                            .map((chunk, index) =>
                                index % 2 === 1 ? <strong key={index}>{chunk}</strong> : chunk
                            )}
                    </div>

                    <p className="mt-8 font-bold">{projeto.client}</p>
                    <p className="mt-1 font-bold">{projeto.year}</p>
                </div>
            </aside>

            {/* GALERIA DE IMAGENS (DIREITA) */}
            <section className="flex flex-col w-full pb-12 order-1 md:order-2 md:pr-[10vw]">
                {projeto.gallery.map((media, idx) => {
                    if (media.type === "video") {
                        return (
                            <video key={idx} controls className="w-full h-auto block mb-1">
                                <source src={media.src} type="video/mp4" />
                                Seu navegador não suporta a tag de vídeo.
                            </video>
                        );
                    }
                    return (
                        <Image
                            key={idx}
                            src={media.src}
                            alt={`${projeto.title} - Imagem ${idx + 1}`}
                            width={1600}
                            height={1200}
                            unoptimized
                            className="w-full h-auto block"
                        />
                    );
                })}
            </section>
        </div>
    );
}
