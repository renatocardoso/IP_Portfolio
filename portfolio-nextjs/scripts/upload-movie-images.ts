import { UTApi } from "uploadthing/server";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;

if (!token) {
    console.error("❌ Erro: UPLOADTHING_TOKEN não encontrado no .env.local");
    process.exit(1);
}

const utapi = new UTApi({ token });

const filesToUpload = [
    "public/MoviePoltrona.png",
    "public/desmontada_.jpg",
    "public/movieCena.png",
    "public/printMovie.png",
    "public/MovieParts.jpg",
    "public/MoviePoltrona2_.png",
];

function getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
        case ".png":
            return "image/png";
        case ".webp":
            return "image/webp";
        case ".jpeg":
        case ".jpg":
        default:
            return "image/jpeg";
    }
}

async function uploadMovieImages() {
    console.log("🚀 Iniciando upload das imagens do Movie para UploadThing...\n");

    const uploadedResults: { fileName: string; url: string; key: string }[] = [];

    for (const relPath of filesToUpload) {
        const fullPath = path.join(process.cwd(), relPath);
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ Arquivo não encontrado: ${fullPath}`);
            process.exit(1);
        }

        const fileName = path.basename(fullPath);
        const buffer = fs.readFileSync(fullPath);
        const mimeType = getMimeType(fileName);
        const file = new File([buffer], fileName, { type: mimeType });

        console.log(`⏳ Enviando ${fileName} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)...`);

        const res = await utapi.uploadFiles(file);
        const uploadResult = Array.isArray(res) ? res[0] : res;

        if (uploadResult?.data) {
            const data = uploadResult.data;
            const url = data.ufsUrl || data.url || `https://utfs.io/f/${data.key}`;
            console.log(`✅ Sucesso: ${fileName} -> ${url}`);
            uploadedResults.push({
                fileName,
                url,
                key: data.key,
            });
        } else {
            console.error(`❌ Falha no upload de ${fileName}:`, uploadResult?.error);
            process.exit(1);
        }
    }

    console.log("\n📋 Resultados dos uploads:");
    console.log(JSON.stringify(uploadedResults, null, 2));

    // Atualizar src/data/projects-data.json
    const projectsDataPath = path.join(process.cwd(), "src", "data", "projects-data.json");
    const rawData = fs.readFileSync(projectsDataPath, "utf-8");
    const projects = JSON.parse(rawData);

    const movieProject = projects.find((p: any) => p.slug === "movie");
    if (!movieProject) {
        console.error("❌ Projeto movie não encontrado no projects-data.json");
        process.exit(1);
    }

    console.log("\n🖼️ Galeria anterior do Movie:", movieProject.gallery.length, "itens");

    // Manter a imagem 8 (índice 7) e remover de 1 a 7 (índices 0 a 6)
    const remainingImage = movieProject.gallery[7]; // 8ª imagem original

    const newGalleryItems = uploadedResults.map((item) => ({
        type: "image",
        src: item.url,
    }));

    if (remainingImage) {
        newGalleryItems.push(remainingImage);
    }

    movieProject.gallery = newGalleryItems;

    fs.writeFileSync(projectsDataPath, JSON.stringify(projects, null, 2), "utf-8");
    console.log("💾 projects-data.json atualizado com sucesso! Nova galeria do Movie:", movieProject.gallery.length, "itens");
}

uploadMovieImages().catch((err) => {
    console.error("❌ Erro fatal:", err);
    process.exit(1);
});
