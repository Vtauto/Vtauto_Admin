import dbConnect from "@/lib/dbConnect";
import RtoModel from "@/model/Rto";


export async function DELETE(req, context) {
    await dbConnect();

    try {

        const id = await context.params.id;

        if (!id) {
            return Response.json({
                message: "id Not Found",
                success: false,
            }, { status: 404 })
        }
        const data = await RtoModel.findOne({ _id: id })

        if (!data) {
            return Response.json({
                message: " data not found with provided id",
                success: false,
            }, { status: 404 })
        }
        await data.deleteOne();
        return Response.json({
            message: "Deleted",
            success: true,

        }, { status: 200 })



    } catch (error) {
        return Response.json({
            message: "Error in delete",
            success: false
        }, { status: 500 })
    }

}