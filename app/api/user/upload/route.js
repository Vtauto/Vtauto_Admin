import { upload } from "@/lib/upload";

export const POST = async (request) => {
    try {
        const formData = await request.formData();
        // console.log(formData);
        const image = formData.get("file");

        const uploadedImage = await upload(image);

        return Response.json(
            {
                message: "File uploaded to cloudinary!",
                success: true,
                file: uploadedImage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error on creating product:", error);
        return Response.json(
            {
                message: "Error on creating product!",
                success: false,
            },
            { status: 500 }
        );
    }
};
