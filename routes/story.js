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
    let content = req.body.content
    let author = req.session.user.id
    const storyResponse = await Story.createStory(title, content, author)
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
    let storyId = req.params.id
    // * getting single story can give few reviews instead of all , but its must to give review of requesting user. to fix 2 db access required
    const storyResponse = await Story.getStory(storyId)
    // todo calculate avg rating efficiently , it calculates for every reqst's every review . 
    let averageRating = 0
    if(storyResponse.retrieved){
        for(i = 0 ; i < storyResponse.story.reviews.length ; i++){
            averageRating += Number(storyResponse.story.reviews[i].rating)
        }
        averageRating /= (storyResponse.story.reviews.length >= 1) ? storyResponse.story.reviews.length : 1
    }
    averageRating = averageRating.toFixed(1)
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
        if(storyResponse.retrieved){
            if(storyResponse.story.author._id.equals(userState.id)){
                userState.owner = true
            }
            else{
                let i
                for(i = 0 ; i < storyResponse.story.reviews.length ; i++){
                    if(storyResponse.story.reviews[i].author._id.equals(userState.id)){
                        userState.rated = true
                        userState.review = storyResponse.story.reviews[i]
                        break
                    }
                }
                if(userState.rated){
                    storyResponse.story.reviews.splice(i, 1)
                }
            }
        }
    }
    return res.render("story/singleStory.pug",{retrieved: storyResponse.retrieved, message: storyResponse.message, story: storyResponse.story, averageRating: averageRating, userState: userState})
})

module.exports = router