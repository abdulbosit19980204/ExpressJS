import { Schema, model } from "mongoose"

const productTypeSchema = new Schema({
    productType: { type: string, require: true },
})

const ProductType = model("productType", productTypeSchema)
export default ProductType