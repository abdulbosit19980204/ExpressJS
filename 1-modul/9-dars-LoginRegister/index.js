import express from "express";
import { engine, create } from "express-handlebars"
import AuthRoutes from "./routes/auth.js"
import ProductsRoutes from "./routes/products.js"
const app = express()

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
app.use(AuthRoutes);
app.use(ProductsRoutes)

const PORT = process.env.PORT || 4100
app.listen(PORT, () => { console.log(`Server is running on port: ${PORT}`); })