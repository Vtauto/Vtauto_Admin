import dbConnect from "@/lib/dbConnect";
import LoanModel from "@/model/Loan";


export const GET = async (request) => {
  await dbConnect();

  try {
    const loans = await LoanModel.find({});
    return Response.json(
      {
        message: "All loans fetched!",
        success: true,
        loans,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on getting loan list:", error);
    return Response.json(
      {
        message: "Error on getting loan list!",
        success: false,
      },
      { status: 500 }
    );
  }
};
