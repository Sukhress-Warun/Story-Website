// packages
const mongoose = require('mongoose')

// schema
const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    desc: {
        type:String
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    story: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Story',
        required: true
    }
})

// static-methods
ReviewSchema.statics.createReview = async function(storyId, authorId, rating, desc){
    const response = {
        created: false,
        message: "",
        id: ""
    }
    try{
        const review = await this.create({
            rating: rating,
            desc: desc,
            author: authorId,
            story: storyId
        })
        response.created = true
        response.message = "ok"
        response.id = review._id
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

ReviewSchema.statics.deleteReview = async function(reviewId){
    const response = {
        deleted: false,
        message: ""
    }
    const reviewExist = await this.exists({_id: reviewId})
    if(!reviewExist){
        response.message = "review doesn't exist"
        return response
    }
    try{
        await this.deleteOne({_id: reviewId})
        response.deleted = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

module.exports = mongoose.model('Review', ReviewSchema)