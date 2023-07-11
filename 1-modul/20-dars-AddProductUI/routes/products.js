import { Router } from "express";
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

router.post("/add-product", (req, res) => {
    console.log(req.body);
    res.redirect('/')
})

export default router