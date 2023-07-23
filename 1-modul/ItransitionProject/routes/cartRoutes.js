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
        const cartLength = buyProducts.length;
        res.render('myCart', {
            title: "APP | My Cart",
            buyProducts: buyProducts.reverse(),
            isCart: true,
            cartLength: cartLength,
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        res.redirect('/')
    }

})


router.post('/delete-product-from-cart/:id', async(req, res) => {
    const id = req.params.id
    await CartItem.findByIdAndRemove(id)
    res.redirect('/my-cart')
})


export default router