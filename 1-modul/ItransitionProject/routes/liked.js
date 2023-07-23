import { Router } from "express";
import LikedItem from "../models/Liked.js"

const router = Router()

router.get('/add-to-liked/:id', async(req, res) => {
    const id = req.params.id
    console.log(id);
    const likedProduct = await LikedItem.create({ product: id, user: req.userId })
    console.log(likedProduct);
    res.render('myLiked', { likedProduct: 'likedProduct', })
    res.redirect('/my-liked')
        // res.send(id)
});

router.get('/my-liked', async(req, res) => {
    try {

        const user = req.userId ? req.userId.toString() : null
        const likedProducts = await LikedItem.find({ user }).populate('user').populate('product').lean()
        const likedLength = likedProducts.length;
        res.render('myLiked', {
            title: "APP | My Liked",
            likedProducts: likedProducts.reverse(),
            isLiked: true,
            likedLength: likedLength,
        });
    } catch (error) {
        console.error('Error searching for products:', error);
        res.redirect('/')
    }

})


router.post('/delete-product-from-liked/:id', async(req, res) => {
    const id = req.params.id
    await LikedItem.findByIdAndRemove(id)
    res.redirect('/my-liked')
})


export default router