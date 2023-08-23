// packages
const express = require('express')

// constants
const router = express.Router()

// models
const Form = require('../models/form')
const User = require('../models/user')
const Review = require('../models/review')

// sessions middlewares
const {allowOnlyAuth} = require('../sessions')

// routes /form/
router.get('/create', allowOnlyAuth, async (req, res) => {
    return res.render("form/create.pug",{attempted: false})
})

router.post('/create', allowOnlyAuth, async (req, res) => {
    let title = req.body.title
    let desc = req.body.desc
    let author = req.session.user.id
    const formResponse = await Form.createForm(title, desc, author)
    if(!formResponse.created){
        return res.render("form/create.pug",{attempted: true, message: formResponse.message})
    }
    const userResponse = await User.addForm(author, formResponse.id)
    if(!userResponse.added){
        const formDeleteResponse = await Form.deleteForm(formResponse.id)
        if(!formDeleteResponse.deleted){
            console.log("unused form is present in database, id: " + formResponse.id)
            console.log(formDeleteResponse)
        }
        return res.render("form/create.pug",{attempted: true, message: userResponse.message})
    }
    return res.redirect("/form/" + formResponse.id)
})

router.get('/', async (req, res) => {
    const limit = 10
    const formsResponse = await Form.getAllForms(limit)
    return res.render("form/allForms.pug",{retrieved: formsResponse.retrieved, forms: formsResponse.forms, message: formsResponse.message})
})

router.get('/:id', async (req, res) => {
    let formId = req.params.id
    // * getting single form can give few reviews instead of all , but its must to give review of requesting user. to fix 2 db access required
    const formResponse = await Form.getFullForm(formId)
    // todo calculate avg rating efficiently , it calculates for every reqst's every review . 
    let averageRating = 0
    if(formResponse.retrieved){
        for(i = 0 ; i < formResponse.form.reviews.length ; i++){
            averageRating += Number(formResponse.form.reviews[i].rating)
        }
        averageRating /= (formResponse.form.reviews.length >= 1) ? formResponse.form.reviews.length : 1
    }
    const userState = {
        auth: false,
        id: "",
        owner: false,
        rated: false,
        review: null
    }
    if(req.session.user !== undefined){
        userState.auth = true
        userState.id = req.session.user.id
        if(formResponse.retrieved){
            if(formResponse.form.author._id.equals(userState.id)){
                userState.owner = true
            }
            else{
                let i
                for(i = 0 ; i < formResponse.form.reviews.length ; i++){
                    if(formResponse.form.reviews[i].author._id.equals(userState.id)){
                        userState.rated = true
                        userState.review = formResponse.form.reviews[i]
                        break
                    }
                }
                if(userState.rated){
                    formResponse.form.reviews.splice(i, 1)
                }
            }
        }
    }
    return res.render("form/singleForm.pug",{retrieved: formResponse.retrieved, message: formResponse.message, form: formResponse.form, averageRating: averageRating, userState: userState})
})

module.exports = router