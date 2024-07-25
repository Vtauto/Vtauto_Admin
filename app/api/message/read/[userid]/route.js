import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/Message";

export async function GET(request, context) {
    await dbConnect();

    try {
        
      
        const userid = context.params.userid;

        
        const message = await MessageModel.find({ userid: userid }).collation({ locale: 'en', strength: 2 });;

        if (message.length === 0) {
            return Response.json(
                {
                    message: "message not found!",
                    success: false,
                },
                { status: 200 },
              
            );
        }

        return Response.json(message, { status: 200 });
        
    } catch (error) {
        console.log("Error on getting message:", error);
        return Response.json(
            {
                message: "Error on getting message!",
                success: false,
            },
            { status: 500 }
        );
    }
}
