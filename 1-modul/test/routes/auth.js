import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

const router = Router()



router.get('/register', (req, res) => {
    res.render('register', {
        title: "APP | Register",
        isRegister: true,
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: "APP | Login",
        isLogin: true,
    })
})

// Post methods


router.post('/register', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userImage: req.body.userImage,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
            country: req.body.country,
            state: req.body.state,
            zip: req.body.zip,
        }

        const user = await User.create(userData)
        console.log(user);
        res.redirect('/login')
    } catch (error) {
        res.send(error)
    }
})


router.post('/login', (req, res) => {
    console.log("User auth", req.body);
    res.redirect('/')
})


export default router