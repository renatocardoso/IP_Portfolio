import Image from "next/image";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    return {
        title: lang === "en" ? "Infinita Poesia | About" : "Infinita Poesia | Sobre",
    };
}

export default async function Sobre({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <section className="flex-grow flex items-start w-full min-h-[60vh] py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full max-w-[1400px] px-8 relative mx-auto mb-12 md:mb-24">
                <div className="md:pr-8 order-2 md:order-1 flex flex-col gap-6">
                    <p className="text-[#4a4a4a] text-lg leading-relaxed font-serif">
                        {dict.sobre.body}
                    </p>
                </div>
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
            </div>
        </section>
    );
}
