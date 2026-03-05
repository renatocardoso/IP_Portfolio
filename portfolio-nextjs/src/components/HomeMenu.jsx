"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeMenu({ isVisible }) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Let Dandelion finish, wait maybe 1s, then show this
        if (isVisible) {
            const timer = setTimeout(() => setShouldRender(true), 800);
            return () => clearTimeout(timer);
        } else {
            setShouldRender(false);
        }
    }, [isVisible]);

    const menuItems = [
        { label: "Sobre", href: "/sobre", x: -200, y: -150 },
        { label: "Design Gráfico", href: "/grafico", x: 200, y: 0 },
        { label: "Design Produto", href: "/produto", x: -80, y: 150 },
    ];

    return (
        <AnimatePresence>
            {shouldRender && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="relative flex items-center justify-center w-full h-full max-w-4xl mx-auto">

                        {/* Center Symbol `/*` */}
                        <motion.div
                            className="text-4xl md:text-6xl font-fira font-normal flex items-center justify-center select-none"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        >
                            <span className="text-[#333]">/</span>
                            <span className="text-[#FF4E50]">*</span>
                        </motion.div>

                        {/* Radial Links */}
                        {menuItems.map((item, i) => (
                            <motion.div
                                key={i}
                                className="absolute z-30"
                                initial={{ opacity: 0, x: 0, y: 0 }}
                                animate={{ opacity: 1, x: item.x, y: item.y }}
                                transition={{
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 15,
                                    delay: 0.5 + (i * 0.2)
                                }}
                            >
                                <Link
                                    href={item.href}
                                    className="text-2xl md:text-3xl font-medium tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] whitespace-nowrap text-[#333] flex items-center p-4 -m-4 cursor-pointer"
                                >
                                    <span className="text-[#FF4E50] mr-2 text-xl md:text-2xl">*</span>
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
