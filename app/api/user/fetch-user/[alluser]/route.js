import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";


export async function GET(req, context) {
    await dbConnect();


    try {

        const data = await context.params.alluser;

        const fetch = await UserModel.find({default:data})

        return Response.json({
            message:"Data fatched",
            success:true,
            data:fetch
        },{status:200})

    } catch (error) {
        console.log("Error in find by default");
        return Response.json({
            message: "Error in fetch data",
            success: false
        }, { status: 500 })
    }
}