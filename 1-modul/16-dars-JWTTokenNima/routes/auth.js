import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
const router = Router()

router.get('/register', (req, res) => {
    res.render('register', {
        title: "APP | Register ",
        isRegister: true,
        registerError: req.flash('registerError')
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
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) {
        req.flash('registerError', "All fields required")
        res.redirect('/register')
        return
    }
    const candidate = User.findOne({ email })
    if (candidate) {
        req.flash('registerError', "User already registred")
        res.redirect('/register')
        return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
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
        res.redirect('/login')
        return
    }
    const existUser = await User.findOne({ email })
    if (!existUser) {
        req.flash("loginError", "User not found")
        res.redirect('/login')
        return false
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password)
    if (!isPassEqual) {
        req.flash("loginError", "Password is incorrect")
        res.redirect('/login')
        return false
    }

    console.log(existUser);
    res.redirect('/')
})


export default router