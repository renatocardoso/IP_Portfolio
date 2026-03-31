"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";

function IconBurger() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 18L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 6L20 6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconClose() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default function Header() {
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "pt";
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => pathname === path || pathname.startsWith(path + "/");

    // Always force full reload on logo click — resets animation state
    const handleLogoClick = (e) => {
        e.preventDefault();
        window.location.href = `/${lang}`;
    };

    const NavLinks = ({ onClick }) => (
        <>
            <Link
                href={`/${lang}/sobre`}
                onClick={onClick}
                className="group font-sans font-normal tracking-wide whitespace-nowrap flex items-center uppercase"
            >
                {/* Asterisk: red on active page, dark+hover-red on inactive */}
                <span
                    style={{ color: isActive(`/${lang}/sobre`) ? 'var(--color-brand)' : undefined }}
                    className={`mr-2 transition-colors duration-300 ${isActive(`/${lang}/sobre`) ? '' : 'text-text-dark group-hover:text-brand'}`}
                >*</span>
                <span className="text-text-dark group-hover:text-brand transition-colors duration-300">
                    {lang === "en" ? "ABOUT" : "SOBRE"}
                </span>
            </Link>
            <Link
                href={`/${lang}/projetos`}
                onClick={onClick}
                className="group font-sans font-normal tracking-wide whitespace-nowrap flex items-center uppercase"
            >
                <span
                    style={{ color: isActive(`/${lang}/projetos`) ? 'var(--color-brand)' : undefined }}
                    className={`mr-2 transition-colors duration-300 ${isActive(`/${lang}/projetos`) ? '' : 'text-text-dark group-hover:text-brand'}`}
                >*</span>
                <span className="text-text-dark group-hover:text-brand transition-colors duration-300">
                    {lang === "en" ? "PROJECTS" : "PROJETOS"}
                </span>
            </Link>
            <LanguageToggle />
        </>
    );

    return (
        <header className="w-full bg-white z-50 pt-10 pb-8 md:pb-10">

            <div className="relative w-full px-8 lg:px-30 flex items-center justify-between gap-x-8">

                {/* Logo */}
                <Link
                    href={`/${lang}`}
                    onClick={handleLogoClick}
                    className="group font-sans font-normal text-2xl lg:text-4xl whitespace-nowrap"
                >
                    <span className="text-text-dark group-hover:text-text-light transition-colors duration-300">/<span className="text-brand">*</span>{" Infinita Poesia"}</span>
                </Link>

                {/* Desktop nav — max-lg:hidden lg:flex usa ranges exclusivos, sem conflito de CSS order */}
                <nav className="max-lg:hidden lg:flex items-center gap-8 font-sans">
                    <NavLinks />
                </nav>

                {/* Burger — abaixo de lg */}
                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="lg:hidden p-2 text-text-dark hover:text-brand transition-colors duration-300"
                    aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                >
                    {mobileOpen ? <IconClose /> : <IconBurger />}
                </button>

                {/* Mobile dropdown — right-aligned, animated */}
                <nav
                    className={`lg:hidden absolute top-full right-8 mt-2 flex flex-col gap-6 px-6 py-6 bg-white border border-[--color-text-light]/30 font-sans z-50 transition-[opacity,transform] duration-200 ease-out ${
                        mobileOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                >
                    <NavLinks onClick={() => setMobileOpen(false)} />
                </nav>

            </div>

        </header>
    );
}
