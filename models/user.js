// packages
const mongoose = require('mongoose')

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
    forms: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Form'
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
UserSchema.statics.createUser = async function (name, email, password){
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
        const user = await this.create({
            name: name,
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
    if(user.password !== password){
        response.message = "incorrect password"
        return response
    }
    response.auth = true
    response.message = "ok"
    response.id = user._id
    return response
}

UserSchema.statics.addForm = async function (author, formId){
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
        user.forms.push(formId)
        await user.save()
        response.added = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

UserSchema.statics.hasRatedForm = async function(userId, formId){
    const response = {
        info: false,
        message: "",
        owner: false,
        rated: false
    }
    try{
        const user = await this.findById(userId)
        if(user.forms.length >= 1){
            let foundOwning = user.forms.find((ele) => {
                return (ele.toString() === formId.toString())
            })
            if(foundOwning !== undefined){
                response.owner = true
                response.info = true
                return response
            }
        }
        if(!response.owner){
            await user.populate("reviews", "form")
            if(user.reviews.length <= 0){
                response.rated = false
                response.info = true
                return response
            }
            else{
                let foundRating = user.reviews.find((ele) => {
                    return (ele.form.toString() === formId.toString())
                })
                if(foundRating !== undefined){
                    response.rated = true
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

module.exports = mongoose.model('User', UserSchema)