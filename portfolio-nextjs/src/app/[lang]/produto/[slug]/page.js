"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import { projetosData } from "../../../../data/produtoData";

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

export default function ProjetoDetalheProduto() {
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
        <div className="flex flex-col w-full max-w-none bg-white">
            <style>{`
                .project-media-first {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 40px 40px 0 40px;
                    background-color: #ffffff;
                }
                .project-media-gallery {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0 40px 40px 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                    background-color: #ffffff;
                }
                .project-info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    width: 100%;
                    align-items: start;
                }
                .project-info-title-col {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                }
                .project-info-desc-col {
                    text-align: left;
                }
                @media (min-width: 768px) {
                    .project-info-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 3rem;
                    }
                    .project-info-title-col {
                        align-items: flex-end;
                        text-align: right;
                    }
                }
            `}</style>

            {/* 1. PRIMEIRA IMAGEM (COM MARGEM BRANCA DE 40PX) */}
            <section className="project-media-first">
                {renderMediaItem(firstMedia, 0, projeto.title)}
            </section>

            {/* 2. CONTEÚDO DE TEXTO: 2 COLUNAS NO DESKTOP (1ª TÍTULO À DIREITA | 2ª TEXTO À ESQUERDA) */}
            <section className="w-full px-8 lg:px-30 py-14 md:py-20 bg-white text-[#333]">
                <div className="project-info-grid">
                    {/* Coluna 1 (Esquerda): Título, Cliente e Ano alinhados à direita no desktop e à esquerda no mobile */}
                    <div className="project-info-title-col">
                        {projeto.desc_en && (
                            <div className="flex gap-2 mb-6 text-base font-bold">
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
                        <h2 className="text-[1.4rem] md:text-[1.6rem] mt-0 mb-4 font-normal leading-tight">
                            {contentLang === "pt" ? projeto.title : projeto.title_en || projeto.title}
                        </h2>
                        <p className="mt-2 font-bold">{projeto.client}</p>
                        <p className="mt-1 font-bold">{projeto.year}</p>
                    </div>

                    {/* Coluna 2 (Direita): Texto descritivo alinhado à esquerda */}
                    <div className="project-info-desc-col text-base leading-relaxed whitespace-pre-wrap">
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

            {/* 3. DEMAIS IMAGENS (COM MARGEM BRANCA DE 40PX) */}
            <section className="project-media-gallery">
                {remainingMedia.map((media, idx) =>
                    renderMediaItem(media, idx + 1, projeto.title)
                )}
            </section>
        </div>
    );
}
