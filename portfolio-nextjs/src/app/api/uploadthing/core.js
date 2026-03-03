import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        // Set permissions and file types for this FileRoute
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for url:", file.url);

            // Return whatever you want to be sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: "Infinita Poesia Admin" };
        }),

    videoUploader: f({ video: { maxFileSize: "32MB", maxFileCount: 5 } })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Video upload complete for url:", file.url);
            return { uploadedBy: "Infinita Poesia Admin" };
        }),
};
