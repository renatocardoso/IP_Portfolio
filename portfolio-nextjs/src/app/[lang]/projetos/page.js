"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { filterTags } from "@/data/siteData";
import ProjectCard from "@/components/ui/ProjectCard";
import TagFilter from "@/components/ui/TagFilter";

import { projetosData as graficoProjetos } from "@/data/graficoData";
import { projetosData as produtoProjetos } from "@/data/produtoData";

const todosOsProjetosData = [...graficoProjetos, ...produtoProjetos];

const ordemSlugs = [
    // --- 18 PROJETOS COM ORDEM ESTABELECIDA ---
    "sereno", "pat-tropas", "oko", "pan", "matriz", "nuage", "jam", "pat-planalto-sul", "rizzon",
    "rendase", "mandarim", "zimbros", "zazen", "kraft", "dra-char", "ilc", "iconic", "outrora",

    // --- RESTANTE DOS PROJETOS (ORDEM MISTURADA) ---
    "sonora", "inga", "moon", "space", "jovem-cidadao", "cine", "avantime", "mexilhao", "acqua",
    "abeevita", "mandala", "pat-campanha", "olimpikus", "rewire", "simple", "praia", "guapi",
    "sj", "break", "volvo", "panthera", "alameda"
];

const todosOsProjetos = ordemSlugs
    .map((slug) => {
        const p = todosOsProjetosData.find((proj) => proj.slug === slug);
        if (!p) return null;
        return {
            slug: p.slug,
            title: p.title,
            img: p.thumbnail,
            category: p.category,
            tags: p.tags
        };
    })
    .filter(Boolean);


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

            <TagFilter tags={tags} value={filtro} onChange={setFiltro} />

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 w-full lg:px-30">
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
