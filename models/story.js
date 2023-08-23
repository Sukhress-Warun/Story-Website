// packages
const mongoose = require('mongoose') 

// schema
const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    reviews: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Review"
    }]
})

// hooks
StorySchema.pre('save', function(next) {
    this.increment();
    return next();
})

// static-methods
StorySchema.statics.createStory = async function(title, content, author){
    const response = {
        created: false,
        message: "",
        id: ""
    }
    const storyExist = await this.exists({title: title, author: author}) // * can use user model to reduce query time but, need to populate user object's fields 
    if(storyExist){
        response.message = "you used this title already"
        return response
    }
    try{
        const story = await this.create({
            title: title,
            content: content,
            author: author
        })
        response.created = true
        response.message = "ok"
        response.id = story._id
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

StorySchema.statics.deleteStory = async function(storyId){
    const response = {
        deleted: false,
        message: ""
    }
    const storyExist = await this.exists({_id: storyId})
    if(!storyExist){
        response.message = "story doesn't exist"
        return response
    }
    try{
        await this.deleteOne({_id: storyId})
        response.deleted = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

StorySchema.statics.getAllStories = async function(limit){
    const response = {
        retrieved: false,
        message: "",
        stories: []
    }
    const stories = await this.find({}).sort({_id: -1}).limit(limit).populate("author", "name")
    if(stories.length == 0){
        response.message = "no stories exist"
        return response
    }
    response.retrieved = true
    response.message = "ok"
    response.stories = stories
    return response
}

StorySchema.statics.getStory = async function(storyId){
    const response = {
        retrieved: false,
        message: "",
        story: null
    }
    try{
        const storyExist = await this.exists({_id: storyId})
        if(!storyExist){
            response.message = "story doesn't exist"
            return response
        }
        const story = await this.findById(storyId).populate("author", "name _id").populate("reviews", "-story")
        await story.populate("reviews.author", "name _id") 
        response.retrieved = true
        response.message = "ok"
        response.story = story
        return response
    }
    catch(err){
        if(err.name === "CastError"){
            response.message = "invalid id"
            return response
        }
        else{
            response.message = "server error " + err
            return response
        }
    }
}

// * if more users try to submit then , more failures would occur 
StorySchema.statics.addReview = async function(storyId, reviewId){
    const response = {
        added: false,
        message: ""
    }
    try{
        const story = await this.findById(storyId)
        if(story === null){
            response.message = "story doesn't exist"
            return response
        }
        story.reviews.push(reviewId)
        await story.save()
        response.added = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response 
}

module.exports = mongoose.model('Story', StorySchema)