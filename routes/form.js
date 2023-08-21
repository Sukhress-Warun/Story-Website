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
    const formResponse = await Form.getForm(formId)
    return res.render("form/singleForm.pug",{retrieved: formResponse.retrieved, message: formResponse.message, form: formResponse.form})
})

module.exports = router