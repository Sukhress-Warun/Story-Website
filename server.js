// todo major change in website
/* 
todo - entity 'form' changes to 'story', schema changes accordingly
todo - entities 'review', 'user' also changes accordingly 
todo - entire codebase changes so that this website is used to post stories, get ratings,reviews from other users ...
*/       
// environment
require("dotenv").config()

// packages
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
const pug = require('pug')
const path = require('path')

// constants
const app = express()

// db connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// app settings
app.set('view engine', 'pug')

// app's third party middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'static')));
app.use(session({ 		
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 120000
  }
}))

// custom middlewares
// app.use()

// importing routes
const user = require('./routes/user')
const form = require('./routes/form')
const review = require('./routes/review')

// adding routes
app.use('/user', user)
app.use('/form', form)
app.use('/review', review)

// home route
app.get('/', async (req, res)=>{
    return res.render('index.pug')
})

// listen on port
app.listen(process.env.PORT, () =>{
    console.log("server started")
});