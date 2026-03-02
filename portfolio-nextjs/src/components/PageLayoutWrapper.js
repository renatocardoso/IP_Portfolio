"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PageLayoutWrapper({ children }) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <>
            {!isHome && <Header />}
            <main className="flex-grow">{children}</main>
            {!isHome && <Footer />}
        </>
    );
}
