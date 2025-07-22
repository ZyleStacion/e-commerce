const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twofactor = require('node-2fa');
const nodemailer = require('nodemailer');

// Create mail-sending agent for MFA tokens
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_APP_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const secretKey = process.env.RECAPTCHA_SECRET_KEY;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.render('index', { page: { title: 'Home' }, email: 'Guest' });
})

app.get('/login', (req, res) => {
    res.render('login', { page: { title: 'Login' }});
})

app.post('/login', (req, res) => {
    const email = req.body.email;

    // Create a new secret
    const secret = twofactor.generateSecret({ account: email });

    // Create a new token and send it to the user
    const token = twofactor.generateToken(secret.token);

    // Get user input token and verify it
    const userToken = req.body.userToken;

    if (twofactor.verifyToken(userToken).delta == 0) {
        // Token is correct
        res.render('index', { page: { title: 'Home' }, email: email });
    } else {
        res.render('login', { page: { title: 'Login' }, error: 'Invalid MFA token.', email: email});
    }
})

app.get('/register', (req, res) => {
    res.render('register', { page: { title: 'Register' }})
})

app.get('/products', (req, res) => {
    res.render('products', { page: { title: 'Products' }})
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
            // Log the score
            console.log(google_response.score);
            
            // Response is successful
            if (google_response.success) {
                return res.render('index', {page: 'Home', email: email})
            } else {
                return res.send("Invalid Captcha!");
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

