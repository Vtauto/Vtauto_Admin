import dbConnect from "@/lib/dbConnect";
import InsuranceModel from "@/model/Insurance";


export async function GET(req, context) {
    await dbConnect();


    try {

        const data = await context.params.allinsurance;

        const fetch = await InsuranceModel.find({default:data})

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