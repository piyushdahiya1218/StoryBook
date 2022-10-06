const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphandlebars = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const exp = require('constants')

//load config
dotenv.config({path: './config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//body parser
app.use(express.urlencoded({extender: false}))
app.use(express.json())

//logging http requests
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handlebars
app.engine('.hbs', exphandlebars.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT

app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode, on port ${PORT}`)
)