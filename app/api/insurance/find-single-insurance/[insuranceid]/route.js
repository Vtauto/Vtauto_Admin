import dbConnect from "@/lib/dbConnect";
import InsuranceModel from "@/model/Insurance";


export const GET = async (request, context) => {
  await dbConnect();

  try {
    const insuranceid = context.params.insuranceid;
    const insurance = await InsuranceModel.findById(insuranceid);

    if (!insurance) {
      return Response.json(
        {
          message: "insurance not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(


      insurance,

      { status: 200 }
    );
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
};
