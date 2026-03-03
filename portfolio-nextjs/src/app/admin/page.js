"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";

export default function AdminPage() {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    return (
        <main className="container mx-auto p-12 mt-12 mb-24 max-w-3xl bg-white border border-gray-100 rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold mb-6 text-[#333]">Painel de Upload (Infinita Poesia)</h1>
            <p className="mb-8 text-[#4a4a4a]">Faça o upload de Imagens (até 4MB) ou Vídeos (até 32MB) para o servidor da Nuvem.</p>

            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-[#333]">1. Área de Upload (Arraste aqui)</h2>
                <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Files: ", res);
                        setUploadedFiles((prev) => [...prev, ...res]);
                        alert("Upload Concluído com Sucesso!");
                    }}
                    onUploadError={(error) => {
                        // Do something with the error.
                        alert(`ERRO NO UPLOAD: ${error.message}`);
                    }}
                    appearance={{
                        container: "border-2 border-dashed border-[#FF4E50] bg-gray-50 rounded-lg p-12",
                        label: "text-[#FF4E50] hover:text-[#333]",
                        button: "bg-[#FF4E50] text-white px-4 py-2 rounded font-fira ut-uploading:cursor-not-allowed ut-uploading:bg-[#FF4E50]/50",
                    }}
                />
            </div>

            {uploadedFiles.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-[#333]">2. Links Gerados na Nuvem</h2>
                    <p className="text-sm text-[#4a4a4a] mb-4">Copie os links abaixo e cole no código dos seus Projetos HTML/React:</p>
                    <ul className="space-y-4">
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded">
                                <span className="font-medium text-[#FF4E50]">{file.name}</span>
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                                    {file.url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    );
}
