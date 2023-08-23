// packages
const mongoose = require('mongoose') 

// schema
// todo refactor form to post everywhere in this project
const FormSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
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
FormSchema.pre('save', function(next) {
    this.increment();
    return next();
})

// static-methods
FormSchema.statics.createForm = async function(title, desc, author){
    const response = {
        created: false,
        message: "",
        id: ""
    }
    const formExist = await this.exists({title: title, author: author}) // * can use user model to reduce query time but, need to populate user object's fields 
    if(formExist){
        response.message = "you used this title already"
        return response
    }
    try{
        const form = await this.create({
            title: title,
            desc: desc,
            author: author
        })
        response.created = true
        response.message = "ok"
        response.id = form._id
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

FormSchema.statics.deleteForm = async function(formId){
    const response = {
        deleted: false,
        message: ""
    }
    const formExist = await this.exists({_id: formId})
    if(!formExist){
        response.message = "form doesn't exist"
        return response
    }
    try{
        await this.deleteOne({_id: formId})
        response.deleted = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response
}

FormSchema.statics.getAllForms = async function(limit){
    const response = {
        retrieved: false,
        message: "",
        forms: []
    }
    const forms = await this.find({}).sort({_id: -1}).limit(limit).populate("author", "name")
    if(forms.length == 0){
        response.message = "no forms exist"
        return response
    }
    response.retrieved = true
    response.message = "ok"
    response.forms = forms
    return response
}

FormSchema.statics.getFullForm = async function(formId){
    const response = {
        retrieved: false,
        message: "",
        form: null
    }
    try{
        const formExist = await this.exists({_id: formId})
        if(!formExist){
            response.message = "form doesn't exist"
            return response
        }
        const form = await this.findById(formId).populate("author", "name _id").populate("reviews", "-form")
        await form.populate("reviews.author", "name _id") 
        response.retrieved = true
        response.message = "ok"
        response.form = form
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
FormSchema.statics.addReview = async function(formId, reviewId){
    const response = {
        added: false,
        message: ""
    }
    try{
        const form = await this.findById(formId)
        if(form === null){
            response.message = "form doesn't exist"
            return response
        }
        form.reviews.push(reviewId)
        await form.save()
        response.added = true
        response.message = "ok"
    }
    catch(err){
        response.message = "server error " + err
    }
    return response 
}

module.exports = mongoose.model('Form', FormSchema)