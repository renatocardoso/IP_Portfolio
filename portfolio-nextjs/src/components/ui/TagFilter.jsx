"use client";

/**
 * TagFilter — Design System Component
 * Todos os breakpoints: flex-wrap (quebra em múltiplas linhas)
 *
 * Props:
 *   tags    — [{ value: string, label: string }]
 *   value   — string (tag selecionada)
 *   onChange — (value: string) => void
 */
export default function TagFilter({ tags = [], value, onChange }) {
    return (
        <div className="w-full pb-10">
            <div className="flex flex-wrap gap-x-10 gap-y-3 px-8 lg:px-30">
                {tags.map((tag) => (
                    <button
                        key={tag.value}
                        onClick={() => onChange(tag.value)}
                        className="relative text-base font-sans cursor-pointer shrink-0 md:shrink"
                    >
                        {/* Reserva largura do estado bold — evita layout shift */}
                        <span aria-hidden="true" className="block invisible font-semibold leading-none whitespace-nowrap">
                            {tag.label}
                        </span>
                        {/* Texto visível posicionado sobre o reserva */}
                        <span className={`absolute inset-0 flex items-center whitespace-nowrap transition-all duration-150 ${
                            value === tag.value
                                ? "text-brand font-semibold"
                                : "text-text-gray hover:font-semibold"
                        }`}>
                            {tag.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
