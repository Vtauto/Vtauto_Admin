import dbConnect from "@/lib/dbConnect";
import LoanModel from "@/model/Loan";




export const GET = async (request, context) => {
  await dbConnect();

  try {
    // Extract loan ID from query parameters
    const loanid = context.params.loanid;

    // Find the loan by ID
    const loan = await LoanModel.findById(loanid);

    if (!loan) {
      return Response.json(
        {
          message: "loan not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(
     
      
        loan,
    
      { status: 200 }
    );
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
};
