"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { projetosData } from "../../../../data/graficoData";

export default function ProjetoDetalhe() {
    const { lang, slug } = useParams();
    const urlLang = lang || "pt";
    const [contentLang, setContentLang] = useState(urlLang);

    const projeto = projetosData.find((p) => p.slug === slug);

    if (!projeto) {
        return <div className="text-center py-20">Projeto não encontrado.</div>;
    }

    const title = contentLang === "pt" ? projeto.title : projeto.title_en || projeto.title;
    const descParts = (contentLang === "pt" ? projeto.desc_pt : projeto.desc_en || projeto.desc_pt)?.split('\n\n') || [];

    return (
        <main className="relative bg-white font-sans">

            {/* WRAPPER DE REVEAL (Hero + Imagem) */}
            <div className="relative w-full bg-gray-900">
                
                <div className="sticky top-0 z-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
                    <Image 
                        src={projeto.gallery[0]?.src || "/panF.jpg"} 
                        alt={title} 
                        fill 
                        className="object-contain md:object-cover" 
                        priority
                        unoptimized
                    />
                </div>

                <section className="relative z-20 mt-[-100vh] flex w-full flex-col justify-center bg-white px-6 py-[200px] md:px-12 lg:px-24 shadow-md">
                    {/* Header com Navegação e Idioma */}
                    <div className="w-full flex justify-between items-start mb-12">
                        <Link href={`/${urlLang}`} className="font-bold text-[1.2rem] hidden md:block text-text-dark">
                            infinita poesia /
                        </Link>
                        {projeto.desc_en && (
                            <div className="flex gap-2 text-base font-bold text-text-dark">
                                <button
                                    onClick={() => setContentLang("pt")}
                                    className={`transition-opacity duration-300 ${contentLang === "pt" ? "opacity-50" : "hover:opacity-50"}`}
                                >
                                    PT
                                </button>
                                <span className="text-text-dark">/</span>
                                <button
                                    onClick={() => setContentLang("en")}
                                    className={`transition-opacity duration-300 ${contentLang === "en" ? "opacity-50" : "hover:opacity-50"}`}
                                >
                                    EN
                                </button>
                            </div>
                        )}
                    </div>

                    <h1 className="type-h1 text-text-dark">
                        {title}
                    </h1>
                    <h3 className="mt-8 max-w-4xl type-h3 text-[var(--color-text-gray)]">
                        {descParts[0]?.replace(/\*\*(.*?)\*\*/g, '$1') || "Descrição do projeto"}
                    </h3>
                </section>

                <div className="h-screen w-full pointer-events-none invisible"></div>
            </div>

            <div className="relative z-20 bg-white">

                {/* Sessão 1 */}
                <section className="w-full px-8 lg:px-30 py-24 md:py-32">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <h2 className="text-3xl font-semibold text-gray-900">Contexto</h2>
                            <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {descParts[1]?.replace(/\*\*(.*?)\*\*/g, '$1') || "Texto alinhado à esquerda ocupando 1 terço do espaço."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-8 md:col-span-2">
                            {projeto.gallery.slice(1, 4).map((media, idx) => (
                                <div key={idx} className="relative w-full h-[60vh] bg-gray-100">
                                    <Image src={media.src} alt={`Imagem ${idx+1}`} fill className="object-cover" unoptimized />
                                </div>
                            ))}
                        </div>
                    </div>

                    {projeto.gallery[4] && (
                        <div className="mt-16 h-[60vh] w-full relative bg-gray-200">
                            <Image src={projeto.gallery[4].src} alt="Destaque" fill className="object-cover" unoptimized />
                        </div>
                    )}
                </section>

                {/* Sessão 2 */}
                <section className="w-full px-8 lg:px-30 py-24 md:py-32">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

                        <div className="md:col-span-1">
                            <div className="sticky top-24">
                                <h2 className="text-3xl font-semibold text-gray-900">Processo</h2>
                                <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {descParts[2]?.replace(/\*\*(.*?)\*\*/g, '$1') || "Este texto permanece travado na tela enquanto as imagens ao lado rolam livremente."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2">
                            {projeto.gallery.slice(5, 9).map((media, idx) => (
                                <div key={idx} className="contents">
                                    <div className="h-80 relative bg-gray-100">
                                        <Image src={media.src} alt={`Detalhe ${idx+1}`} fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-xl font-medium">Detalhe 0{idx + 1}</h3>
                                        <p className="mt-2 text-gray-600">Descrição correspondente à imagem {idx + 1}.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* NOVA SESSÃO: Imagens pós-Processo */}
                <section className="w-full px-8 lg:px-30 pb-24 md:pb-32">
                    <div className="flex flex-col gap-8">
                        {projeto.gallery.slice(9, 11).map((media, idx) => (
                            <div key={idx} className="h-[70vh] relative w-full bg-gray-200">
                                <Image src={media.src} alt={`Pós-processo ${idx+1}`} fill className="object-cover" unoptimized />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sessão 3 */}
                <section className="w-full px-8 lg:px-30 py-24 md:py-32">
                    <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <h2 className="text-3xl font-semibold text-gray-900">Resultados</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {descParts[3]?.replace(/\*\*(.*?)\*\*/g, '$1') || "Primeira coluna de texto ocupando o centro da tela."}
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>Cliente:</strong> {projeto.client}<br/>
                                <strong>Ano:</strong> {projeto.year}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {projeto.gallery.slice(11).map((media, idx) => (
                            <div key={idx} className="h-[70vh] relative w-full bg-gray-100">
                                <Image src={media.src} alt={`Final ${idx+1}`} fill className="object-cover" unoptimized />
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}
