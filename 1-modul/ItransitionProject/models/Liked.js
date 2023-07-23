import { Schema, model } from "mongoose"

const LikedItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

const LikedItem = model('LikedItem', LikedItemSchema)
export default LikedItem