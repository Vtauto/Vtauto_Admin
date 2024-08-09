import { upload } from "@/lib/upload";

export const POST = async (request) => {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');
        const urlArray = [];

        for (const file of files) {
            if (file.size > 100 * 1024 * 1024) { // Check file size (100MB limit here)
                throw new Error('File size exceeds the limit of 100MB');
            }

            const fileUrl = await upload(file);
            urlArray.push(fileUrl);
        }

        return new Response(
            JSON.stringify({
                message: "Files uploaded successfully!",
                success: true,
                file: urlArray,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error uploading files:", error);
        return new Response(
            JSON.stringify({
                message: "Error uploading files!",
                success: false,
            }),
            { status: 500 }
        );
    }
};
