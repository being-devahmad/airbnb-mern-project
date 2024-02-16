const express = require('express')
const app = express()
const port = 8000
const session = require("express-session")
const flash = require("connect-flash")
const path = require('path');

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'))

const sessinOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}
app.use(session(sessinOptions))
app.use(flash())

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
    next()
})

app.get('/register', (req, res) => {
    let { name = 'anonymous' } = req.query
    req.session.name = name
    if (name === 'anonymous') {
        req.flash("error", "user not registered")

    } else {
        req.flash("success", "user registered successfully")
    }
    // res.send(name)
    res.redirect("/hello")
})

app.get("/hello", (req, res) => {
    res.render("view.ejs", { name: req.session.name })
})

// app.get('/reqcount', (req, res) => {
//     if (req.session.count) {
//         req.session.count++
//     } else {
//         req.session.count = 1
//     }

//     res.send(`you send a rquest ${req.session.count} times`)
// })

// app.get('/test', (req, res) => {
//     res.send("test successfull")
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})