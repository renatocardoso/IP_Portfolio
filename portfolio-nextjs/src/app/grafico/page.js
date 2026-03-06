import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

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
        <section className="flex-grow flex items-start w-full min-h-[60vh] py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full max-w-[1400px] px-8 relative mx-auto">
                {projetosGrafico.map((projeto) => (
                    <Link key={projeto.slug} href={`/grafico/${projeto.slug}`}>
                        <Card className="group overflow-hidden border-none shadow-none bg-transparent cursor-pointer rounded-none h-full">
                            <CardContent className="p-0 relative aspect-video">
                                <div className="absolute inset-0 transition-opacity duration-500 ease-in md:group-hover:opacity-0 z-20">
                                    <Image
                                        src={projeto.img}
                                        alt={projeto.title}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 p-6">
                                    <h2 className="m-0 text-base sm:text-lg font-normal text-[#333] text-center font-fira tracking-wide uppercase leading-tight">{projeto.title}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
