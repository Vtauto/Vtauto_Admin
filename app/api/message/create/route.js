import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";


export async function POST(req) {
    await dbConnect();


    try {

        const data = await req.json();
        
        const newdata = new MessageModel(data);
        await newdata.save();
        
        return Response.json({
            message: "Message creted",
            success: true,
            data: newdata
        }, { status: 201 })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            message: "error in creting message",
            message: false
        }, { status: 500 })
    }
}