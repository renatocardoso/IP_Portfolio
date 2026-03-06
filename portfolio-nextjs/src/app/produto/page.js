import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
    title: "Infinita Poesia | Design Produto",
};

const projetosProduto = [
    { slug: "nuage", title: "Nuage", img: "/detalheNuage3.jpg" },
    { slug: "oko", title: "Oko", img: "/oko.jpg" },
    { slug: "kraft", title: "Kraft", img: "/kraft.jpeg" },
    { slug: "jam", title: "Jam", img: "/jam.jpg" },
    { slug: "olimpikus", title: "Olimpikus", img: "/olimpik.jpg" },
    { slug: "mandarim", title: "Poltrona Mandarim", img: "/mandarim.jpg" },
];

export default function Produto() {
    return (
        <section className="flex-grow flex items-start w-full min-h-[60vh] py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full max-w-[1400px] px-8 relative mx-auto">
                {projetosProduto.map((projeto) => (
                    <Link key={projeto.slug} href={`/produto/${projeto.slug}`}>
                        <Card className="group overflow-hidden border-none shadow-none bg-transparent cursor-pointer rounded-none h-full">
                            <CardContent className="p-0 relative aspect-video">
                                {/* Imagem de topo que desaparece no hover (Desktop) */}
                                <div className="absolute inset-0 transition-opacity duration-500 ease-in md:group-hover:opacity-0 z-20">
                                    <Image
                                        src={projeto.img}
                                        alt={projeto.title}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                                {/* O texto da obra que fica sempre atrás esperando a imagem sumir */}
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
                                    <h2 className="m-0 text-lg sm:text-xl font-normal text-[#333] text-center px-4 font-fira tracking-wide uppercase">{projeto.title}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
