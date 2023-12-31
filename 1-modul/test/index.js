import express, { urlencoded } from "express";
import { engine, create } from "express-handlebars"
import mongoose from "mongoose";
import 'dotenv/config'
import session from "express-session";
import flash from "connect-flash"
import cookieParser from "cookie-parser";
import authTokenMiddleware from "./middleware/var.js";
import userMiddleware from "./middleware/user.js"
import hbsHelper from "./utils/index.js"
// Routers
import AuthRouter from "./routes/auth.js"
import ProductsRouter from "./routes/products.js"

const app = express()

//handle barsni shu yerda sozlab olamiz
const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelper,
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

//shu yerda handle barsni sozlamlari tugadi endi uni foydalanish mumkin

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())
app.use(session({ secret: "tatu", resave: false, saveUninitialized: false }))
app.use(authTokenMiddleware)
app.use(userMiddleware)
app.use(flash())
app.use(AuthRouter)
app.use(ProductsRouter)



const startApp = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true
        })
        console.log("Mongo DB connected");

        const PORT = process.env.PORT || 4100
        app.listen(PORT, () => { console.log("Server is running PORT: ", PORT); })
    } catch (error) {
        console.log(error);
    }
}

startApp()