import { Router } from "express"
import User from "../models/User.js"
import bcrypt from "bcryptjs"


const router = Router()

router.get('/setting', async(req, res) => {

    const userData = await User.findById(req.userId).lean()
    res.render('setting', {
        userData: userData,
        isSetting: true,
        settingError: req.flash('settingError')
    })
})


router.post('/setting', async(req, res) => {
    const { firstName, lastName, email, password, userImage, address, country, state, zipCode } = req.body
    const plainTextData = password
    const userData = await User.findById(req.userId).lean()
    const hashedData = userData.password
    bcrypt.compare(plainTextData, hashedData, async(err, isMatch) => {
        if (err) {
            console.error('Error comparing data:', err);
            req.flash('settingError', "Error ocure during comparing password")
            res.redirect('/setting')
            return;
        }
        if (isMatch) {
            console.log('Data matches!');
            req.flash('settingError', "Data saved successfully")
                // The original data matches the hashed data
            const hashedPassword = await bcrypt.hash(password, 10)
            let editedProduct = {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                userImage,
                address,
                country,
                state,
                zipCode,
            };
            await User.findByIdAndUpdate(req.userId, editedProduct)
            res.redirect('/setting')
        } else {
            console.log('Data does not match!');
            req.flash('settingError', "Password is wrong!")
            res.redirect('/setting')
                // The original data does not match the hashed data
        }

    })


})

router.post('/delete-account/:userId', async(req, res) => {

    const { password } = req.body
    const plainTextData = password
    const userData = await User.findById(req.userId).lean()
    const hashedData = userData.password
    bcrypt.compare(plainTextData, hashedData, async(err, isMatch) => {
        if (err) {
            console.error('Error comparing data:', err);
            req.flash('settingError', "Error ocure during comparing password")
            res.redirect('/setting')
            return;
        }
        if (isMatch) {
            console.log('Data matches!');
            req.flash('settingError', "Data saved successfully")
                // The original data matches the hashed data
            await User.findByIdAndRemove(req.userId)
            res.clearCookie("token")
            res.redirect('/')
        } else {
            console.log('Data does not match!');
            req.flash('settingError', "Password is wrong!")
            res.redirect('/setting')

        }

    })






    // await User.findByIdAndRemove(req.userId)
    // res.clearCookie("token")
    // res.redirect('/')
    // res.redirect('/setting')

})

export default router