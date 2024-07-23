import dbConnect from "@/lib/dbConnect";
import RtoModel from "@/model/Rto";

export async function GET(context) {
    await dbConnect();

    try {

        const fetchdata = await RtoModel.find({ _id: { $exists: true } });
        return Response.json({
            message: "All data fetched",
            success: true,
            data: fetchdata
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            message: "Error in get all rto information",
            success: false
        }, { status: 500 })
    }

}