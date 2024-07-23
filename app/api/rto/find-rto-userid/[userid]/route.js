import dbConnect from "@/lib/dbConnect";
import RtoModel from "@/model/Rto";

export async function GET(request, context) {
  await dbConnect();

  try {
    // Extract email ID from query parameters
    const userid = context.params.userid;

    // Find the insuranceby email
    const insurance= await RtoModel.find({ userid: userid });

    if (!insurance) {
      return Response.json(
        {
          message: "insurance not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(insurance, { status: 200 });
  } catch (error) {
    console.log("Error on getting insurance:", error);
    return Response.json(
      {
        message: "Error on getting insurance!",
        success: false,
      },
      { status: 500 }
    );
  }
}
