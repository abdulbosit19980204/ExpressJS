import { Router } from "express";
import Product from "../models/Product.js"
import authMiddleware from "../middleware/auth.js"
import userMiddleware from "../middleware/user.js"
// import { csvparse, Parser } from 'papaparse';
import { Parser } from "json2csv"
const router = Router();

router.get('/', async(req, res) => {
    try {
        const products = await Product.find().limit(5).lean()
        res.render('index', {
            title: "APP | Home",
            products: products.reverse(),
            userId: req.userId ? req.userId.toString() : null,
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }

})
router.get('/all', async(req, res) => {
    try {

        const products = await Product.find().lean()
        res.render('all', {
            title: "APP | All",
            products: products.reverse(),
            userId: req.userId ? req.userId.toString() : null,
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }
})


router.get('/add', authMiddleware, (req, res) => {
    try {

        res.render('add', {
            title: "APP | Add Products",
            isAdd: true,
            errorAddProduct: req.flash('errorAddProduct'),
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }
})

router.get('/products', async(req, res) => {
    try {

        const user = req.userId ? req.userId.toString() : null
        const myProducts = await Product.find({ user }).populate('user').lean()

        res.render('products', {
            title: "APP | Products",
            isProducts: true,
            myProducts: myProducts.reverse(),
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }
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
        // res.status(500).send('Internal Server Error');
        res.redirect('/')
    }

})

router.get('/edit-product/:id', async(req, res) => {
    try {

        const id = req.params.id
        const product = await Product.findById(id).lean()
        res.render('edit-product', {
            product: product,
            errorEditProduct: req.flash('errorEditProduct'),
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }
})

router.get('/search', async(req, res) => {
    try {

        res.render('search', {
            title: "APP | Searched",
            products: products.reverse(),
        })
    } catch (error) {
        console.error('Error searching for products:', error);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }
})

router.get('/download-csv', async(req, res) => {
    try {
        const user = req.userId ? req.userId.toString() : null;
        const myProducts = await Product.find({ user }).populate('user').lean();

        // Convert the data to CSV format using papaparse
        const jsontocsvParse = new Parser();
        const csv = await jsontocsvParse.parse(myProducts);

        // Set the appropriate headers for the response
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="my-products.csv"');

        // Send the CSV data to the client
        res.send(csv);

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


//Post methods

router.post('/add-product', userMiddleware, async(req, res) => {
    const { title, description, image, price, discount, productType } = req.body
    if (!title || !description || !image || !price) {
        req.flash('errorAddProduct', 'All fields are required')
        res.redirect('/add')
        return
    }
    const products = await Product.create({...req.body, user: req.userId })
    res.redirect('/')
})

router.post('/edit-product/:id', async(req, res) => {
    const { title, description, image, price, discount, productType } = req.body
    const id = req.params.id
    if (!title || !description || !image || !price) {
        req.flash('errorEditProduct', 'All fields are required')
        res.redirect(`/edit-product/${id}`)
        return
    }

    const pro = await Product.findByIdAndUpdate(id, req.body)
    console.log(pro);
    res.redirect('/')
})

router.post('/delete-product/:id', async(req, res) => {
    const id = req.params.id
    await Product.findByIdAndRemove(id)
    res.redirect('/products')
})

// POST route for search
router.post('/search', async(req, res) => {
    const searchedText = req.body.searchedText; // Assuming the search query is in the 'searchedText' property of the request body
    const limit = 5; // Specify the desired limit
    let page = req.body.page || 1; // Get the current page number from the request body or default to 1

    try {

        const regex = new RegExp(searchedText, 'gi'); // 'gi' flags make the search global and case-insensitive

        const totalDocuments = await Product.countDocuments({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        });

        const totalPages = Math.ceil(totalDocuments / limit); // Calculate the total number of pages

        const skip = (page - 1) * limit; // Calculate the number of documents to skip based on the current page

        const products = await Product.find({
                $or: [
                    { name: { $regex: regex } },
                    { description: { $regex: regex } }
                ]
            })
            .skip(skip)
            .limit(limit)
            .lean();

        res.render('search', {
            title: 'APP | Searched',
            products: products.reverse(),
            userId: req.userId ? req.userId.toString() : null,
            currentPage: page, // Pass the current page to the view for rendering
            totalPages: totalPages, // Pass the total number of pages to the view for rendering
        });
    } catch (err) {
        console.error('Error searching for products:', err);
        //res.status(500).send('Internal Server Error');
        res.redirect('/')
    }
});
// POST route for search


export default router