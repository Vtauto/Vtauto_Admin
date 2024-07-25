import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
    {

        adminid: { type: String },
        userid: { type: String },
        documentid: { type: String },
        documenttype: { type: String },
        documentidentity: { type: String },
        message: { type: String },
        type: { type: String, required: true,  enum: ["user", "admin"] },

    },
    {
        timestamps: true,

    },

);

const MessageModel =
    mongoose.models.messageboxnew || mongoose.model("messageboxnew", MessageSchema);

export default MessageModel;
