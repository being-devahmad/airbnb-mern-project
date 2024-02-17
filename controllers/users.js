const User = require("../models/user")

const showSignUpForm = async (req, res) => {
    res.render("users/signup.ejs")
}

const signUpUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "User registered successfully")
            res.redirect("/listings")
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
}

const showLoginForm = (req, res) => res.render("users/login.ejs")

const login = (req, res) => {
    try {
        req.flash("success", "Welcome back to WanderLust!!");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
    } catch (error) {
        console.log(error);
    }
}

const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "Successfully logged out")
            res.redirect("/listings")
        }
    })
}

module.exports = { showSignUpForm, signUpUser, showLoginForm, login, logoutUser }