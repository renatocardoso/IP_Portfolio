import Image from "next/image";

export const metadata = {
    title: "Infinita Poesia | Sobre",
};

export default function Sobre() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-24">
                {/* Texto principal - ordem 2 no mobile, 1 no desktop */}
                <div className="md:pr-8 order-2 md:order-1 flex flex-col gap-6">
                    <p className="text-[#4a4a4a] text-lg leading-relaxed">
                        Nossa prática integra estratégia criativa, pesquisa e prototipagem para moldar marcas e produtos culturalmente relevantes. Com um olhar multidisciplinar, buscamos soluções que unam relevância ética e estética, despertando o desejo pelo consumo consciente e gerando impacto duradouro. Nossos projetos transitam entre identidade visual, design editorial, web, embalagens, sinalização e design de produto.
                    </p>

                    <p className="text-[#4a4a4a] text-lg leading-relaxed italic">
                        Our practice integrates creative strategy, research, and prototyping to shape culturally relevant brands and products. With a multidisciplinary approach, we develop solutions that bridge ethical and aesthetic relevance, inspiring conscious consumption and generating a lasting impact. Our work spans visual identity, editorial design, web, packaging, wayfinding, and product design.
                    </p>
                </div>

                {/* Imagem - ordem 1 no mobile, 2 no desktop */}
                <div className="w-full aspect-[16/9] md:aspect-square order-1 md:order-2 overflow-hidden bg-gray-100">
                    <Image
                        alt="Close-up of textural details on a wall"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKg6qXiqTyd-MqWji3I6QbN8ZSpXY4uq6k2pO0CXRsrc32cLAHCnlNzVcdNDw0kK_NKZGyPkPZ7f2TXyb3WMOF46sC1wclNQtCCR8q30FVYG9GV-7IWrdzkSOiL7hkEKs6EcshuQmUNgleoAIzvQM4z3WcVOWPMNIH1Uj6u1RDAOnWNfyqlMGdZHeoP-Ngyoajti5Q9nxEFgBFSFJP0axgPb2M0yQZ-RQrOjPHcEIO-WnYZMCMYZzMz4FXL0hRZ190ReQht9YjcE0"
                        width={800}
                        height={800}
                        unoptimized
                    />
                </div>
            </section>
        </main>
    );
}
