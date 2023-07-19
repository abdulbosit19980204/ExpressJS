import { Router } from "express";
import Product from "../models/Product.js";
const router = new Router();

router.get('/my-cart', async(req, res) => {
    try {

        const buyProducts = await Product.find().lean()
        res.render('myCart', {
            title: "APP | My Cart",
            buyProducts: buyProducts.reverse(),
            userId: req.userId ? req.userId.toString() : null,
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