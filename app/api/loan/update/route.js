import dbConnect from "@/lib/dbConnect";
import LoanModel from "@/model/Loan";


export const PATCH = async (request) => {
    await dbConnect();

    try {
        const {
            id,
            applicant_name,
            applicant_mobile,
            vehicle_name,
            applicant_aadharcard_number,
            applicant_aadharcard,
            applicant_pancard_number,
            applicant_pancard,
            applicant_dl_number,
            applicant_dl,
            applicant_udhyamcard_number,
            applicant_udhyamcard,
            applicant_photo,


            coapplicant_aadharcard_number,
            coapplicant_aadharcard,
            coapplicant_pancard_number,
            coapplicant_pancard,
            coapplicant_voterid_number,
            coapplicant_voterid,
            coapplicant_photo,


            guarantor_aadharcard_number,
            guarantor_aadharcard,
            guarantor_pancard_number,
            guarantor_pancard,
            guarantor_voterid_number,
            guarantor_voterid,
            guarantor_rc_number,
            guarantor_rc,
            guarantor_photo,


            vehicle_rc_number,
            vehicle_rc,
            vehicle_insurance_number,
            vehicle_insurance,
            vehicle_tax,
            vehicle_permit,
            saler_aadharcardnumber,
            saler_aadharcard,
            sale_agreement,


            electricity_bill,
            agreement,
            banking,
            status

        } = await request.json();

        const loan = await LoanModel.findOne({ _id: id });

        if (!loan) {
            return Response.json(
                {
                    message: "Received invalid loan id!",
                    success: false,
                },
                { status: 500 }
            );
        }

        await loan.updateOne({
            applicant_name,
            applicant_mobile,
            vehicle_name,
            applicant_aadharcard_number,
            applicant_aadharcard,
            applicant_pancard_number,
            applicant_pancard,
            applicant_dl_number,
            applicant_dl,
            applicant_udhyamcard_number,
            applicant_udhyamcard,
            applicant_photo,


            coapplicant_aadharcard_number,
            coapplicant_aadharcard,
            coapplicant_pancard_number,
            coapplicant_pancard,
            coapplicant_voterid_number,
            coapplicant_voterid,
            coapplicant_photo,


            guarantor_aadharcard_number,
            guarantor_aadharcard,
            guarantor_pancard_number,
            guarantor_pancard,
            guarantor_voterid_number,
            guarantor_voterid,
            guarantor_rc_number,
            guarantor_rc,
            guarantor_photo,


            vehicle_rc_number,
            vehicle_rc,
            vehicle_insurance_number,
            vehicle_insurance,
            vehicle_tax,
            vehicle_permit,
            saler_aadharcardnumber,
            saler_aadharcard,
            sale_agreement,


            electricity_bill,
            agreement,
            banking,
            status,
            updated: new Date(),
        });

        return Response.json(
            {
                message: "loan updated!",
                success: true,
                loanId: id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error on updating loan:", error);
        return Response.json(
            {
                message: "Error on updating loan!",
                success: false,
            },
            { status: 500 }
        );
    }
};
