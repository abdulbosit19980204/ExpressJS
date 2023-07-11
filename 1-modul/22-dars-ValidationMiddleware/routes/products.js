import { Router } from "express";
import Product from "../models/Product.js"
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: "APP | Apple Store",
    })

})
router.get('/add', (req, res) => {
    res.render('add', {
        title: "APP | Add products",
        isAdd: true,
    })
})
router.get('/products', (req, res) => {
    res.render('products', {
        title: "APP | Products",
        isProducts: true,
    })
})

// Post methods

router.post("/add-product", async(req, res) => {
    const { title, description, image, price } = req.body
    const products = await Product.create(req.body)
    console.log(products);
    res.redirect('/')
})

export default router