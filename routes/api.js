// environment
require("dotenv").config()

// packages
const express = require('express')

// utilities
const {clearDatabase, loadDatabase} = require('../databaseUtility.js')

// constants
const router = express.Router()

// routes /api/
router.post('/clear', async (req, res) => {
    let username = req.body.adminUsername
    let password = req.body.adminPassword
    let adminUsername = process.env.ADMIN_USERNAME
    let adminPassword = process.env.ADMIN_PASSWORD
    if(username !== adminUsername || password !== adminPassword){
        return res.json({"cleared": false, "message": "invalid credentials"})
    }
    await clearDatabase()
    return res.json({"cleared": true, "message": "database cleared"})
})

router.post('/load', async (req, res) => {
    let username = req.body.adminUsername
    let password = req.body.adminPassword
    let adminUsername = process.env.ADMIN_USERNAME
    let adminPassword = process.env.ADMIN_PASSWORD
    if(username !== adminUsername || password !== adminPassword){
        return res.json({"loaded": false, "message": "invalid credentials"})
    }
    await loadDatabase()
    return res.json({"loaded": true, "message": "database loaded"})
})

router.post('/reset', async (req, res) => {
    let username = req.body.adminUsername
    let password = req.body.adminPassword
    let adminUsername = process.env.ADMIN_USERNAME
    let adminPassword = process.env.ADMIN_PASSWORD
    if(username !== adminUsername || password !== adminPassword){
        return res.json({"reset": false, "message": "invalid credentials"})
    }
    await clearDatabase()
    await loadDatabase()
    return res.json({"reset": true, "message": "database reset"})
})

module.exports = router