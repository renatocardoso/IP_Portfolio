"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="text-center py-8 px-5 flex justify-center items-center flex-wrap gap-2">
            <Link href="/" className="font-bold text-[1.2rem] mr-2">
                infinita poesia /
            </Link>
            <Link
                href="/grafico"
                className={`text-[0.96rem] mx-2 transition-colors duration-300 hover:text-[#b0b0b0] ${pathname === "/grafico" || pathname.startsWith("/grafico/") ? "text-[#FF4E50]" : ""
                    }`}
            >
                * DESIGN GRÁFICO
            </Link>
            <Link
                href="/produto"
                className={`text-[0.96rem] mx-2 transition-colors duration-300 hover:text-[#b0b0b0] ${pathname === "/produto" || pathname.startsWith("/produto/") ? "text-[#FF4E50]" : ""
                    }`}
            >
                * DESIGN PRODUTO
            </Link>
            <Link
                href="/sobre"
                className={`text-[0.96rem] mx-2 transition-colors duration-300 hover:text-[#b0b0b0] ${pathname === "/sobre" || pathname.startsWith("/sobre/") ? "text-[#FF4E50]" : ""
                    }`}
            >
                * SOBRE
            </Link>
        </header>
    );
}
