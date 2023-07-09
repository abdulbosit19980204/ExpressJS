import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
const router = Router()

router.get('/register', (req, res) => {
    res.render('register', {
        title: "APP | Register ",
        isRegister: true,
        registerError: 'RegError'
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: "APP | Login",
        isLogin: true,
        loginError: req.flash('loginError')
    })
})


// Post methods

router.post('/register', async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
    }
    const user = await User.create(userData)
    console.log(user);
    res.redirect('/login')
})

router.post('/login', async(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        req.flash("loginError", "All fields is required")
    }

    const existUser = await User.findOne({ email })
    if (!existUser) {
        console.log("User not found");
        res.redirect('/login');
        return false
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password)
    if (!isPassEqual) {
        console.log("Password is incorrect");
        res.redirect('/login');
        return false
    }

    console.log(existUser);
    res.redirect('/')
})


export default router