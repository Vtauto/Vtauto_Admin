import dbConnect from "@/lib/dbConnect";
import LoanModel from "@/model/Loan";


export async function GET(request, context) {
  await dbConnect();

  try {
    // Extract user ID from query parameters
    const userid = context.params.userid;

    // Find the loan by userid
    const loan= await LoanModel.find({ userid: userid });

    if (!loan) {
      return Response.json(
        {
          message: "loan not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(loan, { status: 200 });
  } catch (error) {
    console.log("Error on getting loan:", error);
    return Response.json(
      {
        message: "Error on getting loan!",
        success: false,
      },
      { status: 500 }
    );
  }
}
