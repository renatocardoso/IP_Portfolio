"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const getLinkClass = (path) => {
        const isActive = pathname === path || pathname.startsWith(path + "/");
        return `text-[0.75rem] sm:text-[0.85rem] font-normal tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] whitespace-nowrap flex items-center ${isActive ? "text-[#FF4E50]" : "text-[#555]"
            }`;
    };

    return (
        // Changed from fixed to static block so it naturally pushes the content down.
        // Added pt-12 to ensure it breathes at the top of the page.
        <header className="w-full bg-white z-50 pt-12 pb-8 md:pb-12">
            {/* Desktop and Mobile Container */}
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center">

                {/* Logo Area */}
                <Link href="/" className="flex items-center text-xl sm:text-lg lg:text-xl font-bold text-[#333] transition-colors hover:text-[#b0b0b0] whitespace-nowrap md:mr-6 mb-4 md:mb-0">
                    <span className="text-[#333] mr-1 md:hidden">/</span>
                    <span className="text-[#FF4E50] mr-2 md:hidden">*</span>
                    infinita poesia
                    <span className="ml-2 hidden md:inline">/</span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 font-sans">
                    <Link href="/grafico" className={getLinkClass("/grafico")}>
                        * DESIGN GRÁFICO
                    </Link>
                    <Link href="/produto" className={getLinkClass("/produto")}>
                        * DESIGN PRODUTO
                    </Link>
                    <Link href="/sobre" className={getLinkClass("/sobre")}>
                        * SOBRE
                    </Link>
                </nav>

            </div>
        </header>
    );
}
