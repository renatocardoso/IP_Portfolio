import Link from "next/link";
import Image from "next/image";

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
        <>
            <section className="flex-grow flex items-center justify-center w-full min-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 w-full relative">
                    {projetosProduto.map((projeto) => (
                        <Link
                            key={projeto.slug}
                            href={`/produto/${projeto.slug}`}
                            className="group block relative"
                        >
                            <div className="overflow-hidden transition-opacity duration-500 ease-in md:group-hover:opacity-0 w-full aspect-square md:aspect-auto">
                                <Image
                                    src={projeto.img}
                                    alt={projeto.title}
                                    width={800}
                                    height={800}
                                    unoptimized
                                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                                />
                            </div>

                            <div className="text-center w-[90%] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                              md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 ease-in
                              pointer-events-none md:z-10 mt-2 md:mt-0 mx-auto">
                                <h2 className="m-0 text-base font-normal">{projeto.title}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
