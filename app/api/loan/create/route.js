import dbConnect from "@/lib/dbConnect";
import LoanModel from "@/model/Loan";


export const POST = async (request) => {
    await dbConnect();

    try {
        const { userid,
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
            banking

        } = await request.json();
        const alreadyloan = await LoanModel.findOne({ applicant_aadharcard_number });

        if (alreadyloan) {
            return Response.json(
                {
                    message: "loan already exist with provided Aadhar_no!",
                    success: false,
                },
                { status: 400 }
            );
        }


        const createdloan = await LoanModel.create({
            userid,
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
            banking
        });

        return Response.json(
            {
                message: "loan registration completed!",
                success: true,
                loan: createdloan,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error on loan registration:", error);
        return Response.json(
            {
                message: "Error on loan registration!",
                success: false,
            },
            { status: 500 }
        );
    }
};
