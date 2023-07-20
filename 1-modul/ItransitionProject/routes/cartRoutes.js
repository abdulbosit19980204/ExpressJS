import { Router } from "express"
import CartItem from "../models/Cart.js";

const router = Router()

// Route to add an item to the cart
router.get('/add-to-cart/:id', async(req, res) => {
    const id = req.params.id
    const cartProduct = await CartItem.create({ product: id, user: req.userId, quantity: req.quantity })
    res.render('myCart', { cartProduct: 'cartProduct', })
    res.redirect('/my-cart')
});



router.get('/my-cart', async(req, res) => {
    try {
        const user = req.userId ? req.userId.toString() : null
        const buyProducts = await CartItem.find({ user }).populate('user').populate('product').lean()
        res.render('myCart', {
            title: "APP | My Cart",
            buyProducts: buyProducts.reverse(),
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        res.redirect('/')
    }

})



export default router