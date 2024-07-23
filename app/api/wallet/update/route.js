import dbConnect from "@/lib/dbConnect";
import WalletModel from "@/model/Wallet";

export const PATCH = async (request) => {
    await dbConnect();

    try {
        const {
            id,
            amount,
            type,
            status,

        } = await request.json();

        const wallet = await WalletModel.findOne({ _id: id }).collation({ locale: 'en', strength: 2 });

        if (!wallet) {
            return Response.json(
                {
                    message: "Received invalid wallet id!",
                    success: false,
                },
                { status: 500 }
            );
        }

        await wallet.updateOne({
            amount,
            type,
            status,
            updated: new Date(),
        }).collation({ locale: 'en', strength: 2 });

        return Response.json(
            {
                message: "wallet updated!",
                success: true,
                walletId: id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error on updating wallet:", error);
        return Response.json(
            {
                message: "Error on updating wallet!",
                success: false,
            },
            { status: 500 }
        );
    }
};
