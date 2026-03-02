"use client";

export default function Footer() {
    return (
        <footer className="text-center py-16 px-5 bg-white text-sm text-[#333] leading-relaxed">
            <p className="my-2">
                <strong>© infinita poesia /*</strong>
                <br />
                Florianópolis - Santa Catarina - Brasil <br />
            </p>
            <div className="flex justify-center gap-8 mt-4">
                <a
                    href="https://www.instagram.com/infinita_poesia_design"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-[#b0b0b0] py-2 px-4 transition-colors duration-300"
                >
                    Instagram
                </a>
                <a
                    href="mailto:renato@infinitapoesia.com.br"
                    className="font-medium hover:text-[#b0b0b0] py-2 px-4 transition-colors duration-300"
                >
                    Contato
                </a>
            </div>
            <button
                type="button"
                className="mt-8 p-4 w-[50px] h-[50px] inline-flex justify-center items-center bg-transparent border-none font-sans font-semibold text-base text-[#333] cursor-pointer hover:text-[#FF4E50] transition-colors duration-300"
                aria-label="Voltar ao topo"
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            >
                &#8593;
            </button>
        </footer>
    );
}
