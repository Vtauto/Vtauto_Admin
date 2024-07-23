import dbConnect from "@/lib/dbConnect";
import RtoModel from "@/model/Rto";

export async function PATCH(req) {
    await dbConnect();

    try {
        const data = await req.json();
        const singleproduct = await RtoModel.findOne({ _id: data._id });


        if (!singleproduct) {
            return Response.json({
                message: "Invalid id",
                success: false
            }, { status: 404 })
        }

        await singleproduct.updateOne(data);

        return Response.json({
            message: "Update done",
            success: true,
            data: data.id
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            message: "Error in update details",
            success: false
        }, { status: 500 })
    }
}