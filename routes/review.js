// packages
const express = require('express')

// constants
const router = express.Router()

// models
const Story = require('../models/story')
const User = require('../models/user')
const Review = require('../models/review')

// sessions middlewares
const {allowOnlyAuth} = require('../sessions')

// routes /review/
router.post('/story/:id', allowOnlyAuth, async (req, res) => {
    let storyId = req.params.id
    let userId = req.session.user.id
    const hasRated = await User.hasRatedStory(userId, storyId, false)
    // console.log(hasRated)
    if(!hasRated.info || hasRated.owner || hasRated.rated){
        // not eligible , to know
        return res.redirect('/story/' + storyId)
    }

    // eligible
    let desc = req.body.desc
    let rating = Number(req.body.rating)
    const reviewResponse = await Review.createReview(storyId, userId, rating, desc)
    // console.log(reviewResponse)
    if(!reviewResponse.created){
        // not created , to retry
        return res.redirect('/story/' + storyId)
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
        return res.redirect('/story/' + storyId)
    }

    //added to user so update story
    const storyResponse = await Story.addReview(storyId, reviewResponse.id, rating)
    // console.log(storyResponse)
    if(!storyResponse.added){
        // not added to story so delete
        const ReviewdeleteResponse2 = await Review.deleteReview(reviewResponse.id)
        if(!ReviewdeleteResponse2.deleted){
            console.log("unused review is present in database & exists in user object's reviews array too, id: " + reviewResponse.id)
            console.log(ReviewdeleteResponse2)      
        }
        // deleted or not but retry
        return res.redirect('/story/' + storyId)
    }
    // success
    // console.log("success")
    return res.redirect('/story/' + storyId)
})

router.post('/:reviewId/story/:storyId/edit', allowOnlyAuth, async (req, res) => {
    let storyId = req.params.storyId
    let userId = req.session.user.id
    let reviewId = req.params.reviewId
    const hasRated = await User.hasRatedStory(userId, storyId, true)
    if(!hasRated.info || (hasRated.info && (hasRated.owner || !hasRated.rated))){
        return res.redirect('/story/' + storyId)
    }
    if(hasRated.review._id.toString() !== reviewId){
        return res.redirect('/story/' + storyId)
    }
    reviewId = hasRated.review._id
    let deleteReview = Boolean(req.body.delete)
    if(!deleteReview){
        let desc = req.body.desc
        let rating = Number(req.body.rating)
        const reviewResponse = await Review.updateReview(reviewId, rating, desc)
        if(!reviewResponse.updated){
            return res.redirect('/story/' + storyId)
        }
        const storyResponse = await Story.updateReview(storyId, hasRated.review, rating)
        if(!storyResponse.updated){
            console.log(reviewResponse)
            console.log(storyResponse)
        }
        return res.redirect('/story/' + storyId)
    }
    else{
        const reviewResponse = await Review.deleteReview(reviewId)
        if(!reviewResponse.deleted){
            return res.redirect('/story/' + storyId)
        }
        const userResponse = await User.deleteReview(userId, reviewId)
        if(!userResponse.deleted){
            console.log("deleted pointer of review is present in user"+userId)
            console.log(userResponse)
        }
        const storyResponse = await Story.deleteReview(storyId, hasRated.review)
        if(!storyResponse.deleted){
            console.log("deleted pointer of review is present in story"+storyId)
            console.log(storyResponse)
        }
        return res.redirect('/story/' + storyId)
    }
})

module.exports = router