import dbConnect from "@/lib/dbConnect";
import RtoModel from "@/model/Rto";


export async function POST(req) {
    await dbConnect();


    try {

        const data = await req.json();

        const alreadydata = await RtoModel.findOne({ vehicle_no: data.vehicle_no });

        if (alreadydata) {
            return Response.json({
                message: " data already exit with provided vechicle number",
                success: false,

            }, { status: 500 })
        }
        const newdata = new RtoModel(data);
        await newdata.save();

        return Response.json({
            message: "data creted",
            success: true,
            data: newdata
        }, { status: 201 })

    } catch (error) {
        return Response.json({
            message: "error in creting rto details",
            message: false
        }, { status: 500 })
    }
}