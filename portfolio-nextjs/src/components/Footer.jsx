"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "pt";

    return (
        <footer className="flex flex-col items-center gap-2.5 bg-white text-text-dark mt-[100px]">

            {/* LinksFooter — Figma: h-[72px] p-5, Heading/Logo Small: 24px leading-8 */}
            <div className="flex flex-col items-center justify-center p-5">
                <Link
                    href={`/${lang}`}
                    className="group font-sans font-normal text-2xl leading-8 whitespace-nowrap"
                >
                    <span className="text-text-dark group-hover:text-text-light transition-colors duration-300">/<span className="text-brand">*</span>{" Infinita Poesia"}</span>
                </Link>
            </div>

            {/* Email — Figma: Body/Texto 16px leading-5 weight 400 */}
            <div className="flex flex-col items-center gap-2.5">
                <a
                    href="mailto:hello@infinitapoesia.com.br"
                    className="text-base leading-5 font-sans font-normal text-text-dark hover:text-text-light transition-colors duration-300"
                >
                    hello@infinitapoesia.com.br
                </a>
            </div>

            {/* Copyright — Figma: 14px leading-4.5 tracking-[0.119px] py-10 */}
            <div className="py-10">
                <p className="text-sm leading-4.5 tracking-[0.119px] font-sans font-normal text-text-dark text-center">
                    {`© Infinita Poesia  ${new Date().getFullYear()}`}
                </p>
            </div>

        </footer>
    );
}
