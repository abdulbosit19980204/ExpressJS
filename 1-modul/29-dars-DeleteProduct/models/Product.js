import { Schema, model } from "mongoose"

const productSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', }
}, {
    timestamps: true,
})

const Product = model("Product", productSchema)
export default Product