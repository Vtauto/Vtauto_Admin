import dbConnect from "@/lib/dbConnect";
import WalletModel from "@/model/Wallet";


export const GET = async (request, context) => {
    await dbConnect();

    try {
        // Extract transaction ID from query parameters
        const id = context.params.id;

        // Find the transaction by ID
        const transaction = await WalletModel.findById(id).collation({ locale: 'en', strength: 2 });

        if (!transaction) {
            return Response.json(
                {
                    message: "Transaction not found!",
                    success: false,
                },
                { status: 404 }
            );
        }

        return Response.json(


            transaction,

            { status: 200 }
        );
    } catch (error) {
        console.log("Error on getting transaction:", error);
        return Response.json(
            {
                message: "Error on getting transaction!",
                success: false,
            },
            { status: 500 }
        );
    }
};
