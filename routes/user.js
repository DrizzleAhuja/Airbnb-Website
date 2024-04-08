const express = require('express')
const router = express.Router({ mergeParams: true })
const Usercontroller = require('../controllers/user.js')
const error = require('../errors/wrapAsync.js')
const middleware = require('../middleware.js')
const passport = require('passport')

router.route('/signup').get(Usercontroller.signup).post(error.wrapAsync(Usercontroller.signup2))

router.route('/signin').get(Usercontroller.signin).post(middleware.saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/signin', failureFlash: true }), Usercontroller.signin2)

router.get('/signout', Usercontroller.logout)

module.exports = router;

