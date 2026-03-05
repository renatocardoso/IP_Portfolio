"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const getLinkClass = (path) => {
        const isActive = pathname === path || pathname.startsWith(path + "/");
        return `text-[0.75rem] sm:text-[0.85rem] font-normal tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] whitespace-nowrap flex items-center uppercase ${isActive ? "text-[#FF4E50]" : "text-[#555]"
            }`;
    };

    return (
        // Changed from fixed to static block so it naturally pushes the content down.
        // Added pt-12 to ensure it breathes at the top of the page.
        <header className="w-full bg-white z-50 pt-12 pb-8 md:pb-12">
            {/* Desktop and Mobile Container */}
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-6">

                {/* Logo Area */}
                <Link href="/" className="flex items-center text-2xl font-fira font-normal text-[#333] transition-colors hover:text-[#b0b0b0] whitespace-nowrap">
                    <span className="text-[#333] mr-1">/</span>
                    <span className="text-[#FF4E50] mr-2">*</span>
                    infinita poesia
                </Link>

                {/* Navigation Links */}
                <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-sans">
                    <Link href="/grafico" className={getLinkClass("/grafico")}>
                        <span className="text-[#FF4E50] mr-2 text-sm">*</span>
                        DESIGN GRÁFICO
                    </Link>
                    <Link href="/produto" className={getLinkClass("/produto")}>
                        <span className="text-[#FF4E50] mr-2 text-sm">*</span>
                        DESIGN PRODUTO
                    </Link>
                    <Link href="/sobre" className={getLinkClass("/sobre")}>
                        <span className="text-[#FF4E50] mr-2 text-sm">*</span>
                        SOBRE
                    </Link>
                </nav>

            </div>
        </header>
    );
}
