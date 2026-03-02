import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Infinita Poesia | Design Gráfico",
};

const projetosGrafico = [
    { slug: "pan", title: "Plano de Ação Nacional para Conservação de Espécies Ameaçadas de Extinção", img: "/pan.jpg" },
    { slug: "matriz", title: "Matriz da Biodiversidade", img: "/matriz.jpg" },
    { slug: "pat-tropas", title: "Plano de Ação Territorial Caminho das Tropas PR - SP", img: "/patCaminhoTropas.jpg" },
    { slug: "pat-planalto-sul", title: "Plano de Ação Territorial Planalto Sul", img: "/patPlanaltoSul.jpg" },
    { slug: "zimbros", title: "Parque Natural Municipal de Zimbros", img: "/Zimbros.jpg" },
    { slug: "rizzon", title: "Rizzon", img: "/rizzon.jpg" },
    { slug: "inga", title: "INGA", img: "/inga.jpg" },
    { slug: "pan-hb", title: "Plano de Ação Nacional Hileia Baiana", img: "/panHb.jpg" },
    { slug: "jovem-cidadao", title: "Jovem Cidadão", img: "/jc.jpg" },
    { slug: "dra-ana", title: "Dra. Ana Gelatti", img: "/lung.jpg" },
    { slug: "mexilhao", title: "Projeto Mexilhão-Dourado no Alto Rio Uruguai", img: "/md.jpg" },
    { slug: "abeevita", title: "Abeevita", img: "/abeevita.jpg" },
    { slug: "pat-campanha", title: "Plano de Ação Territorial Campanha Sul e Serra do Sudeste", img: "/patCanoanhaSerra.jpg" },
    { slug: "dra-char", title: "Dra. Char", img: "/draChar.jpg" },
    { slug: "rewire", title: "Rewire", img: "/rewire.jpg" },
    { slug: "rendase", title: "Renda-se", img: "/rendase.jpg" },
    { slug: "simple", title: "Simple on the beach", img: "/simple.jpg" },
    { slug: "outrora", title: "Outrora Formosa", img: "/outrora.jpg" },
    { slug: "ilc", title: "Hotel Il Campanario", img: "/ilc.jpg" },
    { slug: "praia", title: "PRAIA", img: "/praia.jpg" },
    { slug: "guapi", title: "Trilha ecológica da Área de Proteção Ambiental de Guapimirim - RJ", img: "/guapi2.jpg" },
    { slug: "sj", title: "São João Doces e Salgados", img: "/sj.jpg" },
    { slug: "info", title: "MAArE", img: "/maree.jpg" },
    { slug: "bosque", title: "Residencial Bosque das Flores", img: "/bosque.jpg" },
    { slug: "natoo", title: "Natoo Care", img: "/natoo.jpg" },
    { slug: "break", title: "Break Travel Lounge", img: "/break.jpg" },
    { slug: "volvo", title: "Célula Ativa", img: "/volvo.jpg" },
    { slug: "panthera", title: "Panthera", img: "/pantera.jpg" },
    { slug: "alameda", title: "Alameda Casa Rosa", img: "/alameda.jpg" },
    { slug: "aragua", title: "Aragua", img: "/aragua.jpg" },
];

export default function Grafico() {
    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 relative">
                {projetosGrafico.map((projeto) => (
                    <Link
                        key={projeto.slug}
                        href={`/grafico/${projeto.slug}`}
                        className="group block relative"
                    >
                        <div className="overflow-hidden transition-opacity duration-500 ease-in md:group-hover:opacity-0 w-full aspect-square md:aspect-auto">
                            {/* O `unoptimized` aqui é usado temporariamente para facilitar
                  o uso das imagens exportadas diretamente do legado, 
                  evitando os limites e complexidades do Next.js Image Optimization locais */}
                            <Image
                                src={projeto.img}
                                alt={projeto.title}
                                width={800}
                                height={800}
                                unoptimized
                                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                            />
                        </div>

                        {/* Texto hover effect. Positioned absolute em telas grandes, static no mobile */}
                        <div className="text-center w-[90%] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                            md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 ease-in
                            pointer-events-none md:z-10 mt-2 md:mt-0 mx-auto">
                            <h2 className="m-0 text-base font-normal">{projeto.title}</h2>
                        </div>
                    </Link>
                ))}
            </section>
        </>
    );
}
