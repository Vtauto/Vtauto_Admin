import dbConnect from "@/lib/dbConnect";
import InsuranceModel from "@/model/Insurance";

export const PATCH = async (request) => {
    await dbConnect();

    try {
        const {
            id,
            name,
            mobile_no,
            vehicle_no,
            rc_no,
            rc,
            aadharcard_no,
            aadharcard,
            pan_card_no,
            pan_card,
            old_policy_no,
            old_policy,
            status

        } = await request.json();

        const insurance = await InsuranceModel.findOne({ _id: id });

        if (!insurance) {
            return Response.json(
                {
                    message: "Received invalid insurance id!",
                    success: false,
                },
                { status: 500 }
            );
        }

        await insurance.updateOne({
            name,
            mobile_no,
            vehicle_no,
            rc_no,
            rc,
            aadharcard_no,
            aadharcard,
            pan_card_no,
            pan_card,
            old_policy_no,
            old_policy,
            status,
            updated: new Date(),
        });

        return Response.json(
            {
                message: "insurance updated!",
                success: true,
                insuranceId: id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error on updating insurance:", error);
        return Response.json(
            {
                message: "Error on updating insurance!",
                success: false,
            },
            { status: 500 }
        );
    }
};
