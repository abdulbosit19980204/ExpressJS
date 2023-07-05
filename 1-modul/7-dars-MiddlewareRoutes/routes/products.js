import { Router } from "express";
const router = Router()


router.get('/add', (req, res) => {
    res.render('add')
})
router.get('/products', (req, res) => {
    res.render('products')
})

export default router