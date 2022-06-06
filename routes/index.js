// Recursos
const express = require('express')
const router = express.Router()
const passport = require('passport')
const fetch = require('node-fetch')
const async = require('hbs/lib/async')

// DB
const db = require('../models/base')



/// => Usuario no logeado
router.get('/', (req, res, next) => {
  res.render('home')
})
router.get('/about', (req, res, next) => {
  res.render('about')
})
router.get('/support', (req, res, next) => {
  res.render('support')
})
router.get('/news', (req, res, next) => {
  fetch('https://cortes0702.github.io/jaumecortes/news.json')
    .then(response => response.json())
    .then(data => {
      const list = data.articles
      res.render('news', { list })
    })
    .catch(err => console.log(err))
})


// Registrarse
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up')
})
router.post('/sign-up', passport.authenticate('local-signup', {
  successRedirect: '/sign-in',
  failureRedirect: '/sign-up',
  passReqToCallback: true
}))


// Iniciar sesión
router.get('/sign-in', (req, res, next) => {
  res.render('sign-in')
})
router.post('/sign-in', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/sign-in',
  passReqToCallback: true
}))



/// => Usuario logeado
router.get('/configuration', isAuthenticated, async (req, res, next) => {
  const data = await db.find()
  res.render('configuration', { data })
})


// Crear
router.get('/configuration/create', isAuthenticated, (req, res, next) => {
  res.render('create')
})
router.post('/configuration/create-add', isAuthenticated, async (req, res, next) => {
  const add = new db(req.body)
  await add.save()
  res.redirect('/configuration')
})


// Editar
router.get('/configuration/editor/:id', isAuthenticated, async (req, res, next) => {
  const edit = await db.findById(req.params.id)
  res.render('edit', { edit })
})
router.post('/configuration/editor-edit/:id', isAuthenticated, async (req, res, next) => {
  const edit = await db.findByIdAndUpdate(req.params.id, req.body)
  res.redirect('/configuration')
})


// Eliminar
router.delete('/configuration/delete/:id', isAuthenticated, async (req, res, next) => {
  await db.findByIdAndDelete(req.params.id)
  res.redirect('/configuration')
})

// Cerrar sesión
router.get('/log-out', isAuthenticated, (req, res, next) => {
  req.session.destroy()
  req.logout()
  res.redirect('/')
})



// 404
router.get('*', function (req, res, next) {
  res.render('error')
})



// Rutas protegidas
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/sign-in')
}

module.exports = router
