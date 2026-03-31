"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { filterTags } from "@/data/siteData";
import ProjectCard from "@/components/ui/ProjectCard";

const todosOsProjetos = [
    // Gráfico
    { slug: "pan", title: "Plano de Ação Nacional para Conservação de Espécies Ameaçadas de Extinção", img: "https://utfs.io/f/047OTbUFRaz7qFRzkhpQYVuvH9R2MEta3qoSm8Bzg1xbFJ56", category: "grafico" },
    { slug: "matriz", title: "Matriz da Biodiversidade", img: "https://utfs.io/f/047OTbUFRaz7COwze5SvMrayNJYT9CV7UzBnWgt0RkFZp1P4", category: "grafico" },
    { slug: "pat-tropas", title: "Plano de Ação Territorial Caminho das Tropas PR - SP", img: "https://utfs.io/f/047OTbUFRaz7PTRPZzJjjzGXw7Do8lIs1Cr5m6fhJbFSBKk3", category: "grafico" },
    { slug: "pat-planalto-sul", title: "Plano de Ação Territorial Planalto Sul", img: "https://utfs.io/f/047OTbUFRaz7uGYK1mzwjF7GOsuvIRypc2TdB3EY5M0PAf8g", category: "grafico" },
    { slug: "zimbros", title: "Parque Natural Municipal de Zimbros", img: "https://utfs.io/f/047OTbUFRaz75dbyYinQHPs2FRjySlnmwEXMTJcuNQp1D8Kq", category: "grafico" },
    { slug: "rizzon", title: "Rizzon", img: "https://utfs.io/f/047OTbUFRaz7WPYUfOIBGVeIToJiAt53FCzgjmQnybO0UqRH", category: "grafico" },
    { slug: "inga", title: "INGA", img: "https://utfs.io/f/047OTbUFRaz7EV1NgTYdhvLqiRcn4ostubf2jQwJKOSr7ACF", category: "grafico" },
    { slug: "pan-hb", title: "Plano de Ação Nacional Hileia Baiana", img: "https://utfs.io/f/047OTbUFRaz7yEfQQjIPSdrLogis8aAHvYnZDPQcqThXIeER", category: "grafico" },
    { slug: "jovem-cidadao", title: "Jovem Cidadão", img: "https://utfs.io/f/047OTbUFRaz7sZw7SFRrt68MwRc5lNvYTkem1GV0hDSbsdAF", category: "grafico" },
    { slug: "dra-ana", title: "Dra. Ana Gelatti", img: "https://utfs.io/f/047OTbUFRaz74H0rCZYd1AGYfEpSq3P5VBUlFwemoWuvL2x0", category: "grafico" },
    { slug: "mexilhao", title: "Projeto Mexilhão-Dourado no Alto Rio Uruguai", img: "https://utfs.io/f/047OTbUFRaz7K7nGJbqeiax41Jgf9kWy5wsLXTcmG7zvF8Bl", category: "grafico" },
    { slug: "abeevita", title: "Abeevita", img: "https://utfs.io/f/047OTbUFRaz7e11T6zN5bSlRH2oJsrVNA31q5kjEYMZe0BXh", category: "grafico" },
    { slug: "pat-campanha", title: "Plano de Ação Territorial Campanha Sul e Serra do Sudeste", img: "https://utfs.io/f/047OTbUFRaz7pNBKPYexRPd3X9qjgWuUm4tBsCDa0kJ7ylMz", category: "grafico" },
    { slug: "dra-char", title: "Dra. Char", img: "https://utfs.io/f/047OTbUFRaz7fuaxeq8YCHlcTWUoy1v0ghdpkMVqetXRO2mr", category: "grafico" },
    { slug: "rewire", title: "Rewire", img: "https://utfs.io/f/047OTbUFRaz7t6DIEzbmIavPzqHtrsRbjonNd24xXTh5CA9O", category: "grafico" },
    { slug: "rendase", title: "Renda-se", img: "https://utfs.io/f/047OTbUFRaz72UVYvNRgM4dpfw5cuxBLqQtEyP7zkFv0GgHa", category: "grafico" },
    { slug: "simple", title: "Simple on the beach", img: "https://utfs.io/f/047OTbUFRaz7DII7mc3a9mVHGFRd76bOLIoyZgtWQxJMfzeq", category: "grafico" },
    { slug: "outrora", title: "Outrora Formosa", img: "https://utfs.io/f/047OTbUFRaz72F3ceWgM4dpfw5cuxBLqQtEyP7zkFv0GgHa2", category: "grafico" },
    { slug: "ilc", title: "Hotel Il Campanario", img: "https://utfs.io/f/047OTbUFRaz7S7RUs9xLagkEYQucWCXVx3fwGml1MitZB9qO", category: "grafico" },
    { slug: "praia", title: "PRAIA", img: "https://utfs.io/f/047OTbUFRaz7reYo62MsISKEpcja2DCQOu7gTn16z50XNdMh", category: "grafico" },
    { slug: "guapi", title: "Trilha ecológica da Área de Proteção Ambiental de Guapimirim - RJ", img: "https://utfs.io/f/047OTbUFRaz7pyUTPLexRPd3X9qjgWuUm4tBsCDa0kJ7ylMz", category: "grafico" },
    { slug: "sj", title: "São João Doces e Salgados", img: "https://utfs.io/f/047OTbUFRaz77q2LgayHwYbWrOiN8yCn2gUS5Fc3q4VTjhu6", category: "grafico" },
    { slug: "info", title: "MAArE", img: "https://utfs.io/f/047OTbUFRaz71SJQx2WddMwjLVHNxPflFCZrvQyRu2XJETBe", category: "grafico" },
    { slug: "bosque", title: "Residencial Bosque das Flores", img: "https://utfs.io/f/047OTbUFRaz7R8H4zmKGFgOZuP5fARs492Nj8WtL1XCc7MkH", category: "grafico" },
    { slug: "natoo", title: "Natoo Care", img: "https://utfs.io/f/047OTbUFRaz7gkABW40RIf9yMJhTVPzX86FevaE7UrlA1oqd", category: "grafico" },
    { slug: "break", title: "Break Travel Lounge", img: "https://utfs.io/f/047OTbUFRaz7ruwWjyUMsISKEpcja2DCQOu7gTn16z50XNdM", category: "grafico" },
    { slug: "volvo", title: "Célula Ativa", img: "https://utfs.io/f/047OTbUFRaz77Wx6ImHwYbWrOiN8yCn2gUS5Fc3q4VTjhu6B", category: "grafico" },
    { slug: "panthera", title: "Panthera", img: "https://utfs.io/f/047OTbUFRaz7PTu1GO8jjzGXw7Do8lIs1Cr5m6fhJbFSBKk3", category: "grafico" },
    { slug: "alameda", title: "Alameda Casa Rosa", img: "https://utfs.io/f/047OTbUFRaz76sW2ynHv1JwbRAfjau8DHoFCMlSz4dVnTLKU", category: "grafico" },
    { slug: "aragua", title: "Aragua", img: "https://utfs.io/f/047OTbUFRaz7vX7nsFknUgH4xqT9Sjck6t1pKRso7aeWhJfi", category: "grafico" },
    // Produto
    { slug: "nuage", title: "Nuage", img: "https://utfs.io/f/047OTbUFRaz7UCTa7EoxL96kWlPOEZnVivRFpuo4mhNGcTYb", category: "produto" },
    { slug: "oko", title: "Oko", img: "https://utfs.io/f/047OTbUFRaz700w6vEUFRaz7ojmHIOPSXUkt8QMrec156su3", category: "produto" },
    { slug: "kraft", title: "Kraft", img: "https://utfs.io/f/047OTbUFRaz7qSjsVypQYVuvH9R2MEta3qoSm8Bzg1xbFJ56", category: "produto" },
    { slug: "jam", title: "Jam", img: "https://utfs.io/f/047OTbUFRaz7MN4IB7ZFZf0VqWm8jut9gQBr5nkscDIzP4NY", category: "produto" },
    { slug: "olimpikus", title: "Olimpikus", img: "https://utfs.io/f/047OTbUFRaz7Ked01Xmqeiax41Jgf9kWy5wsLXTcmG7zvF8B", category: "produto" },
    { slug: "mandarim", title: "Poltrona Mandarim", img: "https://utfs.io/f/047OTbUFRaz7pQbbKFmexRPd3X9qjgWuUm4tBsCDa0kJ7ylM", category: "produto" },
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
