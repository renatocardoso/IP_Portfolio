"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageToggle() {
    const pathname = usePathname();
    const currentLang = pathname.split("/")[1] || "pt";
    const otherLang = currentLang === "pt" ? "en" : "pt";
    const newPath = "/" + otherLang + pathname.slice(currentLang.length + 1);

    return (
        <Link
            href={newPath}
            className="text-[0.75rem] uppercase tracking-wide font-sans transition-all duration-150 text-text-dark hover:font-semibold"
        >
            {otherLang}
        </Link>
    );
}
