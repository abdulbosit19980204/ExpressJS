import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import signMiddleware from "../middleware/sign.js"
import { generateJWTToken } from "../services/token.js";
const router = Router()

router.get('/register', signMiddleware, (req, res) => {

    res.render('register', {
        title: "APP | Register ",
        isRegister: true,
        registerError: req.flash('registerError')
    })
})

router.get('/login', signMiddleware, (req, res) => {

    res.render('login', {
        title: "APP | Login",
        isLogin: true,
        loginError: req.flash('loginError')
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie("token")
    res.redirect('/')
})

// Post methods

router.post('/register', async(req, res) => {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) {
        req.flash('registerError', 'All fields required')
        res.redirect('/register')
        return
    }

    const isRegistred = await User.findOne({ email })
    if (isRegistred) {
        req.flash('registerError', 'User already registred');
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
    const token = generateJWTToken(user._id)
    res.cookie("token", token, { httpOnly: true, secure: true })
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
    const token = generateJWTToken(existUser._id)
    res.cookie("token", token, { httpOnly: true, secure: true })
    res.redirect('/')
})


export default router