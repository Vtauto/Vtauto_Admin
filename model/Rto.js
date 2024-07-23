import mongoose, { Schema } from "mongoose";

const RtoSchema = new Schema({
    userid: {
        type: String,
        required: true,
    },
    vehicle_no: {
        type: String,
        required: true,
        unique: true,
    },
    uiid: {
        type: String,
        required: true,
    },
    vehicle_insurance_number: {
        type: String,
        required: true,
    },
    vehicle_insurance: {
        type: String, // Storing file path
        required: true,
    },
    vehicle_insurance_expiry: {
        type: Date,
        required: true,
    },
    fitness_number: {
        type: String,
        required: true,
    },
    fitness: {
        type: String,// Storing file path
        required: true,
    },
    fitness_expiry: {
        type: Date,
        required: true,
    },
    puc_number: {
        type: String,
        required: true,
    },
    puc: {
        type: String,// Storing file path
        required: true,
    },
    puc_expiry: {
        type: Date,
        required: true,
    },
    permit_number: {
        type: String,
        required: true,
    },
    permit: {
        type: String,// Storing file path
        required: true,
    },
    permit_expiry: {
        type: Date,
        required: true,
    },
    tax_number: {
        type: String,
        required: true,
    },
    tax: {
        type: String,// Storing file path
        required: true,
    },
    tax_expiry: {
        type: Date,
        required: true,
    },
    rc_number: {
        type: String,
        required: true,
    },
    rc: {
        type: [String],// Storing file path
        required: true,
    },
    rc_expiry: {
        type: Date,
        required: true,
    },
    other: {
        type: [String], // storing file paths
        
    },

}, { timestamps: true });

const RtoModel = mongoose.models.allrtoinformationnew || mongoose.model("allrtoinformationnew", RtoSchema);

export default RtoModel;
