import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
    await dbConnect();

    try {
        const { name, email, mobile_no, password, aadharcard, user_type, status } = await request.json();
        const alreadyuser = await UserModel.findOne({ email });

        if (alreadyuser) {
            return Response.json(
                {
                    message: "user already exist with provided email address!",
                    success: false,
                },
                { status: 400 }
            );
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await UserModel.create({
            name,
            email,
            mobile_no,
            password: hashedPassword,
            aadharcard,
            user_type,
            status,
        });

        return Response.json(
            {
                message: "user registration completed!",
                success: true,
                user: createdUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error on user sign up:", error);
        return Response.json(
            {
                message: "Error on user sign up!",
                success: false,
            },
            { status: 500 }
        );
    }
};
