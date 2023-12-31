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
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 120000
  }
}))

// custom middlewares
// app.use()

// importing routes
const user = require('./routes/user')
const story = require('./routes/story')
const review = require('./routes/review')

// adding routes
app.use('/user', user)
app.use('/story', story)
app.use('/review', review)

// home route
app.get('/', async (req, res)=>{
  return res.render('index.pug',{auth: req.session.user !== undefined})
})

// listen on port
app.listen(process.env.PORT, () =>{
    console.log("server started")
});