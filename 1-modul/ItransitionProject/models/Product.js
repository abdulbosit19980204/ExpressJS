import { Schema, model } from "mongoose"

const productSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    discount: { type: Number, require: false },
    type: { type: String, require: false },
    // sold: { type: Number, require: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
})

productSchema.index({ title: 'text', description: 'text' }); // Create text index on 'name' and 'description' fields
const Product = model('Product', productSchema)
export default Product