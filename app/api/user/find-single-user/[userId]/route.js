import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";


export const GET = async (request, context) => {
  await dbConnect();

  try {
    // Extract user ID from query parameters
    const userId = context.params.userId;

    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        {
          message: "user not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(
     
      
        user,
    
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on getting user:", error);
    return Response.json(
      {
        message: "Error on getting user!",
        success: false,
      },
      { status: 500 }
    );
  }
};
