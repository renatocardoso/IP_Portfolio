import { UTApi } from "uploadthing/server";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;

if (!token) {
    console.error("❌ Erro: Nenhuma chave UPLOADTHING_TOKEN ou UPLOADTHING_SECRET encontrada no arquivo .env.local!");
    process.exit(1);
}

// Initialize UTApi with token
const utapi = new UTApi({ token });

const UPLOAD_DIR = path.join(process.cwd(), "public", "projetos-upload");
const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "projects-data.json");

interface ProjectImageResult {
    name: string;
    url: string;
    key: string;
}

interface ProjectUploadOutput {
    projectId: string;
    images: ProjectImageResult[];
}

function getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
        case ".png":
            return "image/png";
        case ".webp":
            return "image/webp";
        case ".gif":
            return "image/gif";
        case ".svg":
            return "image/svg+xml";
        case ".jpeg":
        case ".jpg":
        default:
            return "image/jpeg";
    }
}

async function runUpload() {
    console.log("🚀 Iniciando automação de upload de projetos para UploadThing...\n");

    if (!fs.existsSync(UPLOAD_DIR)) {
        console.error(`❌ Pasta de origem não encontrada: ${UPLOAD_DIR}`);
        process.exit(1);
    }

    const items = fs.readdirSync(UPLOAD_DIR, { withFileTypes: true });
    const projectFolders = items
        .filter((item) => item.isDirectory())
        .map((item) => item.name);

    if (projectFolders.length === 0) {
        console.log("⚠️ Nenhuma pasta de projeto encontrada em ./public/projetos-upload.");
        return;
    }

    console.log(`📂 Encontrados ${projectFolders.length} projetos para processar.`);

    // Load existing output data if present to allow resuming
    let outputData: ProjectUploadOutput[] = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            const raw = fs.readFileSync(OUTPUT_FILE, "utf-8");
            outputData = JSON.parse(raw);
        } catch {
            outputData = [];
        }
    }

    for (const projectId of projectFolders) {
        const projectFolderPath = path.join(UPLOAD_DIR, projectId);
        const filesInFolder = fs.readdirSync(projectFolderPath, { withFileTypes: true });

        const imageFiles = filesInFolder
            .filter((f) => f.isFile() && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name))
            .map((f) => f.name);

        if (imageFiles.length === 0) {
            console.log(`ℹ️ [${projectId}] Nenhuma imagem encontrada. Pulando...`);
            continue;
        }

        console.log(`\n⏳ [${projectId}] Processando ${imageFiles.length} imagem(ns)...`);

        // Find or create project entry in outputData
        let projectEntry = outputData.find((p) => p.projectId === projectId);
        if (!projectEntry) {
            projectEntry = { projectId, images: [] };
            outputData.push(projectEntry);
        }

        for (const fileName of imageFiles) {
            // Skip if already uploaded
            const existing = projectEntry.images.find((img) => img.name === fileName);
            if (existing) {
                console.log(`  ⏩ ${fileName} já foi enviado anteriormente. (${existing.url})`);
                continue;
            }

            const filePath = path.join(projectFolderPath, fileName);
            const buffer = fs.readFileSync(filePath);
            const mimeType = getMimeType(fileName);

            const file = new File([buffer], fileName, { type: mimeType });

            try {
                const res = await utapi.uploadFiles(file);
                const uploadResult = Array.isArray(res) ? res[0] : res;

                if (uploadResult?.data) {
                    const data = uploadResult.data;
                    const url = data.ufsUrl || data.url || `https://utfs.io/f/${data.key}`;
                    console.log(`  ✅ ${fileName} -> ${url}`);
                    projectEntry.images.push({
                        name: fileName,
                        url: url,
                        key: data.key,
                    });
                } else if (uploadResult?.error) {
                    console.error(`  ❌ Erro ao enviar ${fileName}:`, uploadResult.error.message || uploadResult.error);
                }
            } catch (err: any) {
                console.error(`  ❌ Exceção ao enviar ${fileName}:`, err?.message || err);
            }
        }

        // Save incremental progress after each folder
        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), "utf-8");
    }

    console.log(`\n🎉 Processo concluído com sucesso! Dados salvos em: ${OUTPUT_FILE}`);
}

runUpload().catch((err) => {
    console.error("❌ Erro fatal durante a execução do script:", err);
    process.exit(1);
});
