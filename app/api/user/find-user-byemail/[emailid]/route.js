import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

export async function GET(request, context) {
  await dbConnect();

  try {
    // Extract email ID from query parameters
    const emailid = context.params.emailid;

    // Find the user by email
    const user = await UserModel.findOne({ email: emailid });

    if (!user) {
      return Response.json(
        {
          message: "User not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(user, { status: 200 });
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
}
