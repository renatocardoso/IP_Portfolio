"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

// ─── Conteúdo bilíngue ────────────────────────────────────────────────────────
const content = {
    pt: {
        title: "Identidade Visual do Plano de Ação Nacional para conservação de espécies ameaçadas de extinção, PAN e SISPAN.",
        client: "WWF — ICMBio",
        year: "2024",
        context: {
            heading: "Contexto",
            body: "Os Planos de Ação Nacional (PAN) são instrumentos de políticas públicas desenhados para conservar espécies ameaçadas. Eles identificam ameaças à fauna, flora e ambientes naturais, estabelecendo ações estratégicas de conservação para espécies e habitats.",
        },
        process: {
            heading: "Processo",
            body: "Um sistema de marca dinâmico foi desenvolvido para fornecer uma identidade única para cada Plano de Ação, mantendo ao mesmo tempo um senso de unidade e colaboração institucional.",
            captions: [
                "Sistema de marca dinâmico",
                "Identidade por espécie ameaçada",
                "Logotipo PAN — cheio e vazio",
                "Espaço negativo na tipografia",
                "Expansão ao SISPAN",
            ],
        },
        results: {
            heading: "Resultados",
            col1: "O design explora o espaço negativo dentro da tipografia. As formas de encaixe preenchem as contraformas, criando a sigla \u201cPAN\u201d através da união entre cheio e vazio.",
            col2: "O projeto envolveu extensa colaboração com pesquisadores do ICMBio para definir temas e espécies representativas. O sistema se estende ao SISPAN, reforçando a consistência desta iniciativa de conservação.",
        },
    },
    en: {
        title: "Visual Identity for the National Action Plan for the Conservation of Endangered Species, PAN and SISPAN.",
        client: "WWF — ICMBio",
        year: "2024",
        context: {
            heading: "Context",
            body: "The National Action Plans (PAN) are public policy instruments designed to conserve endangered species. They identify threats to fauna, flora, and natural environments, establishing strategic conservation actions for species and habitats.",
        },
        process: {
            heading: "Process",
            body: "A dynamic brand system was developed to provide a unique identity for each Action Plan, maintaining, at the same time, a sense of unity and institutional collaboration.",
            captions: [
                "Dynamic brand system",
                "Species-specific identity",
                "PAN logotype — solid and void",
                "Negative space in typography",
                "Expansion to SISPAN",
            ],
        },
        results: {
            heading: "Results",
            col1: "The design explores negative space within the typography. Interlocking shapes fill the counters, creating the acronym \u201cPAN\u201d through the union of solid and void.",
            col2: "The project involved extensive collaboration with ICMBio researchers to define themes and representative species. The system extends to SISPAN, reinforcing the consistency of this conservation initiative.",
        },
    },
};

// ─── Imagens (ordem narrativa) ────────────────────────────────────────────────
const heroImage = "/panF.jpg";

const contextImages = {
    stacked: ["/panQ.jpg", "/panH.jpg", "/panV.jpg"],
    full: "/panU.jpg",
};

const processImages = [
    "/panI.jpg",
    "/panJ.jpg",
    "/panL.jpg",
    "/detalhePanA.jpg",
    "/panK.jpg",
];

const postProcessImages = ["/panM.jpg", "/panP.jpg"];

const resultsImages = [
    "/panN.jpg",
    "/panS.jpg",
    "/panO.jpg",
    "/panT.jpg",
    "/panY.jpg",
    "/panX.jpg",
];

// ─── Página ───────────────────────────────────────────────────────────────────
export default function ProjetoPAN() {
    const { lang } = useParams();
    const t = content[lang] || content.pt;

    return (
        <main className="relative bg-white font-sans">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative z-20 flex h-screen flex-col justify-center bg-white px-6 md:px-12 lg:px-24">
                <h1 className="type-h1 max-w-4xl text-text-dark md:text-7xl">
                    {t.title}
                </h1>
                <p className="type-body mt-6 text-text-gray">
                    {t.client} &mdash; {t.year}
                </p>
            </section>

            {/* ── IMAGEM FIXA (EFEITO REVEAL) ───────────────────────────────── */}
            <section className="sticky top-0 z-0 h-screen w-full overflow-hidden">
                <Image
                    src={heroImage}
                    alt="PAN — Identidade Visual"
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                />
            </section>

            {/* ── CONTEÚDO SCROLLÁVEL ──────────────────────────────────────── */}
            <div className="relative z-20 bg-white">

                {/* ── SEÇÃO 1: CONTEXTO ────────────────────────────────────── */}
                <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

                        {/* Texto */}
                        <div className="md:col-span-1">
                            <h2 className="type-h2 text-text-dark">
                                {t.context.heading}
                            </h2>
                            <p className="type-body mt-6 leading-relaxed text-text-gray">
                                {t.context.body}
                            </p>
                        </div>

                        {/* Imagens empilhadas */}
                        <div className="flex flex-col gap-8 md:col-span-2">
                            {contextImages.stacked.map((src, i) => (
                                <div key={i} className="relative aspect-video w-full overflow-hidden">
                                    <Image
                                        src={src}
                                        alt={`PAN — contexto ${i + 1}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Imagem full-width */}
                    <div className="relative mt-16 h-[60vh] w-full overflow-hidden">
                        <Image
                            src={contextImages.full}
                            alt="PAN — conceito visual"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* ── SEÇÃO 2: PROCESSO ────────────────────────────────────── */}
                <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

                        {/* Texto fixo (sticky) */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24">
                                <h2 className="type-h2 text-text-dark">
                                    {t.process.heading}
                                </h2>
                                <p className="type-body mt-6 leading-relaxed text-text-gray">
                                    {t.process.body}
                                </p>
                            </div>
                        </div>

                        {/* Pares imagem + legenda */}
                        <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2">
                            {processImages.flatMap((src, i) => [
                                <div key={`img-${i}`} className="relative h-80 overflow-hidden">
                                    <Image
                                        src={src}
                                        alt={`PAN — processo ${i + 1}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>,
                                <div key={`cap-${i}`} className="flex flex-col justify-center">
                                    <h3 className="type-h3 text-text-dark">
                                        {String(i + 1).padStart(2, "0")}
                                    </h3>
                                    <p className="type-body mt-2 text-text-gray">
                                        {t.process.captions[i]}
                                    </p>
                                </div>,
                            ])}
                        </div>
                    </div>
                </section>

                {/* ── IMAGENS PÓS-PROCESSO ─────────────────────────────────── */}
                <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
                    <div className="flex flex-col gap-8">
                        {postProcessImages.map((src, i) => (
                            <div key={i} className="relative h-[70vh] w-full overflow-hidden">
                                <Image
                                    src={src}
                                    alt={`PAN — detalhe ${i + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── SEÇÃO 3: RESULTADOS ──────────────────────────────────── */}
                <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">

                    {/* Cabeçalho 1/3 + texto 2/3 */}
                    <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <h2 className="type-h2 text-text-dark">
                                {t.results.heading}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:col-span-2 md:grid-cols-2">
                            <p className="type-body leading-relaxed text-text-gray">
                                {t.results.col1}
                            </p>
                            <p className="type-body leading-relaxed text-text-gray">
                                {t.results.col2}
                            </p>
                        </div>
                    </div>

                    {/* Galeria final */}
                    <div className="flex flex-col gap-8">
                        {resultsImages.map((src, i) => (
                            <div key={i} className="relative h-[70vh] w-full overflow-hidden">
                                <Image
                                    src={src}
                                    alt={`PAN — resultado ${i + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}
