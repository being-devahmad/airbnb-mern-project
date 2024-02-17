const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const app = express();
const port = 3000;
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


const sessinOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(session(sessinOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to database successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}
main();


app.use(express.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})


app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/" , userRouter)

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"))
})

// err middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err
    res.status(status).render("error.ejs", { message })
    // res.status(status).send(message)
    // res.send("something went wrong")
})

// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
