import dbConnect from "@/lib/dbConnect";
import InsuranceModel from "@/model/Insurance";
export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json()

    const alreadyinsurance = await InsuranceModel.findOne({vehicle_no:data.vehicle_no});
    if (alreadyinsurance) {
      return Response.json(
        {
          message: "Insurance  already exist with provided Vechicle Number!",
          success: false,
        },
        { status: 400 }
      );
    }

    const insurance = new InsuranceModel(data);

    await insurance.save();

    return Response.json(
      {
        message: "insurance created!",
        success: true,
        insurance: insurance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error on creating insurance:", error);
    return Response.json(
      {
        message: "Error on creating insurance!",
        success: false,
      },
      { status: 500 }
    );
  }
};