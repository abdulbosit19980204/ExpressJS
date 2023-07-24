import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhone: { type: String, required: true },
    message: { type: String, required: true },

})

const Message = model("Message", messageSchema)
export default Message