"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { productFilterTags } from "@/data/tags";
import ProjectCard from "@/components/ui/ProjectCard";
import TagFilter from "@/components/ui/TagFilter";
import { projetosData as produtoProjetos } from "@/data/produtoData";

export default function ProdutoPage() {
    const params = useParams();
    const lang = params?.lang || "pt";
    const [filtro, setFiltro] = useState("todos");

    const tags = productFilterTags[lang] || productFilterTags.pt;

    const projetosFiltrados = filtro === "todos"
        ? produtoProjetos
        : produtoProjetos.filter((p) => p.tags && p.tags.includes(filtro));

    return (
        <section className="grow flex flex-col w-full min-h-[60vh]">
            <TagFilter tags={tags} value={filtro} onChange={setFiltro} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 w-full lg:px-30">
                {projetosFiltrados.map((projeto) => (
                    <ProjectCard
                        key={`produto-${projeto.slug}`}
                        title={lang === "en" ? (projeto.title_en || projeto.title) : projeto.title}
                        img={projeto.thumbnail}
                        href={`/${lang}/produto/${projeto.slug}`}
                    />
                ))}
            </div>
        </section>
    );
}
