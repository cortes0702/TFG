// Resources
require('dotenv').config()

// Archivos hbs
const hbs = require('hbs')

// Method override
const methodOverride = require('method-override')

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

// Inicializaciones
const app = express()
require('./config/passport')


// DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err))

// Settings
app.set('views', path.join(__dirname, 'views'))
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

// Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  app.locals.signupMessage = req.flash('signupMessage')
  app.locals.signinMessage = req.flash('signinMessage')
  app.locals.user = req.user
  next()
})

// Routes
app.use('/', require('./routes/index'))

module.exports = app
