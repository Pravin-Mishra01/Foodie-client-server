const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

// connecting mongodb
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@foodie-client.18mmima.mongodb.net/Foodie-client?retryWrites=true&w=majority`
    )
    .then(console.log("Database is connected"))
    .catch((error) => console.log("Not Connected", error));

// jwt authentication
app.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1hr'
    })
    res.send({ token });
})

// import routes here

const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
const bookingRoutes = require("./api/routes/bookingRoutes")
app.use("/menu", menuRoutes)
app.use("/carts", cartRoutes)
app.use("/users", userRoutes)
app.use("/payments", paymentRoutes)
app.use("/bookings", bookingRoutes)

// Stripe payment routes
app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr",
        payment_method_types: ["card",],

    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});


app.get("/", (req, res) => {
    res.send("Hello Customer!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
