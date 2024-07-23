import dbConnect from "@/lib/dbConnect";
import RtoModel from "@/model/Rto";


export async function GET(req,context) {
    await dbConnect();

    try {
        const id = await context.params.id

        const fetchdata = await RtoModel.findById(id);

        if (!fetchdata) {
            return Response.json({
                message: "Data not found with provided id",
                success: false
            }, {
                status: 404
            })
        }

        return Response.json({
            message: "Fetch successfully",
            success: true,
            fetchdata
        },{status:200})




    } catch (error) {
        return Response.json({
            message: "Error",
            success: false
        }, { status: 500 })
    }
}