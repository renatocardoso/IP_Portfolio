"use client";

import { usePathname } from "next/navigation";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";

export default function PageLayoutWrapper({ children }) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <>
            {!isHome && <FloatingMenu />}
            <main className="flex-grow">{children}</main>
            {!isHome && <Footer />}
        </>
    );
}
