import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

export const PATCH = async (request) => {
  await dbConnect();

  try {
    const {
      id,
      name,
      email,
      mobile_no,
      password,
      aadharcard,
      user_type,
      status,

    } = await request.json();

    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      return Response.json(
        {
          message: "Received invalid user id!",
          success: false,
        },
        { status: 500 }
      );
    }

    await user.updateOne({
      name,
      email,
      mobile_no,
      password,
      aadharcard,
      user_type,
      status,
      updated: new Date(),
    });

    return Response.json(
      {
        message: "user updated!",
        success: true,
        userId: id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on updating user:", error);
    return Response.json(
      {
        message: "Error on updating user!",
        success: false,
      },
      { status: 500 }
    );
  }
};
