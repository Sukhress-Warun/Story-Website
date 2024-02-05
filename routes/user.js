// packages
const express = require('express')

// constants
const router = express.Router()

// models
const User = require('../models/user')

// sessions middlewares
const {allowOnlyUnauth, allowOnlyAuth} = require('../sessions')

// routes /user/
router.get('/', async (req, res) => {
    return res.send("user")
})

router.get('/signup', allowOnlyUnauth, async (req, res) => {
    return res.render("user/signup.pug",{attempted: false})
})

router.post('/signup', allowOnlyUnauth, async (req, res) => {
    let name = req.body.name
    let about = req.body.about
    let email = req.body.email
    let password = req.body.password
    const response = await User.createUser(name, about, email, password)
    if(response.created){
        req.session.user = {
            auth: response.created,
            id: response.id
        }
        return res.redirect("/")
    }
    else{
        return res.render("user/signup.pug",{attempted: true, message: response.message})
    }
})

router.get('/login', allowOnlyUnauth, async (req, res) => {
    return res.render("user/login.pug",{attempted: false})
})

router.post("/login", allowOnlyUnauth, async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    const response = await User.authenticate(email, password)
    if(response.auth){
        req.session.user = {
            auth: response.auth,
            id: response.id
        }
        return res.redirect("/")
    }
    else{
        return res.render('user/login.pug',{attempted: true, message: response.message})
    }
})

router.get("/signout", async (req, res) => {
    if(req.session.user !== undefined){
        req.session.destroy()
    }
    res.redirect('/')
})

router.get("/edit", allowOnlyAuth, async (req, res) => {
    let userId = req.session.user.id
    const userResponse = await User.getUser(userId)
    res.render("user/edit.pug",{info: userResponse.info, message: userResponse.message, name: userResponse.user.name, about: userResponse.user.about})
})

router.post("/edit", allowOnlyAuth, async (req, res) => {
    let userId = req.session.user.id
    let name = req.body.name
    let about = req.body.about
    let password = req.body.password
    const userResponse = await User.updateUser(userId, name, about, password)
    res.render("user/edit.pug",{info: userResponse.info, message: userResponse.message, name: userResponse.name, about: userResponse.about, attempted: true, attemptMessage: userResponse.updateMessage})
})

router.get("/:id/about", async (req, res) => {
    const userResponse = await User.getAboutUser(req.params.id)
    res.render("user/about.pug",{retrieved: userResponse.retrieved, message: userResponse.message, aboutUser: userResponse.aboutUser})
})

router.get("/aboutme", allowOnlyAuth, async (req, res) => {
    const userResponse = await User.getAboutUser(req.session.user.id)
    res.render("user/about.pug",{retrieved: userResponse.retrieved, message: userResponse.message, aboutUser: userResponse.aboutUser})
})

router.get("/reviews", allowOnlyAuth, async (req, res) => {
    let userId = req.session.user.id
    const userResponse = await User.getReviews(userId)
    res.render("user/reviews.pug",{retrieved: userResponse.retrieved, message: userResponse.message, reviews: userResponse.reviews})
})

module.exports = router