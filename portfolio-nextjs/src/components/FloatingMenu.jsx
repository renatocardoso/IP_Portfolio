"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const constraintsRef = useRef(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const toggleMenu = () => setIsOpen(!isOpen);

    // Positions based on the user's radial sketch
    // Asterisk is very large (approx 150-200px bounding box). 
    // We radiate items outwards from the core.
    const menuItems = [
        {
            label: "* Sobre",
            href: "/sobre",
            // Pointing straight up
            rotate: -90,
            x: 0,
            y: -140
        },
        {
            label: "* Design Gráfico",
            href: "/grafico",
            // Pointing Top-Right
            rotate: -20,
            x: 160,
            y: -60
        },
        {
            label: "* Design de Produto",
            href: "/produto",
            // Pointing Bottom-Right
            rotate: 55,
            x: 140,
            y: 120
        },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" ref={constraintsRef}>
            {/* The draggable container */}
            <motion.div
                className="absolute top-1/3 left-1/3 pointer-events-auto"
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                dragMomentum={false} // Disable momentum so it stays exactly where dropped
                style={{ touchAction: "none" }} // Important for mobile dropping
            >
                <div className="relative flex items-center justify-center w-32 h-32">

                    {/* The Expanding Menu Options */}
                    <AnimatePresence>
                        {isOpen && menuItems.map((item, i) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: item.rotate }}
                                    animate={{ opacity: 1, scale: 1, x: item.x, y: item.y, rotate: item.rotate }}
                                    exit={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: item.rotate }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: i * 0.05
                                    }}
                                    className="absolute whitespace-nowrap"
                                    style={{
                                        // Transforms happen from the left center of the text outward
                                        transformOrigin: "left center"
                                    }}
                                >
                                    <Link
                                        href={item.href}
                                        /* Removed pointer-events-none on drag container, so children links are clickable */
                                        className={`text-2xl md:text-3xl font-medium tracking-wide transition-colors duration-300 hover:text-[#b0b0b0] ${isActive ? "text-[#FF4E50]" : "text-[#333]"}`}
                                        onClick={(e) => {
                                            // Optional: Stop propagation ensures drag doesnt trigger, 
                                            // but next/link handles routing cleanly anyway.
                                            setIsOpen(false);
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* The Core Asterisk Button */}
                    <motion.button
                        onClick={toggleMenu}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-[180px] leading-none font-bold text-black flex items-center justify-center cursor-grab active:cursor-grabbing z-10 select-none"
                        style={{ fontFamily: "var(--font-fira)" }}
                    >
                        *
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
