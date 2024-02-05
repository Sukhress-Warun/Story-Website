// packages
const mongoose = require('mongoose')
const bcrypt = require ('bcrypt')

// schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    stories: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Story'
    }],
    reviews: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Review'
    }],
})

// hooks
UserSchema.pre('save', function(next) {
    this.increment();
    return next();
})

// static-methods
UserSchema.statics.createUser = async function (name, about, email, password){
    const response = {
        created: false,
        message: "",
        id: ""
    }
    const userExist = await this.exists({email: email})
    if(userExist){
        response.message = "email already exist"
        return response
    }
    try{
        password = await bcrypt.hash(password, 10)
        const user = await this.create({
            name: name,
            about: about,
            email: email,
            password: password
        })
        response.created = true
        response.message = "ok"
        response.id = user._id
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

UserSchema.statics.authenticate = async function (email, password) {
    const response = {
        auth: false,
        message: "",
        id: ""
    }
    const user = await this.findOne({email: email})
    if(user === null){
        response.message = "email doesn't exist"
        return response
    }
    let result = await bcrypt.compare(password, user.password)
    if(!result){
        response.message = "incorrect password"
        return response
    }
    response.auth = true
    response.message = "ok"
    response.id = user._id
    return response
}

UserSchema.statics.getUser = async function (userId){
    const response = {
        info: false,
        message: "",
        user: null
    }
    try{
        const user = await this.findById(userId)
        if(user === null){
            response.message = "user doesn't exist"
            return response
        }
        response.info = true
        response.message = "ok"
        response.user = {
            name: user.name,
            about: user.about 
        }
        return response
    }
    catch(err){
        response.message = "server error " + err
        return response
    }
}

UserSchema.statics.updateUser = async function (userId, name, about, password){
    const response = {
        info: false,
        message: "",
        updated: false,
        updateMessage: "",
        name: "",
        about: "" 
    }
    try{
        const user = await this.findById(userId)
        if(user === null){
            response.message = "user doesn't exist"
            return response
        }
        let result = await bcrypt.compare(password, user.password)
        if(!result){
            response.info = true
            response.updateMessage = "incorrect password"
            response.name = user.name
            response.about = user.about
            return response
        }
        let changed = false
        if(name.trim() !== "" && user.name != name){
            user.name = name
            changed = true
        }
        if(about.trim() !== "" && user.about != about){
            user.about = about
            changed = true
        }
        if(changed){
            await user.save()
            response.info = true
            response.updateMessage = "changed successfully"
            response.updated = true
            response.name = user.name
            response.about = user.about
            return response
        }
        else{
            response.info = true
            response.name = user.name
            response.about = user.about
            response.updateMessage = "not changed"
            return response
        }
    }
    catch(err){
        response.message = "server error " + err
        return response
    }

}

UserSchema.statics.addStory = async function (author, storyId){
    const response = {
        added: false,
        message: ""
    }
    try{
        const user = await this.findById(author)
        if(user === null){
            response.message = "user doesn't exist"
            return response
        }
        user.stories.push(storyId)
        await user.save()
        response.added = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

UserSchema.statics.hasRatedStory = async function(userId, storyId, getReview){
    const response = {
        info: false,
        message: "",
        owner: false,
        rated: false,
        review: null
    }
    try{
        const user = await this.findById(userId)
        if(user.stories.length >= 1){
            let foundOwning = user.stories.find((ele) => {
                return (ele.toString() === storyId.toString())
            })
            if(foundOwning !== undefined){
                response.owner = true
                response.info = true
                return response
            }
        }
        if(!response.owner){
            await user.populate("reviews")
            if(user.reviews.length <= 0){
                response.rated = false
                response.info = true
                return response
            }
            else{
                let foundRating = user.reviews.find((ele) => {
                    return (ele.story.toString() === storyId.toString())
                })
                if(foundRating !== undefined){
                    response.rated = true
                    if(getReview){
                        user.reviews = [foundRating]
                        await user.populate({
                            path: 'reviews.author',
                            model: 'User',
                            select: 'name _id'
                        })
                        response.review = user.reviews[0]
                    }
                    response.info = true
                    return response
                }
                else{
                    response.rated = false
                    response.info = true
                    return response
                }
            }
        }
    }
    catch(err){
        response.message = "server error " + err
        return response
    }
}

UserSchema.statics.addReview = async function(userId, reviewId){
    const response = {
        added: false,
        message: ""
    }
    try{
        const user = await this.findById(userId)
        if(user === null){
            response.message = "user doesn't exist"
            return response
        }
        user.reviews.push(reviewId)
        await user.save()
        response.added = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response 
}

UserSchema.statics.deleteReview = async function(userId, reviewId){
    const response = {
        deleted: false,
        message: ""
    }
    try{
        const user = await this.findById(userId)
        if(user === null){
            response.message = "user doesn't exist"
            return response
        }
        let index = user.reviews.indexOf(reviewId)
        if(index === -1){
            response.message = "review doesn't exist"
            return response
        }
        user.reviews.splice(index, 1)
        await user.save()
        response.deleted = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response 
}

UserSchema.statics.getAboutUser = async function (userId){
    const response = {
        retrieved: false,
        message: "",
        aboutUser: {
            name: "",
            about: "",
            stories: []
        }
    }
    try{
        const userExist = await this.exists({_id: userId})
        if(!userExist){
            response.message = "user doesn't exist"
            return response
        }
        const user = await this.findById(userId).populate("stories", "-reviews -content -author")
        user.stories.reverse()
        response.retrieved = true
        response.message = "ok"
        response.aboutUser.name = user.name
        response.aboutUser.about = user.about
        response.aboutUser.stories = user.stories
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

UserSchema.statics.getReviews = async function (userId){
    const response = {
        retrieved: false,
        message: "",
        reviews: null
    }
    try{
        const user = await this.findById(userId)
        if(user === null){
            response.message = "user doesn't exist"
            return response
        }
        await user.populate({
            path: 'reviews',
            model: 'Review',
            select: '-author',
            populate: {
                path: 'story',
                model: 'Story',
                select: '-content -reviews',
                populate: {
                    path: 'author',
                    model: 'User',
                    select: 'name _id'
                }
            } 
        })
        user.reviews.reverse()
        response.reviews = user.reviews
        response.retrieved = true
        response.message = "ok"
        return response
    }
    catch(err){
        response.message = "server error " + err
        return response
    }
}

module.exports = mongoose.model('User', UserSchema)