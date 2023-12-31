import { Router } from "express";
import Product from "../models/Product.js"
import authMiddleware from "../middleware/auth.js";
import userMiddleware from "../middleware/user.js";

const router = Router()

router.get('/', async(req, res) => {
    const products = await Product.find().lean()

    res.render('index', {
        title: "APP | Apple Store",
        products: products,
    })

})
router.get('/add', authMiddleware, (req, res) => {
    res.render('add', {
        title: "APP | Add products",
        isAdd: true,
        errorAddProduct: req.flash('errorAddProduct')
    })
})
router.get('/products', (req, res) => {
    res.render('products', {
        title: "APP | Products",
        isProducts: true,
    })
})

// Post methods

router.post("/add-product", userMiddleware, async(req, res) => {
    const { title, description, image, price } = req.body
    if (!title || !description || !image || !price) {
        req.flash('errorAddProduct', "All fields are required")
        res.redirect('/add')
        return
    }
    console.log(req.userId);
    const products = await Product.create({...req.body, user: req.userId })
    res.redirect('/')
})

export default router