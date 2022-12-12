require('dotenv').config()
const express  = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    stripe     = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/success', (req, res)=>{
    res.render('success');
});

app.post('/charge', (req, res)=>{
    const amount = 50;
    //console.log(req.body);
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: 'Payment with stripe',
        currency: 'inr',
        customer: customer.id
    }))
    .then(charge => res.render('success'));
});

const port = process.env.PORT || 8080;
const ip = process.env.IP || "0.0.0.0"
app.listen(port, ip, ()=>{
    console.log(`Server has started at ${ip}:${port}`)
});