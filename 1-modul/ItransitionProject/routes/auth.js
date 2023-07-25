import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import { generateJWTToken } from "../services/token.js"
import signMiddleware from "../middleware/sign.js"
import Message from "../models/Message.js";
import nodemailer from "nodemailer"

const router = Router()
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'Outlook', etc.
    auth: {
        user: 'example@gmail.com',
        pass: process.env.AUTH_PASS,
    },
});


router.get('/register', signMiddleware, (req, res) => {

    res.render('register', {
        title: "APP | Register",
        isRegister: true,
        registerError: req.flash('registerError'),
    })
})

router.get('/login', signMiddleware, (req, res) => {

    res.render('login', {
        title: "APP | Login",
        isLogin: true,
        loginError: req.flash('loginError'),
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie("token")
    res.redirect('/')

})

router.get('/contact', (req, res) => {
    res.render('contact', {
        isContact: true,
    })
})

router.get('/about', (req, res) => {
        res.render('about')
    })
    // Post methods


router.post('/register', async(req, res) => {
    const { firstName, lastName, userImage, email, password, address, country, state, zipCode } = req.body
    if (!firstName || !lastName || !email || !password || !address || !country || !state || !zipCode) {
        req.flash('registerError', "All fileds required")
        res.redirect('/register')
        return
    }

    const isRegistered = await User.findOne({ email })
    if (isRegistered) {
        req.flash('registerError', "User already registred")
        res.redirect('/register')
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userData = {
        firstName: firstName,
        lastName: lastName,
        userImage: userImage,
        email: email,
        password: hashedPassword,
        address: address,
        country: country,
        state: state,
        zipCode: zipCode,
    }

    const user = await User.create(userData)
    const token = generateJWTToken(user._id)
    res.cookie("token", token, { httpOnly: true, secure: true })
    res.redirect('/login')
})


router.post('/login', async(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        req.flash('loginError', "All fileds required")
        res.redirect('/login')
        return
    }
    const exsitUser = await User.findOne({ email })
    if (!exsitUser) {
        req.flash('loginError', "User not found")
        res.redirect('/login')
        return false
    }

    const isPassEqual = await bcrypt.compare(req.body.password, exsitUser.password)
    if (!isPassEqual) {
        req.flash('loginError', 'Password is incorrect! Please try again')
        res.redirect('/login')
        return false
    }
    const token = generateJWTToken(exsitUser._id)
    res.cookie("token", token, { httpOnly: true, secure: true })
    res.redirect('/')
})

router.post('/contact', async(req, res) => {
    const { senderName, senderEmail, senderPhone, message } = req.body
    const messageData = await Message.create(req.body)
    console.log(messageData);

    // Send the email response to the user
    const mailOptions = {
        from: 'uzdev7@gmail.com ', // Sender email address
        to: senderEmail, // Receiver email address (use `senderEmail` here as we're sending a response to the user)
        subject: 'Thank you for contacting us', // Email subject
        text: `Dear ${senderName},\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nBest regards,\nuzdev7 Team`,
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.redirect('/')

})

export default router