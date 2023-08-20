const mongoose = require('mongoose')

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
    form: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Form',
        required: true
    }
})

module.exports = mongoose.model('Review', ReviewSchema)