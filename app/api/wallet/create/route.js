import dbConnect from "@/lib/dbConnect";
import WalletModel from "@/model/Wallet";


export async function POST(req) {
    await dbConnect();


    try {

        const data = await req.json();
        
        const newdata = new WalletModel(data);
        await newdata.save();
        
        return Response.json({
            message: "data creted",
            success: true,
            data: newdata
        }, { status: 201 })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            message: "error in creting wallet details",
            message: false
        }, { status: 500 })
    }
}