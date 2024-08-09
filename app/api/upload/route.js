import { upload } from "@/lib/upload";

export const POST = async (request) => {
    try {
        // Extract form data from the request
        const formData = await request.formData();

        // Get all files from the form data
        const files = formData.getAll('files');

        if (files.length === 0) {
            return Response.json(
                {
                    message: "No files provided for upload.",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Upload each file and collect their URLs
        const urlArray = await Promise.all(files.map(async (file) => {
            try {
                const fileUrl = await upload(file);
                return fileUrl;
            } catch (uploadError) {
                console.error(`Error uploading file: ${file.name}`, uploadError);
                throw new Error(`Failed to upload file: ${file.name}`);
            }
        }));

        return Response.json(
            {
                message: "Files uploaded successfully!",
                success: true,
                files: urlArray,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in file upload:", error);
        return Response.json(
            {
                message: "Error in file upload!",
                success: false,
                error: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
};
