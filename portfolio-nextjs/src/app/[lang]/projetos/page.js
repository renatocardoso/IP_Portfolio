"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { filterTags } from "@/data/siteData";
import ProjectCard from "@/components/ui/ProjectCard";

const todosOsProjetos = [
    // Gráfico
    { slug: "pan", title: "Plano de Ação Nacional para Conservação de Espécies Ameaçadas de Extinção", img: "/pan.jpg", category: "grafico" },
    { slug: "matriz", title: "Matriz da Biodiversidade", img: "/matriz.jpg", category: "grafico" },
    { slug: "pat-tropas", title: "Plano de Ação Territorial Caminho das Tropas PR - SP", img: "/patCaminhoTropas.jpg", category: "grafico" },
    { slug: "pat-planalto-sul", title: "Plano de Ação Territorial Planalto Sul", img: "/patPlanaltoSul.jpg", category: "grafico" },
    { slug: "zimbros", title: "Parque Natural Municipal de Zimbros", img: "/Zimbros.jpg", category: "grafico" },
    { slug: "rizzon", title: "Rizzon", img: "/rizzon.jpg", category: "grafico" },
    { slug: "inga", title: "INGA", img: "/inga.jpg", category: "grafico" },
    { slug: "pan-hb", title: "Plano de Ação Nacional Hileia Baiana", img: "/panHb.jpg", category: "grafico" },
    { slug: "jovem-cidadao", title: "Jovem Cidadão", img: "/jc.jpg", category: "grafico" },
    { slug: "dra-ana", title: "Dra. Ana Gelatti", img: "/lung.jpg", category: "grafico" },
    { slug: "mexilhao", title: "Projeto Mexilhão-Dourado no Alto Rio Uruguai", img: "/md.jpg", category: "grafico" },
    { slug: "abeevita", title: "Abeevita", img: "/abeevita.jpg", category: "grafico" },
    { slug: "pat-campanha", title: "Plano de Ação Territorial Campanha Sul e Serra do Sudeste", img: "/patCanoanhaSerra.jpg", category: "grafico" },
    { slug: "dra-char", title: "Dra. Char", img: "/draChar.jpg", category: "grafico" },
    { slug: "rewire", title: "Rewire", img: "/rewire.jpg", category: "grafico" },
    { slug: "rendase", title: "Renda-se", img: "/rendase.jpg", category: "grafico" },
    { slug: "simple", title: "Simple on the beach", img: "/simple.jpg", category: "grafico" },
    { slug: "outrora", title: "Outrora Formosa", img: "/outrora.jpg", category: "grafico" },
    { slug: "ilc", title: "Hotel Il Campanario", img: "/ilc.jpg", category: "grafico" },
    { slug: "praia", title: "PRAIA", img: "/praia.jpg", category: "grafico" },
    { slug: "guapi", title: "Trilha ecológica da Área de Proteção Ambiental de Guapimirim - RJ", img: "/guapi2.jpg", category: "grafico" },
    { slug: "sj", title: "São João Doces e Salgados", img: "/sj.jpg", category: "grafico" },
    { slug: "info", title: "MAArE", img: "/maree.jpg", category: "grafico" },
    { slug: "bosque", title: "Residencial Bosque das Flores", img: "/bosque.jpg", category: "grafico" },
    { slug: "natoo", title: "Natoo Care", img: "/natoo.jpg", category: "grafico" },
    { slug: "break", title: "Break Travel Lounge", img: "/break.jpg", category: "grafico" },
    { slug: "volvo", title: "Célula Ativa", img: "/volvo.jpg", category: "grafico" },
    { slug: "panthera", title: "Panthera", img: "/pantera.jpg", category: "grafico" },
    { slug: "alameda", title: "Alameda Casa Rosa", img: "/alameda.jpg", category: "grafico" },
    { slug: "aragua", title: "Aragua", img: "/aragua.jpg", category: "grafico" },
    // Produto
    { slug: "nuage", title: "Nuage", img: "/detalheNuage3.jpg", category: "produto" },
    { slug: "oko", title: "Oko", img: "/oko.jpg", category: "produto" },
    { slug: "kraft", title: "Kraft", img: "/kraft.jpeg", category: "produto" },
    { slug: "jam", title: "Jam", img: "/jam.jpg", category: "produto" },
    { slug: "olimpikus", title: "Olimpikus", img: "/olimpik.jpg", category: "produto" },
    { slug: "mandarim", title: "Poltrona Mandarim", img: "/mandarim.jpg", category: "produto" },
];

export default function Projetos() {
    const params = useParams();
    const lang = params?.lang || "pt";
    const [filtro, setFiltro] = useState("todos");

    const tags = filterTags[lang] || filterTags.pt;

    const projetosFiltrados = filtro === "todos"
        ? todosOsProjetos
        : todosOsProjetos.filter((p) => p.category === filtro || (p.tags && p.tags.includes(filtro)));

    return (
        <section className="grow flex flex-col w-full min-h-[60vh]">

            {/* Filter Tags */}
            <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-0 pb-10">
                <div className="flex gap-x-10 px-8 lg:px-30 whitespace-nowrap w-full">
                    {tags.map((tag) => (
                        <button
                            key={tag.value}
                            onClick={() => setFiltro(tag.value)}
                            className="relative text-base font-sans cursor-pointer"
                        >
                            {/* Hidden bold text reserves the wider width — prevents layout shift on hover */}
                            <span aria-hidden="true" className="block invisible font-semibold leading-none">{tag.label}</span>
                            {/* Visible text sits on top */}
                            <span className={`absolute inset-0 flex items-center transition-all duration-150 ${
                                filtro === tag.value
                                    ? "text-brand font-semibold"
                                    : "text-text-gray hover:font-semibold"
                            }`}>{tag.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 w-full px-8 lg:px-30">
                {projetosFiltrados.map((projeto) => (
                    <ProjectCard
                        key={`${projeto.category}-${projeto.slug}`}
                        title={projeto.title}
                        img={projeto.img}
                        href={`/${lang}/${projeto.category}/${projeto.slug}`}
                    />
                ))}
            </div>

        </section>
    );
}
