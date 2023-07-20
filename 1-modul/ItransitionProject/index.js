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

// Thrid type auth
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


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


// Third type auth setting
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy({
            clientID: "521485029690-8ef25d7c887q95cih670p9sj0urfhite.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "https://itransitionproject.onrender.com/",
        },
        (accessToken, refreshToken, profile, done) => {
            // This function will be called when a user is authenticated
            // You can handle the user's profile data and save it to your database
            // For example, you can create or find the user in your database and call done(null, user).
            // The 'user' object will be serialized and stored in the session.
            return done(null, profile);
        }
    )
);
// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


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