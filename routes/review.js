const express = require('express')
const router = express.Router({ mergeParams: true })
const Reviewcontroller = require('../controllers/review.js')
const error = require('../errors/wrapAsync.js')
const middleware = require('../middleware.js')

router.post('/', middleware.validateReview, middleware.loggedIn, error.wrapAsync(Reviewcontroller.addReview))

router.delete('/:reviewId', middleware.loggedIn, middleware.ownerReview, error.wrapAsync(Reviewcontroller.deleteReview))

module.exports = router;