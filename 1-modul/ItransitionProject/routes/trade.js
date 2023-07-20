import { Router } from "express";
import user from "../middleware/user.js";
import Product from "../models/Product.js";
import CartItem from "../models/Cart.js";
const router = new Router();

router.get('/my-cart', async(req, res) => {
    try {

        const buyProducts = await CartItem.find().populate('user').populate('product').lean()
        console.log(buyProducts);
        res.render('myCart', {
            title: "APP | My Cart",
            buyProducts: buyProducts.reverse(),
            userId: req.userId ? req.userId.toString() : null,
            productId: req.productId ? req.id.toString() : null,
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }

})


// Post methods

router.post('/my-cart', (req, res) => {
    console.log("Yangi maxsulotlar savatga qoshildi");
    res.redirect('/')
})





export default router