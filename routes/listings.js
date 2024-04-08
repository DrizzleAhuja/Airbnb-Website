const express = require('express');
const router = express.Router();
const ListingController = require('../controllers/listings.js');
const middleware = require('../middleware.js');
const { uploadit } = require('../cloudConfig.js');
const error = require('../errors/wrapAsync.js')

router
    .route('/')
    .get(error.wrapAsync(ListingController.getallListings))
    .post(
        uploadit.single('listingImage'),
        middleware.validateListing,
        middleware.loggedIn,
        error.wrapAsync(ListingController.addnewListing2)
    );

router.get('/new', middleware.loggedIn, error.wrapAsync(ListingController.addnewListing));

router
    .route('/:id')
    .get(error.wrapAsync(ListingController.showListing))
    .delete(middleware.loggedIn, middleware.ownerListing, error.wrapAsync(ListingController.deleteListing));

router
    .route('/:id/edit')
    .get(middleware.loggedIn, middleware.ownerListing, error.wrapAsync(ListingController.editListing))
    .put(
        uploadit.single('listingImage'),
        middleware.validateListing,
        middleware.loggedIn,
        middleware.ownerListing,
        error.wrapAsync(ListingController.editListing2)
    );

module.exports = router;
