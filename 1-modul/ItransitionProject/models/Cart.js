import { Schema, model } from "mongoose"

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

const CartItem = model('CartItem', cartItemSchema)
export default CartItem