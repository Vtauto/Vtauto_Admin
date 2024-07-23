import dbConnect from "@/lib/dbConnect";
import LoanModel from "@/model/Loan";


export const DELETE = async (request, context) => {
  await dbConnect();

  try {
    const id = context.params.id;

    if (!id) {
      return Response.json(
        {
          message: "loan id is required!",
          success: false,
        },
        { status: 400 }
      );
    }

    const loan = await LoanModel.findOne({ _id: id });

    if (!loan) {
      return Response.json(
        {
          message: "Received invalid loan id!",
          success: false,
        },
        { status: 400 }
      );
    }

    await loan.deleteOne();

    return Response.json(
      {
        message: "loans deleted!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on deleting loan:", error);
    return Response.json(
      {
        message: "Error on deleting loan!",
        success: false,
      },
      { status: 500 }
    );
  }
};