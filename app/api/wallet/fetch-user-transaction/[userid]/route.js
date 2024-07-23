import dbConnect from "@/lib/dbConnect";
import WalletModel from "@/model/Wallet";

export async function GET(request, context) {
    await dbConnect();

    try {
        
        // Extract email ID from query parameters
        const userid = context.params.userid;

        // Find the wallet by email
        const wallet = await WalletModel.find({ userid: userid }).collation({ locale: 'en', strength: 2 });;

        if (!wallet) {
            return Response.json(
                {
                    message: "wallet not found!",
                    success: false,
                },
                { status: 404 },
              
            );
        }

        return Response.json(wallet, { status: 200 });
        
    } catch (error) {
        console.log("Error on getting wallet:", error);
        return Response.json(
            {
                message: "Error on getting wallet!",
                success: false,
            },
            { status: 500 }
        );
    }
}
