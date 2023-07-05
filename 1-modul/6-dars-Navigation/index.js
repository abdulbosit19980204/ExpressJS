import express from "express";
import { engine, create } from "express-handlebars"


const app = express()

//Handlebars shu yerda sozlanyapti
const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

// Shu yerda handlebars sozlandi

app.get('/', (req, res) => {
    res.render('index')

})
app.get('/about', (req, res) => {
    res.render('about')
})

const PORT = process.env.PORT || 4100
app.listen(PORT, () => { console.log(`Server is running on port: ${PORT}`); })