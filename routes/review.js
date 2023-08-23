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

// routes /review/
router.post('/form/:id', allowOnlyAuth, async (req, res) => {
    let formId = req.params.id
    let userId = req.session.user.id
    const hasRated = await User.hasRatedForm(userId, formId)
    // console.log(hasRated)
    if(!hasRated.info || hasRated.owner || hasRated.rated){
        // not eligible , to know
        return res.redirect('/form/' + formId)
    }

    // eligible
    let desc = req.body.desc
    let rating = Number(req.body.rating)
    const reviewResponse = await Review.createReview(formId, userId, rating, desc)
    // console.log(reviewResponse)
    if(!reviewResponse.created){
        // not created , to retry
        return res.redirect('/form/' + formId)
    }

    const userResponse = await User.addReview(userId, reviewResponse.id)
    // console.log(userResponse)
    if(!userResponse.added){
        // not added to user so delete
        const ReviewdeleteResponse1 = await Review.deleteReview(reviewResponse.id)
        if(!ReviewdeleteResponse1.deleted){
            console.log("unused review is present in database, id: " + reviewResponse.id)
            console.log(ReviewdeleteResponse1)      
            
        }
        // deleted or not but retry
        return res.redirect('/form/' + formId)
    }

    //added to user so update form
    const formResponse = await Form.addReview(formId, reviewResponse.id)
    // console.log(formResponse)
    if(!formResponse.added){
        // not added to form so delete
        const ReviewdeleteResponse2 = await Review.deleteReview(reviewResponse.id)
        if(!ReviewdeleteResponse2.deleted){
            console.log("unused review is present in database & exists in user object's reviews array too, id: " + reviewResponse.id)
            console.log(ReviewdeleteResponse2)      
        }
        // deleted or not but retry
        return res.redirect('/form/' + formId)
    }
    // success
    // console.log("success")
    return res.redirect('/form/' + formId)
})

module.exports = router