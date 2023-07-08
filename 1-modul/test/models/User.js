import { Schema, model } from "mongoose"


const userSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userImage: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: false },

})

const User = model("User", userSchema)
export default User