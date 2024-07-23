import { upload } from "@/lib/upload";

export const POST = async (request) => {
    try {
        const formData = await request.formData();
        // console.log(formData);
        const image = formData.get("file");
        console.log(image, "Sdsd");
        const abd = formData.getAll('files');
        console.log(abd);
        // const imagess = abd.map(async (f)=>(await upload(f)));
        const urlArray = [];
        for (const fileType of abd) {
            
              const fileUrl = await upload(fileType);
              console.log(fileUrl);
              urlArray.push(fileUrl);
            
          }
        // const uploadedImage = await upload(image);
        // console.log(imagess);

        return Response.json(
            {
                message: "File uploaded to cloudinary!",
                success: true,
                file: urlArray,
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
