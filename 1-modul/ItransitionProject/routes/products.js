import { Router } from "express";
import Product from "../models/Product.js"
import LikedItem from "../models/Liked.js";
import authMiddleware from "../middleware/auth.js"
import userMiddleware from "../middleware/user.js"
import { Parser } from "json2csv"
import fs from "fs"
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = dirname(__filename)

const router = Router();

router.get('/', async(req, res) => {
    try {
        const products = await Product.find({ discount: { $gt: 0 } }).limit(10).lean()

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
            title: "APP | My Products",
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

// router.post('/add-product', userMiddleware, async(req, res) => {
//     const { title, description, image, price, discount, productType } = req.body;

//     if (!title || !description || !price) {
//         req.flash('errorAddProduct', 'All fields are required');
//         return res.redirect('/add');
//     }

//     // Check if the request contains the file
//     if (!req.files || !req.files.image) {
//         req.flash('errorAddProduct', 'Image is required');
//         return res.redirect('/add');
//     }

//     const uploadedFile = req.files.image;

//     // Generate a unique filename for the uploaded file
//     const uniqueFileName = Date.now() + "_" + uploadedFile.name;
//     const uploadPath = path.join("./public/uploads", uniqueFileName);

//     // Move the file to the desired location
//     await uploadedFile.mv(uploadPath);

//     // Create the new product object with the file path
//     const newProduct = new Product({
//         title,
//         description,
//         image: "/uploads/" + uniqueFileName,
//         price,
//         discount,
//         productType,
//         user: req.userId // Assuming you have a user ID stored in the req object by userMiddleware
//     });

//     // Save the product to the database
//     await newProduct.save();

//     // Redirect after successful product creation
//     res.redirect('/');

// });

router.post('/add-product', userMiddleware, async(req, res) => {
    const { title, description, price, discount, productType } = req.body;

    if (!title || !description || !price) {
        req.flash('errorAddProduct', 'All fields are required');
        return res.redirect('/add');
    }
    // Check if the request contains multiple files
    if (!req.files || !req.files.images) {
        req.flash('errorAddProduct', 'Image is required');
        return res.redirect('/add');
    }

    const uploadedFiles = req.files.images;
    const uploadedImagePaths = [];

    // Handle multiple file uploads
    for (const uploadedFile of Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]) {
        const uniqueFileName = Date.now() + "_" + uploadedFile.name;
        const uploadPath = path.join("./public/uploads", uniqueFileName);

        // Move the file to the desired location
        await uploadedFile.mv(uploadPath);

        // Push the image path to the array
        uploadedImagePaths.push("/uploads/" + uniqueFileName);
    }

    // Create the new product object with the file paths
    const newProduct = new Product({
        title,
        description,
        images: uploadedImagePaths, // Use 'images' instead of 'image'
        price,
        discount,
        productType,
        user: req.userId // Assuming you have a user ID stored in the req object by userMiddleware
    });

    // Save the product to the database
    await newProduct.save();

    // Redirect after successful product creation
    res.redirect('/');
});

router.post('/edit-product/:id', async(req, res) => {
    const { title, description, price, discount, productType } = req.body;
    const id = req.params.id;

    if (!title || !description || !price) {
        req.flash('errorEditProduct', "All fields are required");
        return res.redirect(`/edit-product/${id}`);
    }

    let editedProduct = {
        title,
        description,
        price,
        discount,
        productType,
    };

    // Check if the request contains multiple files
    if (req.files && req.files.images) {
        const uploadedFiles = req.files.images;
        const uploadedImagePaths = [];

        // Handle multiple file uploads
        for (const uploadedFile of Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]) {
            const uniqueFileName = Date.now() + "_" + uploadedFile.name;
            const uploadPath = path.join("./public/uploads", uniqueFileName);

            // Move the file to the desired location
            await uploadedFile.mv(uploadPath);

            // Push the image path to the array
            uploadedImagePaths.push("/uploads/" + uniqueFileName);
        }

        // Update the product object with the new file paths in an array
        editedProduct.images = uploadedImagePaths;
    }

    // Update the product in the database
    await Product.findByIdAndUpdate(id, editedProduct);

    res.redirect('/');
});




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
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { productType: { $regex: regex } },
            ]
        });

        const totalPages = Math.ceil(totalDocuments / limit); // Calculate the total number of pages

        const skip = (page - 1) * limit; // Calculate the number of documents to skip based on the current page

        const products = await Product.find({
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } },
                    { productType: { $regex: regex } },
                ]
            })
            .skip(skip)
            .limit(limit)
            .lean();

        res.render('all', {
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