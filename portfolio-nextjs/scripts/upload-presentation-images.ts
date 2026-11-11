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

const farfalleFiles = [
    "public/projetos-upload/farfalle/selecao/faralle1.jpg",
    "public/projetos-upload/farfalle/selecao/faralle2.jpg",
    "public/projetos-upload/farfalle/selecao/faralle3.jpg",
    "public/projetos-upload/farfalle/selecao/farfalle4.jpg",
    "public/projetos-upload/farfalle/selecao/faralle5.jpg",
    "public/projetos-upload/farfalle/selecao/faralle6.jpg",
    "public/projetos-upload/farfalle/selecao/farfalle7.jpg",
    "public/projetos-upload/farfalle/selecao/faralle8.jpg",
];

const hyggeFiles = [
    "public/projetos-upload/hygge/hygge1.png",
    "public/projetos-upload/hygge/hygge2.png",
    "public/projetos-upload/hygge/hygge3.png",
    "public/projetos-upload/hygge/hygge4.png",
    "public/projetos-upload/hygge/hygge5.jpg",
    "public/projetos-upload/hygge/hygge6.png",
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

async function uploadGroup(label: string, relPaths: string[]) {
    console.log(`\n🚀 Iniciando upload das imagens de ${label} para UploadThing...\n`);
    const uploadedResults: { fileName: string; url: string; key: string }[] = [];

    for (const relPath of relPaths) {
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

    return uploadedResults;
}

async function main() {
    const farfalleUploaded = await uploadGroup("Farfalle", farfalleFiles);
    const hyggeUploaded = await uploadGroup("Hygge", hyggeFiles);

    const projectsDataPath = path.join(process.cwd(), "src", "data", "projects-data.json");
    const rawData = fs.readFileSync(projectsDataPath, "utf-8");
    const projects = JSON.parse(rawData);

    const farfalleGallery = farfalleUploaded.map((item) => ({
        type: "image",
        src: item.url,
    }));

    const hyggeGallery = hyggeUploaded.map((item) => ({
        type: "image",
        src: item.url,
    }));

    // Update or create farfalle project
    let farfalleProj = projects.find((p: any) => p.slug === "farfalle" || p.slug === "farfale");
    if (farfalleProj) {
        farfalleProj.slug = "farfalle";
        farfalleProj.title = "Farfalle";
        farfalleProj.title_en = "Farfalle";
        farfalleProj.year = "2027";
        farfalleProj.thumbnail = farfalleUploaded[0].url;
        farfalleProj.gallery = farfalleGallery;
    } else {
        projects.unshift({
            slug: "farfalle",
            title: "Farfalle",
            title_en: "Farfalle",
            desc_pt: "",
            desc_en: "",
            client: "Conceito",
            year: "2027",
            category: "produto",
            tags: ["produto"],
            thumbnail: farfalleUploaded[0].url,
            gallery: farfalleGallery,
        });
    }

    // Update or create hygge project
    let hyggeProj = projects.find((p: any) => p.slug === "hygge");
    if (hyggeProj) {
        hyggeProj.title = "Hygge";
        hyggeProj.title_en = "Hygge";
        hyggeProj.year = "2027";
        hyggeProj.thumbnail = hyggeUploaded[0].url;
        hyggeProj.gallery = hyggeGallery;
    } else {
        projects.push({
            slug: "hygge",
            title: "Hygge",
            title_en: "Hygge",
            desc_pt: "A palavra pode ser estranha, mas seu significado é muito familiar: é o que sentimos quando estamos aconchegados no sofá ao lado de quem amamos, é o calor do sol numa manhã de outono, é o café quente, o bolo fresquinho, a alegria descontraída de um jantar com os amigos.\n\nÉ, basicamente, uma sensação de conforto, união e bem-estar.",
            desc_en: "",
            client: "Conceito",
            year: "2027",
            category: "produto",
            tags: ["produto"],
            thumbnail: hyggeUploaded[0].url,
            gallery: hyggeGallery,
        });
    }

    fs.writeFileSync(projectsDataPath, JSON.stringify(projects, null, 2), "utf-8");
    console.log("\n💾 projects-data.json atualizado com Farfalle e Hygge!");
}

main().catch((err) => {
    console.error("❌ Erro fatal:", err);
    process.exit(1);
});

