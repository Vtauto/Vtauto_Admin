import dbConnect from "@/lib/dbConnect";
import LoanModel from "@/model/Loan";



export async function GET(req, context) {
    await dbConnect();


    try {

        const data = await context.params.allloan;

        const fetch = await LoanModel.find({default:data})

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