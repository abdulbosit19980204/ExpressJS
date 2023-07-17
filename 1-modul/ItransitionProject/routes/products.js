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
    try {
        const id = req.params.id
        const product = await Product.findById(id).populate('user').lean()
        res.render('product', {
            product: product,
        })

    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).send('Internal Server Error');
    }

})

router.get('/edit-product/:id', async(req, res) => {
    const id = req.params.id
    const product = await Product.findById(id).lean()
    res.render('edit-product', {
        product: product,
        errorEditProduct: req.flash('errorEditProduct'),
    })
})

router.get('/search', async(req, res) => {
    const searchedText = req.body.searchedText
        // const searchedProducts = await Product.find(searchedText).lean()

    res.render('search', {
        title: "APP | Searched",
        // products: searchedProducts.reverse(),
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

router.post('/edit-product/:id', async(req, res) => {
    const { title, description, image, price } = req.body
    const id = req.params.id
    if (!title || !description || !image || !price) {
        req.flash('errorEditProduct', 'All fields are required')
        res.redirect(`/edit-product/${id}`)
        return
    }

    await Product.findByIdAndUpdate(id, req.body)
    res.redirect('/')
})

router.post('/delete-product/:id', async(req, res) => {
    const id = req.params.id
    await Product.findByIdAndRemove(id)
    res.redirect('/products')
})

router.post('/search', async(req, res) => {
    const searchedText = req.body.searchedText; // Assuming the search query is in the 'searchedText' property of the request body
    if (searchedText != "") {
        try {
            const regex = new RegExp(searchedText, 'gi'); // 'gi' flags make the search global and case-insensitive
            const products = await Product.find({
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ]
            }).lean();
            res.render('search', {
                title: 'APP | Searched',
                products: products.reverse(),
                userId: req.userId ? req.userId.toString() : null,
            });
        } catch (err) {
            console.error('Error searching for products:', err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/')
    }
});

export default router