const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const secretKey = process.env.RECAPTCHA_SECRET_KEY;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.render('index', { page: { title: 'Home'}, email: 'Guest' });
})

app.get('/login', (req, res) => {
    res.render('login', { page: { title: 'Login'}})
})

app.get('/register', (req, res) => {
    res.render('register', { page: { title: 'Register'}})
})

app.get('/products', (req, res) => {
    res.render('products', { page: { title: 'Products'}})
})

app.post('/register', (req, res) => {
    const recaptchaToken = req.body['g-recaptcha-response'];
    const email = req.body.email;

    // Verify successful Captcha
    // Ask Google to verify our secret key and recaptcha client-side response
    const response = fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`, {
        method: 'POST',
    })
        // Process the .json response into the server
        .then((response => response.json()))
        .then((google_response) => {
            // Response is successful
            if (google_response.success) {
                return res.render('index', {page: 'Home', email: email})
            } else {
                return res.send("Invalid Captcha!")
            }
        })
        .catch((error) => {
            return res.json({ error });
        });
})

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

