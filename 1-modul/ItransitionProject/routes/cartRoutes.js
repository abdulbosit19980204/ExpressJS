import { Router } from "express"
import CartItem from "../models/Cart.js";
import Product from "../models/Product.js";
const router = Router()

// Route to add an item to the cart
router.get('/add-to-cart/:id', async(req, res) => {
    const id = req.params.id

    console.log(id);
    // const cartProduct = await Product.findById(id).populate('user').lean()
    // console.log(cartProduct);
    const cartProduct = await CartItem.create({ product: id, user: req.userId, quantity: req.quantity })
    console.log(cartProduct);
    res.render('myCart', { cartProduct: 'cartProduct', })
    res.redirect('/')
});

export default router