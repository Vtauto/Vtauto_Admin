import dbConnect from "@/lib/dbConnect";
import InsuranceModel from "@/model/Insurance";

export const DELETE = async (request, context) => {
  await dbConnect();

  try {
    const id = context.params.id;

    if (!id) {
      return Response.json(
        {
          message: "insurance id is required!",
          success: false,
        },
        { status: 400 }
      );
    }

    const insurance = await InsuranceModel.findOne({ _id: id });

    if (!insurance) {
      return Response.json(
        {
          message: "Received invalid insurance id!",
          success: false,
        },
        { status: 400 }
      );
    }

    await insurance.deleteOne();

    return Response.json(
      {
        message: "insurances deleted!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on deleting insurance:", error);
    return Response.json(
      {
        message: "Error on deleting insurance!",
        success: false,
      },
      { status: 500 }
    );
  }
};