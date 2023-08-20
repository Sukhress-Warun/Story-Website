const mongoose = require('mongoose') 

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

FormSchema.pre('save', function(next) {
    this.increment();
    return next();
})

// FormSchema.statics.createForm()

module.exports = mongoose.model('Form', FormSchema)