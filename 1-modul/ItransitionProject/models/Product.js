import { Schema, model } from "mongoose"

const productSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    images: [{ type: String, require: false }], // Store multiple image paths in the 'images' field as an array
    price: { type: Number, require: true },
    discount: { type: Number, require: false },
    productType: { type: String, require: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

productSchema.index({ title: 'text', description: 'text', productType: 'text' }); // Create text index on 'name' and 'description' fields
const Product = model('Product', productSchema)
export default Product