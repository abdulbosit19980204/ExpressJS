import { Router } from "express";
import User from "../models/User.js";
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

router.post('/login', async(req, res) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passsword: req.body.passsword,
        address: req.body.address,
        country: req.body.country,
        state: req.body.state,
        zip: req.body.zip,
    }

    const user = await User.create(userData)
    console.log(user);
    res.redirect('/')
})

router.post('/register', (req, res) => {
    console.log("New user registered", req.body);
    res.redirect('/login')
})


export default router