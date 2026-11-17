"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import { projetosData } from "@/data/graficoData";

function renderMediaItem(media, idx, projectTitle) {
    if (!media) return null;
    if (media.type === "video") {
        return (
            <video key={idx} controls className="w-full h-auto block">
                <source src={media.src} type="video/mp4" />
            </video>
        );
    }
    return (
        <Image
            key={idx}
            src={media.src}
            alt={`${projectTitle} - Imagem ${idx + 1}`}
            width={1920}
            height={1080}
            unoptimized
            className="w-full h-auto block"
        />
    );
}

export default function ProjetoDetalheGrafico() {
    const { lang, slug } = useParams();
    const urlLang = lang || "pt";
    const [contentLang, setContentLang] = useState(urlLang);

    const projeto = projetosData.find((p) => p.slug === slug);

    if (!projeto) {
        return <div className="text-center py-20">Projeto não encontrado.</div>;
    }

    const firstMedia = projeto.gallery?.[0];
    const remainingMedia = projeto.gallery?.slice(1) || [];
    const descriptionText =
        contentLang === "pt" ? projeto.desc_pt : projeto.desc_en || projeto.desc_pt;

    return (
        <div className="flex flex-col w-full max-w-none">
            {/* 1. PRIMEIRA IMAGEM (LARGURA INTEIRA) */}
            <section className="w-full">
                {renderMediaItem(firstMedia, 0, projeto.title)}
            </section>

            {/* 2. CONTEÚDO DE TEXTO: 1/3 TÍTULO (ESQUERDA) + 2/3 TEXTO DESCRITIVO (DIREITA) */}
            <section className="w-full px-8 lg:px-30 py-14 md:py-20 bg-white text-[#333]">
                {projeto.desc_en && (
                    <div className="flex gap-2 mb-8 text-base font-bold">
                        <button
                            onClick={() => setContentLang("pt")}
                            className={`transition-opacity duration-300 ${contentLang === "pt" ? "opacity-50" : "hover:opacity-50"}`}
                        >
                            PT
                        </button>
                        <span>/</span>
                        <button
                            onClick={() => setContentLang("en")}
                            className={`transition-opacity duration-300 ${contentLang === "en" ? "opacity-50" : "hover:opacity-50"}`}
                        >
                            EN
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-start gap-8 md:gap-12 w-full">
                    {/* 1/3 Esquerda: Título do projeto, Cliente e Ano */}
                    <div className="flex flex-col text-left">
                        <h2 className="text-[1.4rem] md:text-[1.6rem] mt-0 mb-4 font-normal leading-tight whitespace-pre-line">
                            {contentLang === "pt" ? projeto.title : projeto.title_en || projeto.title}
                        </h2>
                        <p className="mt-2 font-bold">{projeto.client}</p>
                        <p className="mt-1 font-bold">{projeto.year}</p>
                    </div>

                    {/* 2/3 Direita: Texto descritivo do projeto */}
                    <div className="text-base leading-relaxed whitespace-pre-wrap">
                        {descriptionText
                            ?.split("**")
                            .map((chunk, index) =>
                                index % 2 === 1 ? (
                                    <strong key={index} className="font-bold text-[#111]">
                                        {chunk}
                                    </strong>
                                ) : (
                                    chunk
                                )
                            )}
                    </div>
                </div>
            </section>

            {/* 3. DEMAIS IMAGENS (LARGURA INTEIRA) */}
            <section className="flex flex-col gap-1 w-full pb-12">
                {remainingMedia.map((media, idx) =>
                    renderMediaItem(media, idx + 1, projeto.title)
                )}
            </section>
        </div>
    );
}
