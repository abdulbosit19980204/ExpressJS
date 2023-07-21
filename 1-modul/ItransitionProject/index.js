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
import TradeRouter from "./routes/trade.js"
import CartRouter from "./routes/cartRoutes.js"
import LikedRouter from "./routes/liked.js"




const app = express()

//start of the handlebars setting
const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelper,
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

//This is the end of the handlebars setting as a hbs

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
app.use(TradeRouter)
app.use(CartRouter)
app.use(LikedRouter)



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