

const { listingSchema, reviewSchema } = require('./Schema.js');

const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./errors/ExpressError.js')

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.sessionurl = req.session.redirectUrl;
    }
    next()
}

module.exports.loggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'LogIn into your account to proceed')
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/signin')
    }
    next()
};

module.exports.ownerListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        if (!listing.user.equals(req.user._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.ownerReview = async (req, res, next) => {
    try {
        const { listingId, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${listingId}`);
        }
        if (!review.user.equals(req.user._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${listingId}`);
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};