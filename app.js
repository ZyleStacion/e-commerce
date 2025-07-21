const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.render('index', { page: { title: 'Home'}});
})

app.get('/login', (req, res) => {
    res.render('login', { page: { title: 'Register'}})
})

app.get('/register', (req, res) => {
    res.render('register', { page: { title: 'Register'}})
})

app.get('/products', (req, res) => {
    res.render('products', { page: { title: 'Products'}})
})

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

