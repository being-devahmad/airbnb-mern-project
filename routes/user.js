const express = require('express');
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const UserController = require("../controllers/users")

router.route("/signup")
    .get(UserController.showSignUpForm)
    .post(wrapAsync(UserController.signUpUser))

router.route("/login")
    .get(async (req, res) => { await UserController.showLoginForm(req, res); })
    .post(saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }), UserController.login)



router.get("/logout", UserController.logoutUser)


module.exports = router