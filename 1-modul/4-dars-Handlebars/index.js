import express from "express";
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { engine } from "express-handlebars"

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = dirname(__filename)
const app = express()

//Handlebars shu yerda sozlanyapti
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Shu yerda handlebars sozlandi

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, "views", "index.html"))
    res.render('index')

})
app.get('/about', (req, res) => {
    // res.sendFile(path.join(__dirname, "views", "about.html"))
    res.render('about')
})

const PORT = process.env.PORT || 4100
app.listen(PORT, () => { console.log(`Server is running on port: ${PORT}`); })