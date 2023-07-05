import express from "express";
import { engine, create } from "express-handlebars"
import AuthRouter from "./routes/auth.js"
import ProductsRouter from "./routes/products.js"
const app = express()

//handle barsni shu yerda sozlab olamiz
const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

//shu yerda handle barsni sozlamlari tugadi endi uni foydalanish mumkin

// Middlewares
app.use(AuthRouter)
app.use(ProductsRouter)



const PORT = process.env.PORT || 4100
app.listen(PORT, () => { console.log("Server is running PORT: ", PORT); })