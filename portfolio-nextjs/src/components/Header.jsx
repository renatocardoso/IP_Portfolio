"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="w-full fixed top-0 left-0 bg-white/90 backdrop-blur-sm z-50">
            {/* Desktop and Mobile Container */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">

                {/* Logo Area */}
                <Link href="/" className="flex items-center text-xl sm:text-2xl font-fira font-normal text-[#333] transition-colors hover:text-[#b0b0b0]">
                    <span className="text-[#333] mr-1">/</span>
                    <span className="text-[#FF4E50] mr-2">*</span>
                    <span className="tracking-wide whitespace-nowrap">
                        infinita poesia
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                    <Link
                        href="/grafico"
                        className={`text-sm sm:text-base font-normal tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] whitespace-nowrap flex items-center ${pathname === "/grafico" || pathname.startsWith("/grafico/") ? "text-[#FF4E50]" : "text-[#333]"}`}
                    >
                        <span className="text-[#FF4E50] mr-2 text-sm">*</span>
                        DESIGN GRÁFICO
                    </Link>
                    <Link
                        href="/produto"
                        className={`text-sm sm:text-base font-normal tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] whitespace-nowrap flex items-center ${pathname === "/produto" || pathname.startsWith("/produto/") ? "text-[#FF4E50]" : "text-[#333]"}`}
                    >
                        <span className="text-[#FF4E50] mr-2 text-sm">*</span>
                        DESIGN PRODUTO
                    </Link>
                    <Link
                        href="/sobre"
                        className={`text-sm sm:text-base font-normal tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] whitespace-nowrap flex items-center ${pathname === "/sobre" || pathname.startsWith("/sobre/") ? "text-[#FF4E50]" : "text-[#333]"}`}
                    >
                        <span className="text-[#FF4E50] mr-2 text-sm">*</span>
                        SOBRE
                    </Link>
                </nav>

            </div>
        </header>
    );
}
