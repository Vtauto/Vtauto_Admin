import mongoose, { Schema } from "mongoose";


    
const InsuranceSchema = new Schema(
  {
    userid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mobile_no: {
        type: Number,
        required: true,
    },
    vehicle_no: {
        type: String,
        required: true,
        unique: true,
    },
    rc_no: {
        type: String, 
        required:true,
    },
    rc: {
        type: [String], // storing file paths
        required:true,
    },
    aadharcard_no: {
        type: String, 
        required:true,
    },
    aadharcard: {
        type: [String], // storing file paths
        required:true,
    },
    pan_card_no: {
        type: String, 
        required:true,
    },
    pan_card: {
        type: String, // storing file paths
        required:true,
    },
    old_policy_no: {
        type: String, 
        required:true,
    },
    old_policy: {
        type: String, // storing file paths
        required:true,
    },
    status:{
        type:Boolean,
        required:true,
        default: false
    },
    default:{
        type:String,
        required:true,
        default:"allinsurance"
    },
    other: {
        type: [String], // storing file paths
    },
    quotation : {
        type: String, // storing file paths
    },
    policy: {
        type: String, // storing file paths
    },
  },
  { timestamps: true }
);

const InsuranceModel =
  mongoose.models.allinsurancenew11 || mongoose.model("allinsurancenew11", InsuranceSchema);

export default InsuranceModel;
