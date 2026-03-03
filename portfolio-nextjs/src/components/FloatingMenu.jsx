"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { label: "Sobre", href: "/sobre" },
        { label: "Design Gráfico", href: "/grafico" },
        { label: "Design de Produto", href: "/produto" },
    ];

    // Determine current section name for breadcrumbs
    const currentSection = menuItems.find(item => pathname === item.href || pathname.startsWith(item.href + "/"))?.label;

    return (
        <div className="fixed top-8 left-8 z-50 pointer-events-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

                {/* Logo / Breadcrumb Button */}
                <button
                    onClick={toggleMenu}
                    className="flex items-center text-xl sm:text-2xl font-fira font-normal text-[#333] transition-colors hover:text-[#b0b0b0]"
                >
                    <span className="text-[#333] mr-1">/</span>
                    <span className="text-[#FF4E50] mr-2">*</span>

                    {/* Desktop Text */}
                    <span className="hidden md:inline mr-2 tracking-wide whitespace-nowrap">
                        infinita poesia
                    </span>

                    {/* Active Section Breadcrumb */}
                    {currentSection && (
                        <span className="hidden md:inline font-light tracking-wide whitespace-nowrap">
                            <span className="mx-2 text-[#b0b0b0]">/</span>
                            {currentSection}
                        </span>
                    )}

                    {/* Mobile: Only display breadcrumb if active, without "infinita poesia" */}
                    {currentSection && (
                        <span className="inline md:hidden font-light tracking-wide whitespace-nowrap">
                            {currentSection}
                        </span>
                    )}
                </button>

                {/* Expanding Menu Options */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20, y: -10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: -20, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col md:flex-row gap-4 mt-2 md:mt-0 md:ml-4 bg-white/80 backdrop-blur-sm p-4 md:p-0 rounded-lg md:bg-transparent md:backdrop-blur-none"
                        >
                            {menuItems.map((item, i) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className={`text-lg md:text-xl font-normal tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] whitespace-nowrap flex items-center ${isActive ? "text-[#FF4E50]" : "text-[#333]"}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-[#FF4E50] mr-2 text-base">*</span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
