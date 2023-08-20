// packages
const express = require('express')

// constants
const router = express.Router()

// models
const Form = require('../models/form')

// sessions middlewares
const {allowOnlyAuth} = require('../sessions')

// routes /form/
router.get('/', (req, res) => {
    res.send("form")
})

module.exports = router