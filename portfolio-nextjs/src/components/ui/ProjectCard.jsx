import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ title, img, href }) {
    return (
        <Link href={href} className="group block relative aspect-video overflow-hidden bg-white cursor-pointer">
            <div className="absolute inset-0 z-10">
                <Image
                    src={img}
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover"
                />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white p-6 opacity-0 transition-opacity duration-500 ease-in md:group-hover:opacity-100">
                <h2 className="text-xl font-normal text-text-dark text-center font-sans leading-[1.6]">
                    {title}
                </h2>
            </div>
        </Link>
    );
}
