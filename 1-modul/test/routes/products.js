import { Router } from "express";
import Product from "../models/Product.js"
import authMiddleware from "../middleware/auth.js"
import userMiddleware from "../middleware/user.js"
const router = Router();
router.get('/', async(req, res) => {
    const products = await Product.find().lean()
    res.render('index', {
        title: "APP | Home",
        products: products.reverse(),
        userId: req.userId ? req.userId.toString() : null,
    })
})

router.get('/add', authMiddleware, (req, res) => {

    res.render('add', {
        title: "APP | Add Products",
        isAdd: true,
        errorAddProduct: req.flash('errorAddProduct'),
    })
})

router.get('/products', async(req, res) => {
    const user = req.userId ? req.userId.toString() : null
    const myProducts = await Product.find({ user }).populate('user').lean()

    res.render('products', {
        title: "APP | Products",
        isProducts: true,
        myProducts: myProducts,
    })
})

router.get('/product/:id', async(req, res) => {
    const id = req.params.id
    const product = await Product.findById(id).populate('user').lean()
    res.render('product', {
        product: product,
    })
})

//Post methods

router.post('/add-product', userMiddleware, async(req, res) => {
    const { title, description, image, price } = req.body
    if (!title || !description || !image || !price) {
        req.flash('errorAddProduct', 'All fields are required')
        res.redirect('/add')
        return
    }
    const products = await Product.create({...req.body, user: req.userId })
    res.redirect('/')
})


export default router