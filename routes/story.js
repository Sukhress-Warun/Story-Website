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

// routes /story/
router.get('/create', allowOnlyAuth, async (req, res) => {
    return res.render("story/create.pug",{attempted: false})
})

router.post('/create', allowOnlyAuth, async (req, res) => {
    let title = req.body.title
    let desc = req.body.desc
    let content = req.body.content
    let author = req.session.user.id
    const storyResponse = await Story.createStory(title, desc, content, author)
    if(!storyResponse.created){
        return res.render("story/create.pug",{attempted: true, message: storyResponse.message})
    }
    const userResponse = await User.addStory(author, storyResponse.id)
    if(!userResponse.added){
        const storyDeleteResponse = await Story.deleteStory(storyResponse.id)
        if(!storyDeleteResponse.deleted){
            console.log("unused story is present in database, id: " + storyResponse.id)
            console.log(storyDeleteResponse)
        }
        return res.render("story/create.pug",{attempted: true, message: userResponse.message})
    }
    return res.redirect("/story/" + storyResponse.id)
})

router.get('/', async (req, res) => {
    const limit = 10
    const storiesResponse = await Story.getAllStories(limit)
    return res.render("story/allStories.pug",{retrieved: storiesResponse.retrieved, stories: storiesResponse.stories, message: storiesResponse.message})
})

router.get('/:id', async (req, res) => {
    const limit = 10
    let storyId = req.params.id
    const storyResponse = await Story.getStory(storyId, limit)
    const userState = {
        info: false,
        message: "",
        auth: false,
        id: "",
        owner: false,
        rated: false,
        review: null
    }
    if(req.session.user !== undefined){
        userState.auth = true
        userState.id = req.session.user.id
        if(storyResponse.retrieved){
            const hasRated = await User.hasRatedStory(userState.id, storyId, true)
            if(hasRated.info){
                userState.info = true
                userState.owner = hasRated.owner
                userState.rated = hasRated.rated
                userState.review = hasRated.review
                if(userState.rated){
                    let indexOfReview = -1
                    for(let i = 0 ; i < storyResponse.story.reviews.length ; i++){
                        if(storyResponse.story.reviews[i]._id.toString() === userState.review._id.toString()){
                            indexOfReview = i
                        }
                    }
                    if(indexOfReview !== -1){
                        storyResponse.story.reviews.splice(indexOfReview, 1)
                    }
                }
            }
            else{
                userState.message = hasRated.message
            }
        }
    }
    return res.render("story/singleStory.pug",{retrieved: storyResponse.retrieved, message: storyResponse.message, story: storyResponse.story, userState: userState})
})

module.exports = router