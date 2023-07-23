import { Router } from "express";
import user from "../middleware/user.js";
import Product from "../models/Product.js";
import CartItem from "../models/Cart.js";
const router = new Router();

// Post methods

router.post('/my-cart', (req, res) => {
    console.log("Yangi maxsulotlar savatga qoshildi");
    res.redirect('/')
})





export default router