import express from "express";
import { engine, create } from "express-handlebars"
import mongoose from "mongoose";
import AuthRoutes from "./routes/auth.js"
import ProductsRoutes from "./routes/products.js"
import flash from "connect-flash"
// import * as dotenv from 'dotenv'
// dotenv.config()
import 'dotenv/config'
const app = express() // app is exemplar from express

//Handlebars setting
const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

// Handlebars setting is done

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())
app.use(flash())
app.use(AuthRoutes);
app.use(ProductsRoutes)

// MongoDB is connecting via Mongoose here


const startApp = () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true

        })
        console.log("Mongo DB connected");
        // server is running here
        const PORT = process.env.PORT || 4100
        app.listen(PORT, () => { console.log(`Server is running on port: ${PORT}`); })
    } catch (error) {
        console.log(error);
    }
}

startApp()