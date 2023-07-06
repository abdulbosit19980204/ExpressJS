import { Router } from "express";

const router = Router();
router.get('/', (req, res) => {
    res.render('index', {
        title: "APP | Home"
    })
})

router.get('/add', (req, res) => {
    res.render('add', {
        title: "APP | Add Products",
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

router.post('/login', (req, res) => {
    console.log("User authentificated", req.body);
    res.redirect('/')
})

router.post('/register', (req, res) => {
    console.log("New user registered", req.body);
    res.redirect('/login')
})

export default router