// Recursos
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// DB
const users = require('../models/user')



passport.serializeUser((user, done) => {
    done(null, user.id)
})


passport.deserializeUser(async (id, done) => {
    const user = await users.findById(id)
    done(null, user)
})


// Estrategia de registro
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await users.findOne({ email: email })
    const username = await users.findOne({ username: req.body.username })
    if (user) {
        return done(null, false, req.flash('signupMessage', 'The email is registered'))
    } else if (username) {
        return done(null, false, req.flash('signupMessage', 'The user is registered'))
    } else {
        const newUser = new users()
        newUser.username = req.body.username
        newUser.email = email
        newUser.password = newUser.encryptPassword(password)
        await newUser.save()
        done(null, newUser)
    }
}))


// Estrategia de inicio de sesión
passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await users.findOne({ email: email })
    if (!user) {
        return done(null, false, req.flash('signinMessage', 'User doesn´t exist'))
    }
    else if (!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Incorrect password'))
    } else {
        done(null, user)
    }
}))
