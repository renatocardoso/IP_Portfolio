"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { graphicFilterTags } from "@/data/tags";
import ProjectCard from "@/components/ui/ProjectCard";
import TagFilter from "@/components/ui/TagFilter";
import { projetosData as graficoProjetos } from "@/data/graficoData";

export default function GraficoPage() {
    const params = useParams();
    const lang = params?.lang || "pt";
    const [filtro, setFiltro] = useState("todos");

    const tags = graphicFilterTags[lang] || graphicFilterTags.pt;

    const projetosFiltrados = filtro === "todos"
        ? graficoProjetos
        : graficoProjetos.filter((p) => p.tags && p.tags.includes(filtro));

    return (
        <section className="grow flex flex-col w-full min-h-[60vh]">
            <TagFilter tags={tags} value={filtro} onChange={setFiltro} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 w-full lg:px-30">
                {projetosFiltrados.map((projeto) => (
                    <ProjectCard
                        key={`grafico-${projeto.slug}`}
                        title={lang === "en" ? (projeto.title_en || projeto.title) : projeto.title}
                        img={projeto.thumbnail}
                        href={`/${lang}/grafico/${projeto.slug}`}
                    />
                ))}
            </div>
        </section>
    );
}
